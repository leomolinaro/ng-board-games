import { inject, Injectable } from "@angular/core";
import { WotrUiAbility } from "../ability/wotr-ability";
import { WotrCardId } from "../card/wotr-card-models";
import {
  WotrActionApplierMap,
  WotrActionLoggerMap,
  WotrStoryApplier
} from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrGameQuery } from "../game/wotr-game-query";
import {
  WotrCharacterEffectStory,
  WotrSkipCharacterEffectStory,
  WotrStory
} from "../game/wotr-story-models";
import { WotrLogWriter } from "../log/wotr-log-writer";
import { WotrNationHandler } from "../nation/wotr-nation-handler";
import { WotrPlayer } from "../player/wotr-player";
import { WotrRegion, WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import {
  eliminateCharacter,
  gollumEnterFellowship,
  WotrCharacterAction,
  WotrCharacterElimination,
  WotrGollumEnterFellowship
} from "./wotr-character-actions";
import { WotrCharacter, WotrCharacterId, WotrCompanionId } from "./wotr-character-models";
import { WotrCharacterModifiers } from "./wotr-character-modifiers";
import { WotrCharacterStore } from "./wotr-character-store";
import { WotrCharacterAbilities } from "./wotr-characters";

@Injectable()
export class WotrCharacterHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private nationHandler = inject(WotrNationHandler);
  private characterStore = inject(WotrCharacterStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);
  private logger = inject(WotrLogWriter);
  private q = inject(WotrGameQuery);
  private characterModifiers = inject(WotrCharacterModifiers);

  characterAbilities: WotrCharacterAbilities = null as any;

  init() {
    this.actionRegistry.registerActions(this.getActionAppliers() as any);
    this.actionRegistry.registerActionLoggers(this.getActionLoggers() as any);
    this.actionRegistry.registerEffectLogger<WotrGollumEnterFellowship>(
      "gollum-enter-fellowship",
      (effect, f) => [f.character("gollum"), " enters the Fellowship as Guide"]
    );
    this.actionRegistry.registerEffectLogger<WotrCharacterElimination>(
      "character-elimination",
      (effect, f) => [f.character(effect.characters[0]), " is eliminated"]
    );
    this.actionRegistry.registerStory("character-effect", this.reactionCharacter);
    this.actionRegistry.registerStory("character-effect-skip", this.reactionCharacterSkip);
  }

  private reactionCharacter: WotrStoryApplier<WotrCharacterEffectStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logger.logAction(action, story, front);
      await this.actionRegistry.applyAction(action, front);
    }
  };

  private reactionCharacterSkip: WotrStoryApplier<WotrSkipCharacterEffectStory> = async (
    story,
    front
  ) => {
    this.logger.logStory(story, front);
  };

  getActionAppliers(): WotrActionApplierMap<WotrCharacterAction> {
    return {
      "character-play": (action, front) => this.playCharacters(action.characters, action.region),
      "character-movement": (action, front) =>
        this.moveCharacters(action.characters, action.fromRegion, action.toRegion),
      "character-elimination": (action, front) => this.eliminateCharacters(action.characters),
      "gollum-enter-fellowship": (action, front) => {},
      "character-choose": (action, front) => {}
    };
  }

  playCharacters(characters: WotrCharacterId[], regionId: WotrRegionId) {
    const region = this.regionStore.region(regionId);
    const removingCharacters: WotrCharacterId[] = [];
    for (const characterId of characters) {
      switch (characterId) {
        case "aragorn": {
          removingCharacters.push("strider");
          break;
        }
        case "gandalf-the-white": {
          const gandalf = this.characterStore.character("gandalf-the-grey");
          if (gandalf.status === "inPlay") {
            removingCharacters.push("gandalf-the-grey");
          }
          break;
        }
      }
      const character = this.characterStore.character(characterId);
      this.characterStore.setInPlay(characterId);
      this.addCharacterToRegion(character, region);
      this.characterAbilities.resolveBringIntoPlayEffects(characterId);
    }
    this.nationHandler.checkNationActivationByCharacters(regionId, characters);
    for (const characterId of removingCharacters) {
      this.removeCharacter(characterId);
    }
    this.characterAbilities.activateAbilities(characters);
  }

  async eliminateCharacterEffect(character: WotrCharacterId): Promise<void> {
    this.eliminateCharacters([character]);
    this.logger.logEffect(eliminateCharacter(character));
  }

  async eliminateCharacters(characters: WotrCharacterId[]): Promise<void> {
    for (const characterId of characters) {
      const character = this.characterStore.character(characterId);
      this.removeCharacter(characterId);
      await this.characterModifiers.onAfterCharacterElimination(characterId);
      if (character.status === "inFellowship") {
        await this.characterModifiers.onAfterCompanionLeavingTheFellowship(
          characterId as WotrCompanionId
        );
      }
    }
    await this.checkWornWithSorrowAndToil();
    await this.checkGollumEnterPlay();
  }

  private async checkGollumEnterPlay() {
    if (this.q.fellowship.hasCompanions()) return;
    if (!this.q.gollum.isAvailable()) return;
    this.fellowshipStore.setGuide("gollum");
    this.characterStore.setInFellowship("gollum");
    this.logger.logEffect(gollumEnterFellowship());
  }

  private removeCharacter(characterId: WotrCharacterId): void {
    const character = this.characterStore.character(characterId);
    if (character.status === "inFellowship") {
      this.fellowshipStore.removeCompanion(characterId);
    } else if (character.status === "inPlay") {
      const region = this.regionStore.characterRegion(characterId);
      if (region) this.removeCharacterFromRegion(character, region);
    }
    this.characterStore.setEliminated(characterId);
    this.characterAbilities.deactivateAbilities(characterId);
  }

  moveCharacters(
    characters: WotrCharacterId[],
    fromRegionId: WotrRegionId,
    toRegionId: WotrRegionId
  ): void {
    const fromRegion = this.regionStore.region(fromRegionId);
    const toRegion = this.regionStore.region(toRegionId);
    for (const characterId of characters) {
      const character = this.characterStore.character(characterId);
      this.removeCharacterFromRegion(character, fromRegion);
      this.addCharacterToRegion(character, toRegion);
    }
    this.nationHandler.checkNationActivationByCharacters(toRegionId, characters);
  }

  addCharacterToRegion(character: WotrCharacter, region: WotrRegion) {
    if (region.army?.front === character.front) {
      this.regionStore.addCharacterToArmy(character.id, region.id);
    } else if (region.underSiegeArmy?.front === character.front) {
      this.regionStore.addCharacterToUnderSiegeArmy(character.id, region.id);
    } else {
      this.regionStore.addCharacterToFreeUnits(character.id, region.id);
    }
  }

  private removeCharacterFromRegion(character: WotrCharacter, region: WotrRegion) {
    if (region.army?.front === character.front) {
      this.regionStore.removeCharacterFromArmy(character.id, region.id);
    } else if (region.underSiegeArmy?.front === character.front) {
      this.regionStore.removeCharacterFromUnderSiegeArmy(character.id, region.id);
    } else {
      this.regionStore.removeCharacterFromFreeUnits(character.id, region.id);
    }
  }

  private async checkWornWithSorrowAndToil() {
    if (this.q.shadow.hasTableCard("scha15")) {
      throw new Error("Worn with Sorrow and Toil not implemented");
      // await this.activateTableCard("scha15", this.shadow);
    }
  }

  async activateTableCard(
    ability: WotrUiAbility,
    cardId: WotrCardId,
    player: WotrPlayer
  ): Promise<WotrStory> {
    return player.activateTableCard(ability, cardId);
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrCharacterAction> {
    return {
      "character-elimination": (action, front, f) => [
        f.player(front),
        " removes ",
        this.charactersLog(action.characters)
      ],
      "character-movement": (action, front, f) => [
        f.player(front),
        " moves ",
        this.charactersLog(action.characters),
        " to ",
        f.region(action.toRegion)
      ],
      "character-play": (action, front, f) => [
        f.player(front),
        " plays ",
        this.charactersLog(action.characters),
        " in ",
        f.region(action.region)
      ],
      "gollum-enter-fellowship": (action, front, f) => [],
      "character-choose": (action, front, f) => [
        f.player(front),
        " chooses ",
        this.charactersLog(action.characters)
      ]
    };
  }

  private charactersLog(characters: WotrCharacterId[]) {
    return characters.map(c => this.characterStore.character(c).name).join(", ");
  }
}

import { inject, Injectable } from "@angular/core";
import { WotrCardId } from "../card/wotr-card-models";
import {
  WotrActionApplierMap,
  WotrActionLoggerMap,
  WotrStoryApplier
} from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";
import {
  WotrCharacterReactionStory,
  WotrGameStory,
  WotrSkipCharacterReactionStory
} from "../game/wotr-story-models";
import { WotrLogWriter } from "../log/wotr-log-writer";
import { WotrNationHandler } from "../nation/wotr-nation-handler";
import { WotrPlayer } from "../player/wotr-player";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrRegion, WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrCharacterAction, WotrCharacterMovement } from "./wotr-character-actions";
import { WotrCharacter, WotrCharacterId } from "./wotr-character-models";
import { WotrCharacterStore } from "./wotr-character-store";
import { WotrCharacters } from "./wotr-characters";

@Injectable({ providedIn: "root" })
export class WotrCharacterHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private nationHandler = inject(WotrNationHandler);
  private characterStore = inject(WotrCharacterStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);
  private frontStore = inject(WotrFrontStore);
  private logger = inject(WotrLogWriter);

  private shadow = inject(WotrShadowPlayer);

  private characters = inject(WotrCharacters);

  init() {
    this.actionRegistry.registerActions(this.getActionAppliers() as any);
    this.actionRegistry.registerActionLoggers(this.getActionLoggers() as any);
    this.actionRegistry.registerStory("reaction-character", this.reactionCharacter);
    this.actionRegistry.registerStory("reaction-character-skip", this.reactionCharacterSkip);
  }

  private reactionCharacter: WotrStoryApplier<WotrCharacterReactionStory> = async (
    story,
    front
  ) => {
    for (const action of story.actions) {
      this.logger.logAction(action, story, front);
      await this.actionRegistry.applyAction(action, front);
    }
  };

  private reactionCharacterSkip: WotrStoryApplier<WotrSkipCharacterReactionStory> = async (
    story,
    front
  ) => {
    this.logger.logStory(story, front);
  };

  getActionAppliers(): WotrActionApplierMap<WotrCharacterAction> {
    return {
      "character-play": (action, front) => this.playCharacters(action.characters, action.region),
      "character-movement": (action, front) => this.moveCharacters(action, front),
      "character-elimination": (action, front) => this.eliminateCharacters(action.characters)
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
    }
    this.nationHandler.checkNationActivationByCharacters(regionId, characters);
    for (const characterId of removingCharacters) {
      this.removeCharacter(characterId);
    }
    this.characters.activateAbilities(characters);
  }

  async eliminateCharacters(characters: WotrCharacterId[]): Promise<void> {
    for (const characterId of characters) {
      this.removeCharacter(characterId);
    }
    await this.checkWornWithSorrowAndToil();
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
    this.characters.deactivateAbilities(characterId);
  }

  moveCharacters(action: WotrCharacterMovement, front: WotrFrontId): void {
    const fromRegion = this.regionStore.region(action.fromRegion);
    const toRegion = this.regionStore.region(action.toRegion);
    for (const characterId of action.characters) {
      const character = this.characterStore.character(characterId);
      this.removeCharacterFromRegion(character, fromRegion);
      this.addCharacterToRegion(character, toRegion);
    }
    this.nationHandler.checkNationActivationByCharacters(action.toRegion, action.characters);
  }

  addCharacterToRegion(character: WotrCharacter, region: WotrRegion) {
    if (region.army?.front === character.front) {
      this.regionStore.addCharacterToArmy(character.id, region.id);
    } else {
      this.regionStore.addCharacterToFreeUnits(character.id, region.id);
    }
  }

  private removeCharacterFromRegion(character: WotrCharacter, region: WotrRegion) {
    if (region.army?.front === character.front) {
      this.regionStore.removeCharacterFromArmy(character.id, region.id);
    } else {
      this.regionStore.removeCharacterFromFreeUnits(character.id, region.id);
    }
  }

  private async checkWornWithSorrowAndToil() {
    if (this.frontStore.hasTableCard("scha15", "shadow")) {
      await this.activateTableCard("scha15", this.shadow);
    }
  }

  async activateTableCard(cardId: WotrCardId, player: WotrPlayer): Promise<WotrGameStory> {
    return player.activateTableCard(cardId);
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
      ]
    };
  }

  private charactersLog(characters: WotrCharacterId[]) {
    return characters.map(c => this.characterStore.character(c).name).join(", ");
  }
}

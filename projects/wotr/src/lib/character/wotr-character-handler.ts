import { inject, Injectable } from "@angular/core";
import { unexpectedStory } from "@leobg/commons";
import { WotrCardId } from "../card/wotr-card.models";
import {
  WotrAction,
  WotrActionApplierMap,
  WotrActionLoggerMap,
  WotrStoryApplier
} from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import {
  WotrCharacterReactionStory,
  WotrGameStory,
  WotrSkipCharacterReactionStory
} from "../game/wotr-story.models";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrNationHandler } from "../nation/wotr-nation-handler";
import { WotrPlayer } from "../player/wotr-player";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrRegion } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrCharacterAction, WotrCharacterMovement } from "./wotr-character-actions";
import { WotrCharacter, WotrCharacterId } from "./wotr-character.models";
import { WotrCharacterStore } from "./wotr-character.store";

@Injectable({ providedIn: "root" })
export class WotrCharacterHandler {
  private actionService = inject(WotrActionService);
  private nationHandler = inject(WotrNationHandler);
  private characterStore = inject(WotrCharacterStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);
  private frontStore = inject(WotrFrontStore);
  private logStore = inject(WotrLogStore);

  private shadow = inject(WotrShadowPlayer);

  init() {
    this.actionService.registerActions(this.getActionAppliers() as any);
    this.actionService.registerActionLoggers(this.getActionLoggers() as any);
    this.actionService.registerStory("reaction-character", this.reactionCharacter);
    this.actionService.registerStory("reaction-character-skip", this.reactionCharacterSkip);
  }

  private reactionCharacter: WotrStoryApplier<WotrCharacterReactionStory> = async (
    story,
    front
  ) => {
    for (const action of story.actions) {
      this.logStore.logAction(action, story, front);
      await this.actionService.applyAction(action, front);
    }
  };

  private reactionCharacterSkip: WotrStoryApplier<WotrSkipCharacterReactionStory> = async (
    story,
    front
  ) => {
    this.logStore.logStory(story, front);
  };

  getActionAppliers(): WotrActionApplierMap<WotrCharacterAction> {
    return {
      "character-play": async (action, front) => {
        const region = this.regionStore.region(action.region);
        for (const characterId of action.characters) {
          switch (characterId) {
            case "aragorn": {
              const striderRegion = this.regionStore.characterRegion("strider")!;
              const strider = this.characterStore.character("strider");
              this.characterStore.setEliminated("strider");
              this.removeCharacterFromRegion(strider, striderRegion);
              break;
            }
            case "gandalf-the-white": {
              const gandalf = this.characterStore.character("gandalf-the-grey");
              if (gandalf.status === "inPlay") {
                const gandalfRegion = this.regionStore.characterRegion("gandalf-the-grey")!;
                this.characterStore.setEliminated("gandalf-the-grey");
                this.removeCharacterFromRegion(gandalf, gandalfRegion);
              }
              break;
            }
          }
          const character = this.characterStore.character(characterId);
          this.characterStore.setInPlay(characterId);
          this.addCharacterToRegion(character, region);
        }
        this.nationHandler.checkNationActivationByCharacters(action.region, action.characters);
      },
      "character-movement": async (action, front) => this.moveCharacters(action, front),
      "character-elimination": async (action, front) => {
        for (const characterId of action.characters) {
          const character = this.characterStore.character(characterId);
          if (character.status === "inFellowship") {
            this.fellowshipStore.removeCompanion(characterId);
          } else if (character.status === "inPlay") {
            let region = this.regionStore
              .regions()
              .find(r => r.army?.characters?.includes(characterId));
            if (region) {
              this.regionStore.removeCharacterFromArmy(characterId, region.id);
            } else {
              region = this.regionStore
                .regions()
                .find(r => r.freeUnits?.characters?.includes(characterId));
              if (region) {
                this.regionStore.removeCharacterFromFreeUnits(characterId, region.id);
              }
            }
          }
          this.characterStore.setEliminated(characterId);
        }
        await this.checkWornWithSorrowAndToil();
      }
    };
  }

  async moveCharacters(action: WotrCharacterMovement, front: WotrFrontId): Promise<void> {
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
        this.characters(action.characters)
      ],
      "character-movement": (action, front, f) => [
        f.player(front),
        " moves ",
        this.characters(action.characters),
        " to ",
        f.region(action.toRegion)
      ],
      "character-play": (action, front, f) => [
        f.player(front),
        " plays ",
        this.characters(action.characters),
        " in ",
        f.region(action.region)
      ]
    };
  }

  private characters(characters: WotrCharacterId[]) {
    return characters.map(c => this.characterStore.character(c).name).join(", ");
  }

  async activateCharacterAbility(
    characterId: WotrCharacterId,
    player: WotrPlayer
  ): Promise<false | WotrAction[]> {
    const story = await player.activateCharacterAbility(characterId);
    switch (story.type) {
      case "reaction-character":
        return story.actions;
      case "reaction-character-skip":
        return false;
      default:
        throw unexpectedStory(story, " character activation or not");
    }
  }
}

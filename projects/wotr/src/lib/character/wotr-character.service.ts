import { Injectable, inject } from "@angular/core";
import { unexpectedStory } from "@leobg/commons";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrAction, WotrActionApplierMap, WotrActionLoggerMap, WotrStoryApplier } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrCharacterReactionStory, WotrGameStory, WotrSkipCharacterReactionStory } from "../game/wotr-story.models";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrNationId } from "../nation/wotr-nation.models";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrFreePeoplesPlayer } from "../player/wotr-free-peoples-player";
import { WotrPlayer } from "../player/wotr-player";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrRegion, WotrRegionId } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrCharacterAction } from "./wotr-character-actions";
import { WotrCharacter, WotrCharacterId } from "./wotr-character.models";
import { WotrCharacterStore } from "./wotr-character.store";

@Injectable()
export class WotrCharacterService {
  private actionService = inject(WotrActionService);
  private nationService = inject(WotrNationService);
  private nationStore = inject(WotrNationStore);
  private characterStore = inject(WotrCharacterStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);
  private frontStore = inject(WotrFrontStore);
  private logStore = inject(WotrLogStore);

  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);

  init() {
    this.actionService.registerActions(this.getActionAppliers() as any);
    this.actionService.registerActionLoggers(this.getActionLoggers() as any);
    this.actionService.registerStory("reaction-character", this.reactionCharacter);
    this.actionService.registerStory("reaction-character-skip", this.reactionCharacterSkip);
  }

  private reactionCharacter: WotrStoryApplier<WotrCharacterReactionStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logStore.logAction(action, story, front);
      await this.actionService.applyAction(action, front);
    }
  };

  private reactionCharacterSkip: WotrStoryApplier<WotrSkipCharacterReactionStory> = async (story, front) => {
    this.logStore.logStory(story, front);
  };

  getActionAppliers(): WotrActionApplierMap<WotrCharacterAction> {
    return {
      "character-play": async (action, front) => {
        const region = this.regionStore.region(action.region);
        for (const characterId of action.characters) {
          const character = this.characterStore.character(characterId);
          this.characterStore.setInPlay(characterId);
          this.addCharacterToRegion(character, region);
        }
        this.nationService.checkNationActivationByCharacters(action.region, action.characters);
      },
      "character-movement": async (action, front) => {
        const fromRegion = this.regionStore.region(action.fromRegion);
        const toRegion = this.regionStore.region(action.toRegion);
        for (const characterId of action.characters) {
          const character = this.characterStore.character(characterId);
          this.removeCharacterFromRegion(character, fromRegion);
          this.addCharacterToRegion(character, toRegion);
        }
        this.nationService.checkNationActivationByCharacters(action.toRegion, action.characters);
      },
      "character-elimination": async (action, front) => {
        for (const characterId of action.characters) {
          const character = this.characterStore.character(characterId);
          if (character.status === "inFellowship") {
            this.fellowshipStore.removeCompanion(characterId);
          } else if (character.status === "inPlay") {
            let region = this.regionStore.regions().find(r => r.army?.characters?.includes(characterId));
            if (region) {
              this.regionStore.removeCharacterFromArmy(characterId, region.id);
            } else {
              region = this.regionStore.regions().find(r => r.freeUnits?.characters?.includes(characterId));
              if (region) {
                this.regionStore.removeCharacterFromFreeUnits(characterId, region.id);
              }
            }
          }
          this.characterStore.setEliminated(characterId);
        }
        await this.checkWornWithSorrowAndToil();
      },
      "companion-random": async (action, front) => {
        /*empty*/
      },
      "companion-separation": async (action, front) => {
        const toRegion = this.regionStore.region(action.toRegion);
        for (const companionId of action.companions) {
          this.fellowshipStore.removeCompanion(companionId);
          this.characterStore.setInPlay(companionId);
          const character = this.characterStore.character(companionId);
          this.addCharacterToRegion(character, toRegion);
        }
        this.nationService.checkNationActivationByCharacters(action.toRegion, action.companions);
      }
    };
  }

  private addCharacterToRegion(character: WotrCharacter, region: WotrRegion) {
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
      "character-elimination": (action, front, f) => [f.player(front), " removes ", this.characters(action.characters)],
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
      ],
      "companion-random": (action, front, f) => [
        f.player(front),
        " draws ",
        this.characters(action.companions),
        " randomly"
      ],
      "companion-separation": (action, front, f) => [
        f.player(front),
        " separates ",
        this.characters(action.companions),
        " from the fellowship"
      ]
    };
  }

  private characters(characters: WotrCharacterId[]) {
    return characters.map(c => this.characterStore.character(c).name).join(", ");
  }

  async activateCharacterAbility(characterId: WotrCharacterId, player: WotrPlayer): Promise<false | WotrAction[]> {
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

  isAvailable(characterId: WotrCharacterId) {
    return this.characterStore.isAvailable(characterId);
  }
  isAtWar(nationId: WotrNationId): boolean {
    return this.nationStore.isAtWar(nationId);
  }
  someFreePeoplesNationIsAtWar(): boolean {
    return this.nationStore.freePeoplesNations().some(n => this.isAtWar(n.id));
  }
  isUnconquered(regionId: WotrRegionId): boolean {
    return this.regionStore.isUnconquered(regionId);
  }
  someRegionWithShadowArmyAndSauronUnit(): boolean {
    return this.regionStore.regions().some(r => {
      if (!r.army) {
        return false;
      }
      if (r.army.front !== "shadow") {
        return false;
      }
      return r.army.regulars?.some(u => u.nation === "sauron") || r.army.elites?.some(c => c.nation === "sauron");
    });
  }
  someRegionWithUnconqueredSauronStronghold(): boolean {
    return this.regionStore
      .regions()
      .some(r => r.nationId === "sauron" && this.regionStore.isUnconquered(r.id) && r.settlement === "stronghold");
  }
  isFellowshipOnMordorTrack(): boolean {
    return this.fellowshipStore.isOnMordorTrack();
  }
  victoryPoints(frontId: WotrFrontId): number {
    return this.frontStore.front(frontId).victoryPoints;
  }
}

import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrRegion } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrCharacterAction } from "./wotr-character-actions";
import { WotrCharacter, WotrCharacterId } from "./wotr-character.models";
import { WotrCharacterStore } from "./wotr-character.store";

@Injectable ()
export class WotrCharacterService {
  
  private actionService = inject (WotrActionService);
  private nationService = inject (WotrNationService);
  private characterStore = inject (WotrCharacterStore);
  private fellowshipStore = inject (WotrFellowshipStore);
  private regionStore = inject (WotrRegionStore);
  private frontStore = inject (WotrFrontStore);
  private storyService = inject (WotrStoryService);

  init () {
    this.actionService.registerActions (this.getActionAppliers () as any);
  }

  getActionAppliers (): WotrActionApplierMap<WotrCharacterAction> {
    return {
      "character-play": async (action, front) => {
        const region = this.regionStore.region (action.region);
        for (const characterId of action.characters) {
          const character = this.characterStore.character (characterId);
          this.characterStore.setInPlay (characterId);
          this.addCharacterToRegion (character, region);
        }
        this.nationService.checkNationActivationByCharacters (action.region, action.characters);
      },
      "character-movement": async (action, front) => {
        const fromRegion = this.regionStore.region (action.fromRegion);
        const toRegion = this.regionStore.region (action.toRegion);
        for (const characterId of action.characters) {
          const character = this.characterStore.character (characterId);
          this.removeCharacterFromRegion (character, fromRegion);
          this.addCharacterToRegion (character, toRegion);
        }
        this.nationService.checkNationActivationByCharacters (action.toRegion, action.characters);
      },
      "character-elimination": async (action, front) => {
        for (const characterId of action.characters) {
          const character = this.characterStore.character (characterId);
          if (character.status === "inFellowship") {
            this.fellowshipStore.removeCompanion (characterId);
          } else if (character.status === "inPlay") {
            let region = this.regionStore.regions ().find (r => r.army?.characters?.includes (characterId));
            if (region) {
              this.regionStore.removeCharacterFromArmy (characterId, region.id);
            } else {
              region = this.regionStore.regions ().find (r => r.freeUnits?.characters?.includes (characterId));
              if (region) {
                this.regionStore.removeCharacterFromFreeUnits (characterId, region.id);
              }
            }
          }
          this.characterStore.setEliminated (characterId);
        }
        await this.checkWornWithSorrowAndToil ();
      },
      "companion-random": async (action, front) => { /*empty*/ },
      "companion-separation": async (action, front) => {
        const toRegion = this.regionStore.region (action.toRegion);
        for (const companionId of action.companions) {
          this.fellowshipStore.removeCompanion (companionId);
          this.characterStore.setInPlay (companionId);
          const character = this.characterStore.character (companionId);
          this.addCharacterToRegion (character, toRegion);
        }
        this.nationService.checkNationActivationByCharacters (action.toRegion, action.companions);
      }
    };
  }

  private addCharacterToRegion (character: WotrCharacter, region: WotrRegion) {
    if (region.army?.front === character.front) {
      this.regionStore.addCharacterToArmy (character.id, region.id);
    } else {
      this.regionStore.addCharacterToFreeUnits (character.id, region.id);
    }
  }

  private removeCharacterFromRegion (character: WotrCharacter, region: WotrRegion) {
    if (region.army?.front === character.front) {
      this.regionStore.removeCharacterFromArmy (character.id, region.id);
    } else {
      this.regionStore.removeCharacterFromFreeUnits (character.id, region.id);
    }
  }

  private async checkWornWithSorrowAndToil () {
    if (this.frontStore.hasTableCard ("scha15", "shadow")) {
      await this.storyService.activateTableCard ("scha15", "shadow");
    }
  }

  getActionLoggers (): WotrActionLoggerMap<WotrCharacterAction> {
    return {
      "character-elimination": (action, front, f) => [f.player (front), " removes ", this.characters (action.characters)],
      "character-movement": (action, front, f) => [f.player (front), " moves ", this.characters (action.characters), " to ", f.region (action.toRegion)],
      "character-play": (action, front, f) => [f.player (front), " plays ", this.characters (action.characters), " in ", f.region (action.region)],
      "companion-random": (action, front, f) => [f.player (front), " draws ", this.characters (action.companions), " randomly"],
      "companion-separation": (action, front, f) => [f.player (front), " separates ", this.characters (action.companions), " from the fellowship"],
    };
  }

  private characters (characters: WotrCharacterId[]) {
    return characters.map (c => this.characterStore.character (c).name).join (", ");
  }

}

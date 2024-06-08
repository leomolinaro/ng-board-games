import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrRegion } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrCharacterAction } from "./wotr-character-actions";
import { WotrCharacter } from "./wotr-character.models";
import { WotrCharacterStore } from "./wotr-character.store";

@Injectable ()
export class WotrCharacterActionsService {

  private characterStore = inject (WotrCharacterStore);
  private fellowshipStore = inject (WotrFellowshipStore);
  private regionStore = inject (WotrRegionStore);
  private frontStore = inject (WotrFrontStore);
  private storyService = inject (WotrStoryService);

  getActionAppliers (): WotrActionApplierMap<WotrCharacterAction> {
    return {
      "character-play": async (action, front) => {
        const region = this.regionStore.region (action.region);
        for (const characterId of action.characters) {
          const character = this.characterStore.character (characterId);
          this.characterStore.setInPlay (characterId);
          this.addCharacterToRegion (character, region);
        }
      },
      "character-movement": async (action, front) => {
        const fromRegion = this.regionStore.region (action.fromRegion);
        const toRegion = this.regionStore.region (action.toRegion);
        for (const characterId of action.characters) {
          const character = this.characterStore.character (characterId);
          this.removeCharacterFromRegion (character, fromRegion);
          this.addCharacterToRegion (character, toRegion);
        }
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

}

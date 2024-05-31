import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrCharacterAction } from "./wotr-character-actions";
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
      "character-elimination": async (action, front) => {
        for (const characterId of action.characters) {
          const character = this.characterStore.character (characterId);
          if (character.status === "inFellowship") {
            this.fellowshipStore.removeCompanion (characterId);
          } else if (character.status === "inPlay") {
            const region = this.regionStore.regions ().find (r => r.units.characters?.includes (characterId));
            if (region) {
              this.regionStore.removeCharacterFromRegion (characterId, region.id);
            }
          }
          this.characterStore.setEliminated (characterId);
        }
        await this.checkWornWithSorrowAndToil ();
      },
      "character-movement": async (action, front) => {
        for (const characterId of action.characters) {
          this.regionStore.removeCharacterFromRegion (characterId, action.fromRegion);
          this.regionStore.addCharacterToRegion (characterId, action.toRegion);
        }
      },
      "character-play": async (action, front) => {
        for (const characterId of action.characters) {
          this.characterStore.setInPlay (characterId);
          this.regionStore.addCharacterToRegion (characterId, action.region);
        }
      },
      "companion-random": async (action, front) => { /*empty*/ },
      "companion-separation": async (action, front) => {
        for (const companionId of action.companions) {
          this.fellowshipStore.removeCompanion (companionId);
          this.characterStore.setInPlay (companionId);
          this.regionStore.addCharacterToRegion (companionId, action.toRegion);
        }
      },
      "nazgul-movement": async (action, front) => {
        this.regionStore.removeNazgulFromRegion (action.nNazgul, action.fromRegion);
        this.regionStore.addNazgulToRegion (action.nNazgul, action.toRegion);
      },
    };
  }

  private async checkWornWithSorrowAndToil () {
    if (this.frontStore.hasTableCard ("scha15", "shadow")) {
      await this.storyService.activateTableCard ("scha15", "shadow");
    }
  }

}

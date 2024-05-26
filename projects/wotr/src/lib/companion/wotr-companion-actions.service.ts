import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrCompanionAction } from "./wotr-companion-actions";
import { WotrCompanionStore } from "./wotr-companion.store";

@Injectable ()
export class WotrCompanionActionsService {

  private companionStore = inject (WotrCompanionStore);
  private fellowshipStore = inject (WotrFellowshipStore);
  private regionStore = inject (WotrRegionStore);
  private frontStore = inject (WotrFrontStore);
  private storyService = inject (WotrStoryService);

  getActionAppliers (): WotrActionApplierMap<WotrCompanionAction> {
    return {
      "companion-elimination": async (action, front) => {
        for (const companionId of action.companions) {
          const companion = this.companionStore.companion (companionId);
          if (companion.status === "inFellowship") {
            this.fellowshipStore.removeCompanion (companionId);
          } else if (companion.status === "inPlay") {
            const region = this.regionStore.regions ().find (r => r.units.companions?.includes (companionId));
            if (region) {
              this.regionStore.removeCompanionFromRegion (companionId, region.id);
            }
          }
          this.companionStore.setEliminated (companionId);
        }
        await this.checkWornWithSorrowAndToil ();
      },
      "companion-movement": async (action, front) => {
        for (const companionId of action.companions) {
          this.regionStore.removeCompanionFromRegion (companionId, action.fromRegion);
          this.regionStore.addCompanionToRegion (companionId, action.toRegion);
        }
      },
      "companion-play": async (action, front) => {
        for (const companionId of action.companions) {
          this.companionStore.setInPlay (companionId);
          this.regionStore.addCompanionToRegion (companionId, action.region);
        }
      },
      "companion-random": async (action, front) => { /*empty*/ },
      "companion-separation": async (action, front) => {
        for (const companionId of action.companions) {
          this.companionStore.setInPlay (companionId);
          this.regionStore.addCompanionToRegion (companionId, action.toRegion);
        }
      },
    };
  }
  
  private async checkWornWithSorrowAndToil () {
    if (this.frontStore.hasTableCard ("scha15", "shadow")) {
      await this.storyService.activateTableCard ("scha15", "shadow");
    }
  }

}

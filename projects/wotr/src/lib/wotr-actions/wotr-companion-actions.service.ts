import { Injectable, inject } from "@angular/core";
import { WotrCompanionStore } from "../wotr-elements/wotr-companion.store";
import { WotrFellowshipStore } from "../wotr-elements/wotr-fellowship.store";
import { WotrRegionStore } from "../wotr-elements/wotr-region.store";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrCompanionAction } from "./wotr-companion-actions";

@Injectable ({
  providedIn: "root"
})
export class WotrCompanionActionsService {

  private companionStore = inject (WotrCompanionStore);
  private fellowshipStore = inject (WotrFellowshipStore);
  private regionStore = inject (WotrRegionStore);

  getActionAppliers (): WotrActionApplierMap<WotrCompanionAction> {
    return {
      "companion-elimination": (action, front) => {
        for (const companionId of action.companions) {
          const companion = this.companionStore.companion (companionId);
          if (companion.status === "inFellowship") {
            this.fellowshipStore.removeCompanion (companionId);
          } else if (companion.status === "inPlay") {
            const region = this.regionStore.regions ().find (r => r.companions.includes (companionId));
            if (region) {
              this.regionStore.removeCompanionFromRegion (companionId, region.id);
            }
          }
          this.companionStore.setEliminated (companionId);
        }
      },
      "companion-movement": (action, front) => {
        for (const companionId of action.companions) {
          const region = this.regionStore.regions ().find (r => r.companions.includes (companionId));
          if (region) {
            this.regionStore.removeCompanionFromRegion (companionId, region.id);
          }
          this.regionStore.addCompanionToRegion (companionId, action.toRegion);
        }
      },
      "companion-play": (action, front) => {throw new Error ("TODO")  },
      "companion-random": (action, front) => { /*empty*/ },
      "companion-separation": (action, front) => {throw new Error ("TODO")  },
    };
  }

}

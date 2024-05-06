import { Injectable, inject } from "@angular/core";
import { WotrCompanionStore } from "../../wotr-elements/companion/wotr-companion.store";
import { WotrFellowshipStore } from "../../wotr-elements/fellowship/wotr-fellowship.store";
import { WotrRegionStore } from "../../wotr-elements/region/wotr-region.store";
import { WotrActionApplierMap } from "../wotr-action-applier";
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
          this.regionStore.removeCompanionFromRegion (companionId, action.fromRegion);
          this.regionStore.addCompanionToRegion (companionId, action.toRegion);
        }
      },
      "companion-play": (action, front) => {
        for (const companionId of action.companions) {
          this.companionStore.setInPlay (companionId);
          this.regionStore.addCompanionToRegion (companionId, action.region);
        }
      },
      "companion-random": (action, front) => { /*empty*/ },
      "companion-separation": (action, front) => {
        for (const companionId of action.companions) {
          this.companionStore.setInPlay (companionId);
          this.regionStore.addCompanionToRegion (companionId, action.toRegion);
        }
      },
    };
  }

}

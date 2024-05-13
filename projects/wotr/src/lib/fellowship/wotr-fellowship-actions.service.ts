import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrFellowshipAction } from "./wotr-fellowship-actions";
import { WotrFellowshipStore } from "./wotr-fellowship.store";

@Injectable ({
  providedIn: "root"
})
export class WotrFellowshipActionsService {

  private fellowhipStore = inject (WotrFellowshipStore);
  private regionStore = inject (WotrRegionStore);

  getActionAppliers (): WotrActionApplierMap<WotrFellowshipAction> {
    return {
      "fellowship-corruption": (action, front) => { this.fellowhipStore.changeCorruption (action.quantity); },
      "fellowship-declare": (action, front) => {
        this.regionStore.moveFellowshipToRegion (action.region);
        this.fellowhipStore.setProgress (0);
      },
      "fellowship-declare-not": (action, front) => { /*empty*/ },
      "fellowship-guide": (action, front) => { this.fellowhipStore.setGuide (action.companion); },
      "fellowship-hide": (action, front) => { this.fellowhipStore.hide (); },
      "fellowship-progress": (action, front) => { this.fellowhipStore.increaseProgress (); },
      "fellowship-reveal": (action, front) => {
        this.regionStore.moveFellowshipToRegion (action.region);
        this.fellowhipStore.reveal ();
      },
    };
  }

}

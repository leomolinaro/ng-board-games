import { Injectable, inject } from "@angular/core";
import { WotrFellowshipStore } from "../wotr-elements/wotr-fellowship.store";
import { WotrRegionStore } from "../wotr-elements/wotr-region.store";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrFellowshipAction } from "./wotr-fellowship-actions";

@Injectable ()
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
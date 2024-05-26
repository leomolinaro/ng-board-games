import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrHuntFlowService } from "../hunt/wotr-hunt-flow.service";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrFellowshipAction } from "./wotr-fellowship-actions";
import { WotrFellowshipStore } from "./wotr-fellowship.store";

@Injectable ()
export class WotrFellowshipActionsService {

  private fellowhipStore = inject (WotrFellowshipStore);
  private regionStore = inject (WotrRegionStore);
  private huntStore = inject (WotrHuntStore);
  private huntFlow = inject (WotrHuntFlowService);

  getActionAppliers (): WotrActionApplierMap<WotrFellowshipAction> {
    return {
      "fellowship-corruption": async (action, front) => { this.fellowhipStore.changeCorruption (action.quantity); },
      "fellowship-declare": async (action, front) => {
        this.regionStore.moveFellowshipToRegion (action.region);
        this.fellowhipStore.setProgress (0);
      },
      "fellowship-declare-not": async (action, front) => { /*empty*/ },
      "fellowship-guide": async (action, front) => { this.fellowhipStore.setGuide (action.companion); },
      "fellowship-hide": async (action, front) => { this.fellowhipStore.hide (); },
      "fellowship-progress": async (action, front) => {
        this.fellowhipStore.increaseProgress ();
        this.huntStore.addFellowshipDie ();
        await this.huntFlow.resolveHunt ();
      },
      "fellowship-reveal": async (action, front) => {
        this.regionStore.moveFellowshipToRegion (action.region);
        this.fellowhipStore.reveal ();
      },
    };
  }

}

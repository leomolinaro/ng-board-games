import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrHuntAction } from "./wotr-hunt-actions";
import { WotrHuntStore } from "./wotr-hunt.store";

@Injectable ()
export class WotrHuntActionsService {
  
  constructor () {
    this.actionService.registerActions (this.getActionAppliers () as any);
  }

  private actionService = inject (WotrActionService);
  private huntStore = inject (WotrHuntStore);
  private fellowshipStore = inject (WotrFellowshipStore);

  getActionAppliers (): WotrActionApplierMap<WotrHuntAction> {
    return {
      "hunt-allocation": async (action, front) => { this.huntStore.addHuntDice (action.quantity); },
      "hunt-roll": async (action, front) => { /*empty*/ },
      "hunt-re-roll": async (action, front) => { /*empty*/ },
      "hunt-tile-add": async (action, front) => {
        if (this.fellowshipStore.isOnMordorTrack ()) {
          this.huntStore.moveAvailableTileToPool (action.tile);
        } else {
          this.huntStore.moveAvailableTileToReady (action.tile);
        }
      },
      "hunt-tile-draw": async (action, front) => { this.huntStore.drawHuntTile (action.tile); },
    };
  }

}

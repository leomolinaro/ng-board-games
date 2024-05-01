import { Injectable, inject } from "@angular/core";
import { WotrHuntStore } from "../wotr-elements/wotr-hunt.store";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrHuntAction } from "./wotr-hunt-actions";

@Injectable ()
export class WotrHuntActionsService {

  private huntStore = inject (WotrHuntStore);

  getActionAppliers (): WotrActionApplierMap<WotrHuntAction> {
    return {
      "hunt-allocation": (action, front) => { this.huntStore.setHuntDice (action.quantity); },
      "hunt-roll": (action, front) => { /*empty*/ },
      "hunt-tile-add": (action, front) => {throw new Error ("TODO")  },
      "hunt-tile-draw": (action, front) => { this.huntStore.drawHuntTile (action.tile); },
    };
  }

}

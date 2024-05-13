import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrHuntAction } from "./wotr-hunt-actions";
import { WotrHuntStore } from "./wotr-hunt.store";

@Injectable ({
  providedIn: "root"
})
export class WotrHuntActionsService {

  private huntStore = inject (WotrHuntStore);

  getActionAppliers (): WotrActionApplierMap<WotrHuntAction> {
    return {
      "hunt-allocation": (action, front) => { this.huntStore.addHuntDice (action.quantity); },
      "hunt-roll": (action, front) => { /*empty*/ },
      "hunt-tile-add": (action, front) => { this.huntStore.prepareHuntTile (action.tile); },
      "hunt-tile-draw": (action, front) => { this.huntStore.drawHuntTile (action.tile); },
    };
  }

}

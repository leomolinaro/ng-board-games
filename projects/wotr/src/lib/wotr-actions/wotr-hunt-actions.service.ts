import { Injectable } from "@angular/core";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrHuntAction } from "./wotr-hunt-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrHuntActionsService {

  getActionAppliers (): WotrActionApplierMap<WotrHuntAction> {
    return {
      "hunt-allocation": (action, front) => { },
      "hunt-roll": (action, front) => { },
      "hunt-tile-add": (action, front) => { },
      "hunt-tile-draw": (action, front) => { },
    };
  }

}

import { Injectable } from "@angular/core";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrActionDiceAction } from "./wotr-action-dice-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrActionDiceActionsService {

  getActionAppliers (): WotrActionApplierMap<WotrActionDiceAction> {
    return {
      "action-dice-discard": (action, front) => { },
      "action-pass": (action, front) => { },
      "action-roll": (action, front) => { },
    };
  }

}

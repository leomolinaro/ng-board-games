import { Injectable } from "@angular/core";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrCombatAction } from "./wotr-combat-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrCombatActionsService {

  getActionAppliers (): WotrActionApplierMap<WotrCombatAction> {
    return {
      "combat-card-choose": (action, front) => { },
      "combat-card-choose-not": (action, front) => { },
      "combat-roll": (action, front) => { },
    };
  }

}

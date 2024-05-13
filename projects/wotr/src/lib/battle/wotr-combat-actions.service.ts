import { Injectable } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrCombatAction } from "./wotr-combat-actions";

@Injectable ({
  providedIn: "root"
})
export class WotrCombatActionsService {

  getActionAppliers (): WotrActionApplierMap<WotrCombatAction> {
    return {
      "combat-card-choose": (action, front) => { /*empty*/ },
      "combat-card-choose-not": (action, front) => { /*empty*/ },
      "combat-roll": (action, front) => { /*empty*/ },
    };
  }

}

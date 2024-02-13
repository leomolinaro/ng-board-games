import { Injectable } from "@angular/core";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrArmyAction } from "./wotr-army-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrArmyActionsService {

  getActionAppliers (): WotrActionApplierMap<WotrArmyAction> {
    return {
      "army-attack": (action, front) => { },
      "army-movement": (action, front) => { },
      "army-retreat-into-siege": (action, front) => { },
      "unit-elimination": (action, front) => { },
      "unit-recruitment": (action, front) => { },
    };
  }

}

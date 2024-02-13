import { Injectable } from "@angular/core";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrCompanionAction } from "./wotr-companion-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrCompanionActionsService {

  getActionAppliers (): WotrActionApplierMap<WotrCompanionAction> {
    return {
      "companion-elimination": (action, front) => { },
      "companion-movement": (action, front) => { },
      "companion-play": (action, front) => { },
      "companion-random": (action, front) => { },
      "companion-separation": (action, front) => { },
    };
  }

}

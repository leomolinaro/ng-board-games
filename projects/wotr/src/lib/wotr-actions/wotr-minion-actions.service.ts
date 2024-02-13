import { Injectable } from "@angular/core";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrMinionAction } from "./wotr-minion-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrMinionActionsService {

  getActionAppliers (): WotrActionApplierMap<WotrMinionAction> {
    return {
      "minion-elimination": (action, front) => { },
      "minion-movement": (action, front) => { },
      "minion-play": (action, front) => { },
      "nazgul-movement": (action, front) => { },
    };
  }

}

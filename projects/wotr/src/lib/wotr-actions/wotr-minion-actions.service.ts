import { Injectable } from "@angular/core";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrMinionAction } from "./wotr-minion-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrMinionActionsService {

  getActionAppliers (): WotrActionApplierMap<WotrMinionAction> {
    return {
      "minion-elimination": (action, front) => {throw new Error ("TODO")  },
      "minion-movement": (action, front) => {throw new Error ("TODO")  },
      "minion-play": (action, front) => {throw new Error ("TODO")  },
      "nazgul-movement": (action, front) => {throw new Error ("TODO")  },
    };
  }

}

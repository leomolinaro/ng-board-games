import { Injectable, inject } from "@angular/core";
import { WotrCompanionStore } from "../wotr-elements/wotr-companion.store";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrCompanionAction } from "./wotr-companion-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrCompanionActionsService {

  private companionStore = inject (WotrCompanionStore);

  getActionAppliers (): WotrActionApplierMap<WotrCompanionAction> {
    return {
      "companion-elimination": (action, front) => {throw new Error ("TODO") },
      "companion-movement": (action, front) => {throw new Error ("TODO")  },
      "companion-play": (action, front) => {throw new Error ("TODO")  },
      "companion-random": (action, front) => {throw new Error ("TODO")  },
      "companion-separation": (action, front) => {throw new Error ("TODO")  },
    };
  }

}

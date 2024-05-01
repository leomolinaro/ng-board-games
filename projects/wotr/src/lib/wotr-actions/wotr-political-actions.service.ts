import { Injectable } from "@angular/core";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrPoliticalAction } from "./wotr-political-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrPoliticalActionsService {

  getActionAppliers (): WotrActionApplierMap<WotrPoliticalAction> {
    return {
      "political-activation": (action, front) => { throw new Error ("TODO") },
      "political-advance": (action, front) => { throw new Error ("TODO") },
    };
  }

}

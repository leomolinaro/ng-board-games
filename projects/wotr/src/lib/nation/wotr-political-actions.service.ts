import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrNationStore } from "./wotr-nation.store";
import { WotrPoliticalAction } from "./wotr-political-actions";

@Injectable ({
  providedIn: "root"
})
export class WotrPoliticalActionsService {

  private nationStore = inject (WotrNationStore);

  getActionAppliers (): WotrActionApplierMap<WotrPoliticalAction> {
    return {
      "political-activation": (action, front) => { this.nationStore.setActive (true, action.nation); },
      "political-advance": (action, front) => { this.nationStore.advancePoliticalStep (action.quantity, action.nation); },
    };
  }

}

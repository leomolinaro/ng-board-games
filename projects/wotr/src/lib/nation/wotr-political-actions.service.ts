import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrNationStore } from "./wotr-nation.store";
import { WotrPoliticalAction } from "./wotr-political-actions";

@Injectable ()
export class WotrPoliticalActionsService {

  private nationStore = inject (WotrNationStore);

  getActionAppliers (): WotrActionApplierMap<WotrPoliticalAction> {
    return {
      "political-activation": async (action, front) => { this.nationStore.setActive (true, action.nation); },
      "political-advance": async (action, front) => { this.nationStore.advancePoliticalStep (action.quantity, action.nation); },
    };
  }

}

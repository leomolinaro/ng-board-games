import { Injectable, inject } from "@angular/core";
import { WotrNationStore } from "../../wotr-elements/nation/wotr-nation.store";
import { WotrActionApplierMap } from "../wotr-action-applier";
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

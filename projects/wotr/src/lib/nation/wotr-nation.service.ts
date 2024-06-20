import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrNationAction } from "./wotr-nation-actions";
import { WotrNationId } from "./wotr-nation.models";
import { WotrNationStore } from "./wotr-nation.store";

@Injectable ()
export class WotrNationService {

  private nationStore = inject (WotrNationStore);
  private logStore = inject (WotrLogStore);

  getActionAppliers (): WotrActionApplierMap<WotrNationAction> {
    return {
      "political-activation": async (action, front) => { this.nationStore.setActive (true, action.nation); },
      "political-advance": async (action, front) => { this.nationStore.advancePoliticalStep (action.quantity, action.nation); },
    };
  }

  politicalAdvance (quantity: number, nation: WotrNationId) {
    this.logStore.logEffect ({ type: "political-advance", nation, quantity });
    this.nationStore.advancePoliticalStep (quantity, nation);
  }
  
  politicalActivation (nation: WotrNationId) {
    this.logStore.logEffect ({ type: "political-activation", nation });
    this.nationStore.setActive (true, nation);
  }

}

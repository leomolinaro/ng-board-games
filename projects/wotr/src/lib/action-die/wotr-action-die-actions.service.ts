import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrActionDieAction } from "./wotr-action-die-actions";

@Injectable ()
export class WotrActionDieService {
  
  constructor () {
    this.actionService.registerActions (this.getActionAppliers () as any);
  }

  private actionService = inject (WotrActionService);
  private frontStore = inject (WotrFrontStore);

  getActionAppliers (): WotrActionApplierMap<WotrActionDieAction> {
    return {
      "action-dice-discard": async (action, front) => {
        for (const die of action.dice) {
          this.frontStore.removeActionDie (die, action.front);
        }
      },
      "action-roll": async (action, front) => this.frontStore.setActionDice (action.dice, front),
      "action-die-skip": async (action, front) => { /*empty*/ }
    };
  }

}

import { Injectable, inject } from "@angular/core";
import { oppositeFront } from "../wotr-elements/wotr-front.models";
import { WotrFrontStore } from "../wotr-elements/wotr-front.store";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrActionDieAction } from "./wotr-action-die-actions";

@Injectable ()
export class WotrActionDieActionsService {

  private frontStore = inject (WotrFrontStore);

  getActionAppliers (): WotrActionApplierMap<WotrActionDieAction> {
    return {
      "action-dice-discard": (action, front) => {
        const otherFront = oppositeFront (front);
        for (const die of action.dice) {
          this.frontStore.removeActionDie (die, otherFront);
        }
      },
      "action-roll": (action, front) => this.frontStore.setActionDice (action.dice, front),
      "action-die-skip": (action, front) => { /*empty*/ }
    };
  }

}

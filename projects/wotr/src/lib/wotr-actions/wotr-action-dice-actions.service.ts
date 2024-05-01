import { Injectable, inject } from "@angular/core";
import { oppositeFront } from "../wotr-elements/wotr-front.models";
import { WotrFrontStore } from "../wotr-elements/wotr-front.store";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrActionDiceAction } from "./wotr-action-dice-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrActionDiceActionsService {

  private frontStore = inject (WotrFrontStore);

  getActionAppliers (): WotrActionApplierMap<WotrActionDiceAction> {
    return {
      "action-dice-discard": (action, front) => {
        const otherFront = oppositeFront (front);
        for (const die of action.dice) {
          this.frontStore.removeActionDie (die, otherFront);
        }
      },
      "action-roll": (action, front) => this.frontStore.setActionDice (action.dice, front),
      "action-skip": (action, front) => { /*empty*/ }
    };
  }

}

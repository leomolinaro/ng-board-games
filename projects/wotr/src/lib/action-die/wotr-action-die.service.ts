import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrActionDieAction } from "./wotr-action-die-actions";
import { WotrActionDie } from "./wotr-action-die.models";

@Injectable ()
export class WotrActionDieService {
  
  private actionService = inject (WotrActionService);
  private frontStore = inject (WotrFrontStore);

  init () {
    this.actionService.registerActions (this.getActionAppliers () as any);
    this.actionService.registerActionLoggers (this.getActionLoggers () as any);
  }

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

  private getActionLoggers (): WotrActionLoggerMap<WotrActionDieAction> {
    return {
      "action-dice-discard": (action, front, f) => [f.player (front), " discards ", f.player (action.front), ` ${this.dice (action.dice)}`],
      "action-roll": (action, front, f) => [f.player (front), ` rolls ${this.dice (action.dice)}`],
      "action-die-skip": (action, front, f) => [f.player (front), ` skips ${this.dice ([action.die])}`],
    };
  }

  private dice (dice: WotrActionDie[]) {
    return `${dice.join (", ")} ${dice.length === 1 ? "die" : "dice"}`;
  }

}

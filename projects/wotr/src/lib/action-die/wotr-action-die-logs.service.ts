import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "../commons/wotr-action-log";
import { WotrActionDieAction } from "./wotr-action-die-actions";
import { WotrActionDie } from "./wotr-action-die.models";

@Injectable ({
  providedIn: "root",
})
export class WotrActionDieLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrActionDieAction> {
    return {
      "action-dice-discard": (action, front, f) => [f.player (front), ` discards ${this.dice (action.dice)}`],
      "action-roll": (action, front, f) => [f.player (front), ` rolls ${this.dice (action.dice)}`],
      "action-die-skip": (action, front, f) => [f.player (front), ` skips ${this.dice ([action.die])}`],
    };
  }

  private dice (dice: WotrActionDie[]) {
    return `${dice.join (", ")} ${dice.length === 1 ? "die" : "dice"}`;
  }

}

import { Injectable } from "@angular/core";
import { WotrActionDie } from "../wotr-elements/wotr-dice.models";
import { WotrActionDiceAction } from "./wotr-action-dice-actions";
import { WotrActionLoggerMap } from "./wotr-action-log";

@Injectable ({
  providedIn: "root",
})
export class WotrActionDiceLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrActionDiceAction> {
    return {
      "action-dice-discard": (action, front, f) => [f.player (front), f.string (` discards ${this.dice (action.dice)}`)],
      "action-pass": (action, front, f) => [f.player (front), f.string (" passes")],
      "action-roll": (action, front, f) => [f.player (front), f.string (` rolls ${this.dice (action.dice)}`)],
    };
  }

  private dice (dice: WotrActionDie[]) {
    return `${dice.join (", ")} ${dice.length === 1 ? "die" : "dice"}`;
  }

}

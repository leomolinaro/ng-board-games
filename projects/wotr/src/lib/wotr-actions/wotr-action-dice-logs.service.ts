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
      "action-roll": (action, front, f) => [f.player (front), f.string (` rolls ${this.dice (action.dice)}`)],
      "action-skip": (action, front, f) => [f.player (front), f.string (` skips ${this.dice ([action.die])}`)],
    };
  }

  private dice (dice: WotrActionDie[]) {
    return `${dice.join (", ")} ${dice.length === 1 ? "die" : "dice"}`;
  }

}

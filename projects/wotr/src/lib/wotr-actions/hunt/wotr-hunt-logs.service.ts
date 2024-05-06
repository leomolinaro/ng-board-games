import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "../wotr-action-log";
import { WotrHuntAction } from "./wotr-hunt-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrHuntLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrHuntAction> {
    return {
      "hunt-allocation": (action, front, f) => [f.player (front), ` allocates ${this.nDice (action.quantity)} in the Hunt Box`],
      "hunt-roll": (action, front, f) => [f.player (front), ` rolls ${this.dice (action.dice)} for the hunt`],
      "hunt-tile-add": (action, front, f) => [f.player (front), " adds ", f.huntTile (action.tile), " hunt tile to the Mordor Track"],
      "hunt-tile-draw": (action, front, f) => [f.player (front), " draws ", f.huntTile (action.tile), " hunt tile"],
    };
  }

  private nDice (quantity: number) {
    return `${quantity} ${quantity === 1 ? "die" : "dice"}`;
  }

  private dice (dice: number[]) {
    return dice.join (", ");
  }

}

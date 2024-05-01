import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "./wotr-action-log";
import { WotrHuntAction } from "./wotr-hunt-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrHuntLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrHuntAction> {
    return {
      "hunt-allocation": (action, front, f) => [f.player (front), f.string (` allocates ${this.nDice (action.quantity)} in the Hunt Box`)],
      "hunt-roll": (action, front, f) => [f.player (front), f.string (` rolls ${this.dice (action.dice)} for the hunt`)],
      "hunt-tile-add": (action, front, f) => [f.player (front), f.string (" adds "), f.huntTile (action.tile), f.string (" hunt tile to the Mordor Track")],
      "hunt-tile-draw": (action, front, f) => [f.player (front), f.string (" draws "), f.huntTile (action.tile), f.string (" hunt tile")],
    };
  }

  private nDice (quantity: number) {
    return `${quantity} ${quantity === 1 ? "die" : "dice"}`;
  }

  private dice (dice: number[]) {
    return dice.join (", ");
  }

}

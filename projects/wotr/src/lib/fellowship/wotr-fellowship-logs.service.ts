import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "../commons/wotr-action-log";
import { WotrFellowshipAction } from "./wotr-fellowship-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrFellowshipLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrFellowshipAction> {
    return {
      "fellowship-corruption": (action, front, f) => [
        f.player (front),
        ` ${ action.quantity < 0 ? "heals" : "adds"} ${this.nCorruptionPoints (Math.abs (action.quantity))}`
      ],
      "fellowship-declare": (action, front, f) => [f.player (front), " declares the fellowship in ", f.region (action.region)],
      "fellowship-declare-not": (action, front, f) => [f.player (front), " does not declare the fellowship"],
      "fellowship-guide": (action, front, f) => [f.player (front), " chooses ", f.character (action.companion), " as the guide"],
      "fellowship-hide": (action, front, f) => [f.player (front), " hides the fellowship"],
      "fellowship-progress": (action, front, f) => [f.player (front), " moves the fellowhip"],
      "fellowship-reveal": (action, front, f) => [f.player (front), " reveals the fellowship in ", f.region (action.region)],
    };
  }

  private nCorruptionPoints (quantity: number) {
    return `${quantity} corruption point${quantity === 1 ? "" : "s"}`;
  }

}

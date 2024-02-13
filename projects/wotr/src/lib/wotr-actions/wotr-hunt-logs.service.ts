import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "./wotr-action-log";
import { WotrHuntAction } from "./wotr-hunt-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrHuntLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrHuntAction> {
    return {
      "hunt-allocation": (action, front, f) => [],
      "hunt-roll": (action, front, f) => [],
      "hunt-tile-add": (action, front, f) => [],
      "hunt-tile-draw": (action, front, f) => [],
    };
  }

}

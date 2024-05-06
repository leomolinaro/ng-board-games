import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "../wotr-action-log";
import { WotrMinionAction } from "./wotr-minion-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrMinionLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrMinionAction> {
    return {
      "minion-elimination": (action, front, f) => [],
      "minion-movement": (action, front, f) => [],
      "minion-play": (action, front, f) => [],
      "nazgul-movement": (action, front, f) => [],
    };
  }

}

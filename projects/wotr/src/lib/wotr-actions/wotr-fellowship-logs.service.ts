import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "./wotr-action-log";
import { WotrFellowshipAction } from "./wotr-fellowship-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrFellowshipLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrFellowshipAction> {
    return {
      "fellowship-corruption": (action, front, f) => [],
      "fellowship-declare": (action, front, f) => [],
      "fellowship-declare-not": (action, front, f) => [],
      "fellowship-guide": (action, front, f) => [],
      "fellowship-hide": (action, front, f) => [],
      "fellowship-progress": (action, front, f) => [],
      "fellowship-reveal": (action, front, f) => [],
    };
  }

}

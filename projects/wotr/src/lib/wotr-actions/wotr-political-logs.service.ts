import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "./wotr-action-log";
import { WotrPoliticalAction } from "./wotr-political-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrPoliticalLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrPoliticalAction> {
    return {
      "political-activation": (action, front, f) => [],
      "political-advance": (action, front, f) => [],
    };
  }

}

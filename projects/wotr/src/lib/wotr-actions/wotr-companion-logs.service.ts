import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "./wotr-action-log";
import { WotrCompanionAction } from "./wotr-companion-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrCompanionLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrCompanionAction> {
    return {
      "companion-elimination": (action, front, f) => [],
      "companion-movement": (action, front, f) => [],
      "companion-play": (action, front, f) => [],
      "companion-random": (action, front, f) => [],
      "companion-separation": (action, front, f) => [],
    };
  }

}

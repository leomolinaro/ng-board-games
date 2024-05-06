import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "../wotr-action-log";
import { WotrCombatAction } from "./wotr-combat-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrCombatLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrCombatAction> {
    return {
      "combat-card-choose": (action, front, f) => [],
      "combat-card-choose-not": (action, front, f) => [],
      "combat-roll": (action, front, f) => [],
    };
  }

}

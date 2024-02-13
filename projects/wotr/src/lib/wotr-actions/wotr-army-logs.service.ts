import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "./wotr-action-log";
import { WotrArmyAction } from "./wotr-army-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrArmyLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrArmyAction> {
    return {
      "army-attack": (action, front, f) => [f.player (front), " army in ", f.region (action.fromRegion), " attacks ", f.region (action.toRegion)],
      "army-movement": (action, front, f) => [f.player (front), " army moves from ", f.region (action.fromRegion), " to ", f.region (action.toRegion)],
      "army-retreat-into-siege": (action, front, f) => [f.player (front), " army in ", f.region (action.region), " retreat into siege"],
      "unit-elimination": (action, front, f) => [],
      "unit-recruitment": (action, front, f) => [],
    };
  }

}

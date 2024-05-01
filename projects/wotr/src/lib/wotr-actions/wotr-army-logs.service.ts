import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "./wotr-action-log";
import { WotrArmyAction } from "./wotr-army-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrArmyLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrArmyAction> {
    return {
      "army-attack": (action, front, f) => [f.player (front), f.string (" army in "), f.region (action.fromRegion), f.string (" attacks "), f.region (action.toRegion)],
      "army-movement": (action, front, f) => [f.player (front), f.string (" army moves from "), f.region (action.fromRegion), f.string (" to "), f.region (action.toRegion)],
      "army-retreat-into-siege": (action, front, f) => [f.player (front), f.string (" army in "), f.region (action.region), f.string (" retreat into siege")],
      "unit-elimination": (action, front, f) => [f.string ("TODO")],
      "unit-recruitment": (action, front, f) => [f.player (front), f.string (" recruits TODO units in "), f.region (action.region)],
    };
  }

}

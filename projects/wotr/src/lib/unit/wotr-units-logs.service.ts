import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "../commons/wotr-action-log";
import { WotrUnitAction } from "./wotr-unit-actions";

@Injectable ({
  providedIn: "root"
})
export class WotrUnitLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrUnitAction> {
    return {
      "army-movement": (action, front, f) => [f.player (front), " army moves from ", f.region (action.fromRegion), " to ", f.region (action.toRegion)],
      "army-unit-elimination": (action, front, f) => [f.player (front), " removes army units from ", f.region (action.region)],
      "army-unit-recruitment": (action, front, f) => [f.player (front), " recruits army units in ", f.region (action.region)],
      "leader-elimination": (action, front, f) => [f.player (front), " removes leaders from ", f.region (action.region)],
      "leader-recruitment": (action, front, f) => [f.player (front), " recruits leaders in ", f.region (action.region)],
      "nazgul-elimination": (action, front, f) => [f.player (front), " removes nazgul from ", f.region (action.region)],
      "nazgul-recruitment": (action, front, f) => [f.player (front), " recruits nazgul in ", f.region (action.region)],
    };
  }

}

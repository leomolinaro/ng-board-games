import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "../commons/wotr-action-log";
import { WotrRegionAction } from "./wotr-region-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrRegionLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrRegionAction> {
    return {
      "region-choose": (action, front, f) => [f.player (front), " chooses ", f.region (action.region)],
    };
  }

}

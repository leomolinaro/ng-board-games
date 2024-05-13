import { Injectable, inject } from "@angular/core";
import { WotrActionLoggerMap } from "../commons/wotr-action-log";
import { WotrMinionAction } from "./wotr-minion-actions";
import { WotrMinionId } from "./wotr-minion.models";
import { WotrMinionStore } from "./wotr-minion.store";

@Injectable ({
  providedIn: "root",
})
export class WotrMinionLogsService {

  private minionStore = inject (WotrMinionStore);

  getActionLoggers (): WotrActionLoggerMap<WotrMinionAction> {
    return {
      "minion-elimination": (action, front, f) => [f.player (front), " removes ", this.minions (action.minions)],
      "minion-movement": (action, front, f) => [f.player (front), " moves ", this.minions (action.minions), " from ", f.region (action.fromRegion), " to ", f.region (action.toRegion)],
      "minion-play": (action, front, f) => [f.player (front), " plays ", this.minions (action.minions), " in ", f.region (action.region)],
      "nazgul-movement": (action, front, f) => [f.player (front), ` moves ${action.nNazgul} Nazgul from `, f.region (action.fromRegion), " to ", f.region (action.toRegion)],
    };
  }

  private minions (minions: WotrMinionId[]) {
    return minions.map (c => this.minionStore.minion (c).name).join (", ");
  }

}

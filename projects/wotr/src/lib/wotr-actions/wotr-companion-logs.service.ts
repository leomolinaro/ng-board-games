import { Injectable, inject } from "@angular/core";
import { WotrCompanionId } from "../wotr-elements/wotr-companion.models";
import { WotrCompanionStore } from "../wotr-elements/wotr-companion.store";
import { WotrActionLoggerMap } from "./wotr-action-log";
import { WotrCompanionAction } from "./wotr-companion-actions";

@Injectable ()
export class WotrCompanionLogsService {

  private companionStore = inject (WotrCompanionStore);

  getActionLoggers (): WotrActionLoggerMap<WotrCompanionAction> {
    return {
      "companion-elimination": (action, front, f) => [f.player (front), " removes ", this.companions (action.companions)],
      "companion-movement": (action, front, f) => [f.player (front), " moves ", this.companions (action.companions), " to ", f.region (action.toRegion)],
      "companion-play": (action, front, f) => [f.player (front), " plays ", this.companions (action.companions), " in ", f.region (action.region)],
      "companion-random": (action, front, f) => [f.player (front), " draws ", this.companions (action.companions), " randomly"],
      "companion-separation": (action, front, f) => [f.player (front), " separates ", this.companions (action.companions), " from the fellowship"]
    };
  }

  private companions (companions: WotrCompanionId[]) {
    return companions.map (c => this.companionStore.companion (c).name).join (", ");
  }

}
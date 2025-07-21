import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action-models";
import { WotrActionService } from "../commons/wotr-action-service";
import { WotrRegionAction } from "./wotr-region-actions";
import { WotrRegionStore } from "./wotr-region-store";

@Injectable({ providedIn: "root" })
export class WotrRegionHandler {
  private regionStore = inject(WotrRegionStore);
  private actionService = inject(WotrActionService);

  init() {
    this.actionService.registerActions(this.getActionAppliers() as any);
    this.actionService.registerActionLoggers(this.getActionLoggers() as any);
  }

  getActionAppliers(): WotrActionApplierMap<WotrRegionAction> {
    return {
      "region-choose": async (action, front) => {
        /*empty*/
      }
    };
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrRegionAction> {
    return {
      "region-choose": (action, front, f) => [f.player(front), " chooses ", f.region(action.region)]
    };
  }
}

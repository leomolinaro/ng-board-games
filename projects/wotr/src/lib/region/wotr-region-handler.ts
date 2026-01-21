import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrRegionAction } from "./wotr-region-actions";

@Injectable()
export class WotrRegionHandler {
  private actionRegistry = inject(WotrActionRegistry);

  init() {
    this.actionRegistry.registerActions(this.getActionAppliers() as any);
    this.actionRegistry.registerActionLoggers(this.getActionLoggers() as any);
  }

  getActionAppliers(): WotrActionApplierMap<WotrRegionAction> {
    return {
      "region-choose": (action, front) => {
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

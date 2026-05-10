import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrRegionAction } from "./wotr-region-actions";
import { WotrRegionId } from "./wotr-region-models";
import { WotrRegionModifiers } from "./wotr-region-modifiers";
import { WotrRegionStore } from "./wotr-region-store";

@Injectable()
export class WotrRegionHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private regionStore = inject(WotrRegionStore);
  private regionModifiers = inject(WotrRegionModifiers);

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

  setControlledBy(front: WotrFrontId, regionId: WotrRegionId) {
    this.regionStore.setControlledBy(front, regionId);
    this.regionModifiers.onAfterRegionControlChange(regionId, front);
  }
}

import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrMinionAction } from "./wotr-minion-actions";
import { WotrMinionStore } from "./wotr-minion.store";

@Injectable ()
export class WotrMinionActionsService {

  private minionStore = inject (WotrMinionStore);
  private regionStore = inject (WotrRegionStore);

  getActionAppliers (): WotrActionApplierMap<WotrMinionAction> {
    return {
      "minion-elimination": async (action, front) => {
        for (const minionId of action.minions) {
          const minion = this.minionStore.minion (minionId);
          if (minion.status === "inPlay") {
            const region = this.regionStore.regions ().find (r => r.units.minions?.includes (minionId));
            if (region) {
              this.regionStore.removeMinionFromRegion (minionId, region.id);
            }
          }
          this.minionStore.setEliminated (minionId);
        }
      },
      "minion-movement": async (action, front) => {
        for (const minionId of action.minions) {
          this.regionStore.removeMinionFromRegion (minionId, action.fromRegion);
          this.regionStore.addMinionToRegion (minionId, action.toRegion);
        }
      },
      "minion-play": async (action, front) => {
        for (const minionId of action.minions) {
          this.minionStore.setInPlay (minionId);
          this.regionStore.addMinionToRegion (minionId, action.region);
        }
      },
      "nazgul-movement": async (action, front) => {
        this.regionStore.removeNazgulFromRegion (action.nNazgul, action.fromRegion);
        this.regionStore.addNazgulToRegion (action.nNazgul, action.toRegion);
      },
    };
  }

}

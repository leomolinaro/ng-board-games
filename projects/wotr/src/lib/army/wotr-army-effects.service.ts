import { Injectable, inject } from "@angular/core";
import { WotrBattleFlowService } from "../battle/wotr-battle-flow.service";
import { WotrActionEffectMap } from "../commons/wotr-effect-getter";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrArmyAction } from "./wotr-army-actions";

@Injectable ()
export class WotrArmyEffectsService {

  private regionStore = inject (WotrRegionStore);
  private nationStore = inject (WotrNationStore);
  private battleFlow = inject (WotrBattleFlowService);

  getActionEffects (): WotrActionEffectMap<WotrArmyAction> {
    return {
      "army-attack": async (action, front) => {
        await this.battleFlow.resolveBattle (action, front);
      },
      "army-movement": async (action, front) => {
        const region = this.regionStore.region (action.toRegion);
        if (region.nationId) {
          const nationOfRegion = this.nationStore.nation (region.nationId);
          if (!nationOfRegion.active && nationOfRegion.front !== front) {
            this.nationStore.setActive (true, region.nationId);
          }
        }
      },
      "army-retreat-into-siege": async (action, front) => { },
      "army-not-retreat-into-siege": async (action, front) => { },
      "unit-elimination": async (action, front) => { },
      "unit-recruitment": async (action, front) => { },
    };
  }

}

import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrBattleAction } from "./wotr-battle-actions";
import { WotrBattleFlowService } from "./wotr-battle-flow.service";

@Injectable ()
export class WotrBattleActionsService {

  private regionStore = inject (WotrRegionStore);
  private battleFlow = inject (WotrBattleFlowService);

  getActionAppliers (): WotrActionApplierMap<WotrBattleAction> {
    return {
      "army-attack": async (action, front) => {
        await this.battleFlow.resolveBattle (action, front);
      },
      "army-retreat-into-siege": async (action, front) => {
        this.regionStore.moveArmyIntoSiege (action.region);
      },
      "army-not-retreat-into-siege": async (action, front) => { /*empty*/ },
      "army-retreat": async (action, front) => this.regionStore.moveArmy (action.fromRegion, action.toRegion),
      "army-not-retreat": async (action, front) => { /*empty*/ },
      "leader-forfeit": async (action, front) => { /*empty*/ },
      "battle-continue": async (action, front) => { /*empty*/ },
      "battle-cease": async (action, front) => { /*empty*/ },
      "combat-card-choose": async (action, front) => { /*empty*/ },
      "combat-card-choose-not": async (action, front) => { /*empty*/ },
      "combat-roll": async (action, front) => { /*empty*/ },
      "combat-re-roll": async (action, front) => { /*empty*/ },
    };
  }

}

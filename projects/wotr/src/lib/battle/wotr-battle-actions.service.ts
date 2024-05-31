import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrUnitActionsService } from "../unit/wotr-unit-actions.service";
import { WotrBattleAction } from "./wotr-battle-actions";
import { WotrBattleFlowService } from "./wotr-battle-flow.service";
import { WotrBattleStore } from "./wotr-battle.store";

@Injectable ()
export class WotrBattleActionsService {

  private regionStore = inject (WotrRegionStore);
  private battleStore = inject (WotrBattleStore);
  private unitActions = inject (WotrUnitActionsService);

  private battleFlow = inject (WotrBattleFlowService);

  getActionAppliers (): WotrActionApplierMap<WotrBattleAction> {
    return {
      "army-attack": async (action, front) => {
        await this.battleFlow.resolveBattle (action, front);
      },
      "army-retreat-into-siege": async (action, front) => {
        this.regionStore.setUnderSiege (this.battleStore.battle ()!.region);
      },
      "army-not-retreat-into-siege": async (action, front) => { /*empty*/ },
      "army-retreat": async (action, front) => {
        const units = this.regionStore.region (action.fromRegion).units;
        this.unitActions.moveArmy (units, action.fromRegion, action.toRegion);
        this.regionStore.setUnderSiege (this.battleStore.battle ()!.region);
      },
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

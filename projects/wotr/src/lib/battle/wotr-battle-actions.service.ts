import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrBattleAction } from "./wotr-battle-actions";
import { WotrBattleFlowService } from "./wotr-battle-flow.service";
import { WotrBattleStore } from "./wotr-battle.store";

@Injectable ()
export class WotrBattleActionsService {

  private regionStore = inject (WotrRegionStore);
  private battleStore = inject (WotrBattleStore);

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
      "leader-forfeit": async (action, front) => { /*empty*/ },
      "attack-continue": async (action, front) => { /*empty*/ },
      "attack-cease": async (action, front) => { /*empty*/ },
      "combat-card-choose": async (action, front) => { /*empty*/ },
      "combat-card-choose-not": async (action, front) => { /*empty*/ },
      "combat-roll": async (action, front) => { /*empty*/ },
      "combat-re-roll": async (action, front) => { /*empty*/ },
    };
  }

}

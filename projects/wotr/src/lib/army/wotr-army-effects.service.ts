import { Injectable, inject } from "@angular/core";
import { WotrBattleFlowService } from "../battle/wotr-battle-flow.service";
import { WotrActionEffectMap } from "../commons/wotr-effect-getter";
import { WotrArmyAction } from "./wotr-army-actions";

@Injectable ()
export class WotrArmyEffectsService {

  private battleFlow = inject (WotrBattleFlowService);

  getActionEffects (): WotrActionEffectMap<WotrArmyAction> {
    return {
      "army-attack": async (action, front) => {
        await this.battleFlow.resolveBattle (action, front);
      },
      "army-movement": async (action, front) => { },
      "army-retreat-into-siege": async (action, front) => { },
      "army-not-retreat-into-siege": async (action, front) => { },
      "unit-elimination": async (action, front) => { },
      "unit-recruitment": async (action, front) => { },
    };
  }

}

import { Injectable, inject } from "@angular/core";
import { isCharacterCard } from "../card/wotr-card.models";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrBattleAction } from "./wotr-battle-actions";
import { WotrBattleFlowService } from "./wotr-battle-flow.service";

@Injectable ()
export class WotrBattleService {
  
  private actionService = inject (WotrActionService);
  private regionStore = inject (WotrRegionStore);
  private battleFlow = inject (WotrBattleFlowService);

  init () {
    this.actionService.registerActions (this.getActionAppliers () as any);
  }

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

  getActionLoggers (): WotrActionLoggerMap<WotrBattleAction> {
    return {
      "army-attack": (action, front, f) => [f.player (front), " army in ", f.region (action.fromRegion), " attacks ", f.region (action.toRegion)],
      "army-retreat-into-siege": (action, front, f) => [f.player (front), " army in ", f.region (action.region), " retreat into siege"],
      "army-not-retreat-into-siege": (action, front, f) => [f.player (front), " army in ", f.region (action.region), " does not retreat into siege"],
      "army-retreat": (action, front, f) => [f.player (front), " army in ", f.region (action.fromRegion), " retreat in ", f.region (action.toRegion)],
      "army-not-retreat": (action, front, f) => [f.player (front), " army in ", f.region (action.region), " does not retreat"],
      "battle-continue": (action, front, f) => [f.player (front), " continue battle in ", f.region (action.region)],
      "battle-cease": (action, front, f) => [f.player (front), " cease tha battle in ", f.region (action.region)],
      "leader-forfeit": (action, front, f) => [f.player (front), " forfeits TODO leadership"],
      "combat-card-choose": (action, front, f) => [f.player (front), ` choose a ${isCharacterCard (action.card) ? "character" : "strategy"} combat card`],
      "combat-card-choose-not": (action, front, f) => [f.player (front), " does not play any combat card"],
      "combat-roll": (action, front, f) => [f.player (front), " rolls ", action.dice.join (", ")],
      "combat-re-roll": (action, front, f) => [f.player (front), " re-rolls ", action.dice.join (", ")],
    };
  }

}

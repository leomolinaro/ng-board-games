import { Injectable, inject } from "@angular/core";
import { isCharacterCard } from "../card/wotr-card.models";
import { WotrActionLoggerMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrArmyAttack, WotrArmyRetreat, WotrArmyRetreatIntoSiege, WotrBattleAction } from "./wotr-battle-actions";
import { WotrBattleFlowService } from "./wotr-battle-flow.service";

@Injectable ()
export class WotrBattleService {
  
  private actionService = inject (WotrActionService);
  private nationService = inject (WotrNationService);
  private regionStore = inject (WotrRegionStore);
  private battleFlow = inject (WotrBattleFlowService);

  init () {
    this.actionService.registerAction<WotrArmyAttack> ("army-attack", this.applyArmyAttack.bind (this));
    this.actionService.registerAction<WotrArmyRetreatIntoSiege> ("army-retreat-into-siege", this.applyArmyRetreatIntoSiege.bind (this));
    this.actionService.registerAction<WotrArmyRetreat> ("army-retreat", this.applyArmyRetreat.bind (this));
    this.actionService.registerActionLoggers (this.getActionLoggers () as any);
  }

  private async applyArmyAttack (action: WotrArmyAttack, front: WotrFrontId) {
    this.nationService.checkNationActivationByAttack (action.toRegion);
    this.nationService.checkNationAdvanceByAttack (action.toRegion);
    await this.battleFlow.resolveBattle (action, front);
  }

  private async applyArmyRetreatIntoSiege (action: WotrArmyRetreatIntoSiege) {
    this.regionStore.moveArmyIntoSiege (action.region);
  }

  private async applyArmyRetreat (action: WotrArmyRetreat) {
    this.regionStore.moveArmy (action.fromRegion, action.toRegion);
  }

  private getActionLoggers (): WotrActionLoggerMap<WotrBattleAction> {
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

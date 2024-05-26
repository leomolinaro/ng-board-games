import { Injectable, inject } from "@angular/core";
import { WotrCard } from "../card/wotr-card.models";
import { WotrCompanionStore } from "../companion/wotr-companion.store";
import { WotrFrontId, oppositeFront } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrMinionStore } from "../minion/wotr-minion.store";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrUnits } from "../unit/wotr-unit-actions";
import { WotrArmyAttack } from "./wotr-battle-actions";
import { WotrBattleStore } from "./wotr-battle.store";
import { WotrCombatCardsService } from "./wotr-combat-cards.service";
import { WotrCombatDie } from "./wotr-combat-die.models";
import { WotrCombatRound } from "./wotr-combat-round";

@Injectable ()
export class WotrBattleFlowService {

  battleStore = inject (WotrBattleStore);
  combatCards = inject (WotrCombatCardsService);
  companionStore = inject (WotrCompanionStore);
  frontStore = inject (WotrFrontStore);
  logStore = inject (WotrLogStore);
  regionStore = inject (WotrRegionStore);
  minionStore = inject (WotrMinionStore);
  storyService = inject (WotrStoryService);

  async resolveBattle (action: WotrArmyAttack, attackerId: WotrFrontId) {
    this.logStore.logBattleResolution ();
    const retroguard = this.getRetroguard ();
    this.battleStore.startBattle (action.toRegion, retroguard);
    const battle = new WotrBattle (
      action,
      attackerId,
      this.battleStore,
      this.combatCards,
      this.companionStore,
      this.frontStore,
      this.logStore,
      this.minionStore,
      this.regionStore,
      this.storyService,
    );
    await battle.resolve ();
    this.battleStore.endBattle ();
  }

  private getRetroguard (): WotrUnits | null {
    // TODO
    return null;
  }

}

export class WotrBattle {

  constructor (
    private action: WotrArmyAttack,
    private attackerId: WotrFrontId,
    private battleStore: WotrBattleStore,
    private combatCards: WotrCombatCardsService,
    private companionStore: WotrCompanionStore,
    private frontStore: WotrFrontStore,
    private logStore: WotrLogStore,
    private minionStore: WotrMinionStore,
    private regionStore: WotrRegionStore,
    private storyService: WotrStoryService,
  ) {
    this.defenderId = oppositeFront (attackerId);
  }

  private defenderId: WotrFrontId;

  async resolve () {
    let round = 1;
    let continueBattle = true;
    do {
      const combatRound = new WotrCombatRound (
        round,
        this.action,
        this.attackerId,
        this.defenderId,
        this.battleStore,
        this.combatCards,
        this.companionStore,
        this.frontStore,
        this.logStore,
        this.minionStore,
        this.regionStore,
        this.storyService,
      );
      continueBattle = await combatRound.resolve ();
      round++;
    } while (continueBattle);
  }

}

export class WotrCombatFront {
  constructor (
    public id: WotrFrontId,
    public isAttacker: boolean
  ) { }

  combatCard?: WotrCard;
  maxNDice: number = 5;
  combatModifiers: number[] = [];
  leaderModifiers: number[] = [];

  combatRoll?: WotrCombatDie[];
  nCombatSuccesses?: number;
  leaderReRoll?: WotrCombatDie[];
  nLeaderSuccesses?: number;
  nTotalHits?: number;
  
}

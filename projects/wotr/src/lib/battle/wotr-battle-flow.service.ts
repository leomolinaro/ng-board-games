import { Injectable, inject } from "@angular/core";
import { WotrArmyAttack } from "../army/wotr-army-actions";
import { WotrCard, WotrCardCombatLabel, WotrCardId, getCard } from "../card/wotr-card.models";
import { WotrFrontId, oppositeFront } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrBattleStore } from "./wotr-battle.store";

class WotrBattleRound {
  
  constructor (
    public round: number,
    public attacker: WotrFrontId,
    public defender: WotrFrontId
  ) { }

  attackerCombatCard?: WotrCard;
  defenderCombatCard?: WotrCard;
  shadowCombatModifiers: number[] = [];
  endBattle = false;

}

@Injectable ()
export class WotrBattleFlowService {

  private frontStore = inject (WotrFrontStore);
  private regionStore = inject (WotrRegionStore);
  private storyService = inject (WotrStoryService);
  private logStore = inject (WotrLogStore);
  private battleStore = inject (WotrBattleStore);

  async resolveBattle (action: WotrArmyAttack, attacker: WotrFrontId) {
    this.logStore.logBattleResolution ();
    this.battleStore.startBattle (action.toRegion);
    await this.battle (action, attacker);
    await this.storyService.battleAdvance (attacker);
    this.battleStore.endBattle ();
  }

  private async battle (action: WotrArmyAttack, attacker: WotrFrontId) {
    const defender = oppositeFront (attacker);
    const region = this.regionStore.region (action.toRegion);

    const battleRound = new WotrBattleRound (1, attacker, defender);

    const hasStronghold = region.settlement === "stronghold";
    if (hasStronghold) {
      const retreatIntoSiege = await this.storyService.wantRetreatIntoSiege (defender);
      if (retreatIntoSiege) { return; }
    }
    await this.chooseCombatCards (battleRound);
    this.revealCombatCards (battleRound);
    await this.resolveCombatCards (0, battleRound);
    await this.resolveCombatCards (1, battleRound);
    if (battleRound.endBattle) { return; }
    await this.resolveCombatCards (2, battleRound);
    await this.resolveCombatCards (3, battleRound);
    await this.combatRoll (battleRound);
    // await this.resolveCombatCards (4, battleRound);
    // await this.leaderReRoll (battleRound);
    // await this.resolveCombatCards (5, battleRound);
    // await this.resolveCombatCards (6, battleRound);
    await this.storyService.chooseCasualties (attacker);
    await this.storyService.chooseCasualties (defender);
    await this.resolveCombatCards (7, battleRound);
  }
  
  private async chooseCombatCards (battleRound: WotrBattleRound) {
    const attackerCardId = await this.storyService.chooseCombatCard (battleRound.attacker);
    // eslint-disable-next-line require-atomic-updates
    if (attackerCardId) { battleRound.attackerCombatCard = getCard (attackerCardId); }
    const defenderCardId = await this.storyService.chooseCombatCard (battleRound.defender);
    // eslint-disable-next-line require-atomic-updates
    if (defenderCardId) { battleRound.defenderCombatCard = getCard (defenderCardId); }
  }

  private revealCombatCards (battleRound: WotrBattleRound) {
    if (battleRound.attackerCombatCard) {
      this.frontStore.discardCards ([battleRound.attackerCombatCard.id], battleRound.attacker);
      this.battleStore.addAttackerCombatCard (battleRound.attackerCombatCard.id);
      this.logStore.logCombatCard (battleRound.attackerCombatCard.id, battleRound.attacker);
    }
    if (battleRound.defenderCombatCard) {
      this.frontStore.discardCards ([battleRound.defenderCombatCard.id], battleRound.defender);
      this.battleStore.addDefenderCombatCard (battleRound.defenderCombatCard.id);
      this.logStore.logCombatCard (battleRound.defenderCombatCard.id, battleRound.defender);
    }
  }

  private async resolveCombatCards (timing: number, battleRound: WotrBattleRound) {
    if (battleRound.defenderCombatCard?.combatTiming === timing) {
      await this.resolveCombatCardEffect (battleRound.defenderCombatCard, battleRound.defender, battleRound, false);
    }
    if (battleRound.attackerCombatCard?.combatTiming === timing) {
      await this.resolveCombatCardEffect (battleRound.attackerCombatCard, battleRound.attacker, battleRound, true);
    }
  }

  private async resolveCombatCardEffect (card: WotrCard, front: WotrFrontId, battleRound: WotrBattleRound, isAttacker: boolean): Promise<void> {
    return this.combatCardEffects[card.combatLabel] (front, battleRound, card.id, isAttacker);
  }

  private async combatRoll (battleRound: WotrBattleRound) {
    await this.storyService.rollCombatDice ();
  }

  private async leaderReRoll (battleRound: WotrBattleRound) {
    await this.storyService.rollCombatDice ();
  }

  private combatCardEffects: Record<WotrCardCombatLabel, (front: WotrFrontId, battleRound: WotrBattleRound, card: WotrCardId, isAttacker: boolean) => Promise<void>> = {
    "Advantageous Position": async (front, battleRound, card, isAttacker) => { battleRound.shadowCombatModifiers.push (-1); },
    Anduril: async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Black Breath": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Blade of Westernesse": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Brave Stand": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    Charge: async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    Confusion: async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Cruel as Death": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Daring Defiance": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    Daylight: async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Deadly Strife": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Delivery of Orthanc": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Desperate Battle": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Dread and Despair": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Durin's Bane": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Ents' Rage": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Fateful Strike": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Foul Stench": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Great Host": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Heroic Death": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Huorn-dark": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "It is a Gift": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Mighty Attack": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    Mumakil: async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Nameless Wood": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "No Quarter": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "One for the Dark Lord": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    Onslaught: async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Relentless Assault": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    Scouts: async (front, battleRound, card, isAttacker) => {
      const r = await this.storyService.activateCombatCard (card, front);
      if (r) { battleRound.endBattle = true; }
    },
    "Servant of the Secret Fire": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Shield-Wall": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Sudden Strike": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Swarm of Bats": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "They are Terrible": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    Valour: async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "We Come to Kill": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
    "Words of Power": async (front, battleRound, card, isAttacker) => { throw new Error ("TODO"); },
  };

}

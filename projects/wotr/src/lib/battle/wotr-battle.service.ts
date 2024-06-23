import { Injectable, inject } from "@angular/core";
import { getCard, isCharacterCard } from "../card/wotr-card.models";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrCharacterStore } from "../character/wotr-character.store";
import { WotrActionLoggerMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFrontId, oppositeFront } from "../front/wotr-front.models";
import { WotrFrontService } from "../front/wotr-front.service";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrArmyUtils } from "../unit/wotr-army.utils";
import { WotrArmy, WotrNationUnit } from "../unit/wotr-unit.models";
import { WotrArmyAttack, WotrArmyRetreat, WotrArmyRetreatIntoSiege, WotrBattleAction } from "./wotr-battle-actions";
import { WotrBattle, WotrCombatFront, WotrCombatRound } from "./wotr-battle.models";
import { WotrBattleStore } from "./wotr-battle.store";
import { WotrCombatCardsService } from "./wotr-combat-cards.service";
import { WotrCombatDie } from "./wotr-combat-die.models";

@Injectable ()
export class WotrBattleService {
  
  private actionService = inject (WotrActionService);
  private nationService = inject (WotrNationService);
  private regionStore = inject (WotrRegionStore);
  private battleStore = inject (WotrBattleStore);
  private frontService = inject (WotrFrontService);
  private combatCards = inject (WotrCombatCardsService);
  private characterStore = inject (WotrCharacterStore);
  private frontStore = inject (WotrFrontStore);
  private logStore = inject (WotrLogStore);
  private storyService = inject (WotrStoryService);
  private armyUtil = inject (WotrArmyUtils);
  
  init () {
    this.actionService.registerAction<WotrArmyAttack> ("army-attack", this.applyArmyAttack.bind (this));
    this.actionService.registerAction<WotrArmyRetreatIntoSiege> ("army-retreat-into-siege", this.applyArmyRetreatIntoSiege.bind (this));
    this.actionService.registerAction<WotrArmyRetreat> ("army-retreat", this.applyArmyRetreat.bind (this));
    this.actionService.registerActionLoggers (this.getActionLoggers () as any);
  }

  private async applyArmyAttack (action: WotrArmyAttack, front: WotrFrontId) {
    this.nationService.checkNationActivationByAttack (action.toRegion);
    this.nationService.checkNationAdvanceByAttack (action.toRegion);
    await this.resolveBattleFlow (action, front);
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
  
  async resolveBattleFlow (action: WotrArmyAttack, attackerId: WotrFrontId) {
    this.logStore.logBattleResolution ();
    const retroguard = action.retroguard;
    const battle: WotrBattle = {
      action,
      attackerId,
      defenderId: oppositeFront (attackerId),
      retroguard,
      region: action.toRegion
    };
    this.battleStore.startBattle (battle);
    await this.resolveBattle (battle);
    this.battleStore.endBattle ();
  }

  private async resolveBattle (battle: WotrBattle) {
    let round = 1;
    let continueBattle = true;
    do {
      const combatRound = new WotrCombatRound (
        round,
        battle.action,
        battle.attackerId,
        battle.defenderId,
        !!this.attackedRegion (battle.action).underSiegeArmy
      );
      continueBattle = await this.resolveCombat (combatRound);
      round++;
    } while (continueBattle);
  }

  private async resolveCombat (combatRound: WotrCombatRound): Promise<boolean> {
    let attackedRegion = this.attackedRegion (combatRound.action);
    const hasStronghold = attackedRegion.settlement === "stronghold";
    if (hasStronghold && !combatRound.siegeBattle) {
      const retreatIntoSiege = await this.storyService.wantRetreatIntoSiege (combatRound.defender.id);
      if (retreatIntoSiege) {
        await this.storyService.battleAdvance (combatRound.attacker.id); // TODO controllare se avanza
        return false;
      }
    }
    await this.chooseCombatCards (combatRound);
    this.revealCombatCards (combatRound);
    await this.resolveCombatCards (0, combatRound);
    await this.resolveCombatCards (1, combatRound);
    if (!combatRound.endBattle) {
      await this.resolveCombatCards (2, combatRound);
      await this.resolveCombatCards (3, combatRound);
      await this.combatRolls (combatRound);
      await this.resolveCombatCards (4, combatRound);
      await this.leaderReRolls (combatRound);
      await this.resolveCombatCards (5, combatRound);
      await this.resolveCombatCards (6, combatRound);
      await this.chooseCasualties (combatRound);
      await this.resolveCombatCards (7, combatRound);
    }

    let continueBattle = false;
    let attackerWon = false;
    if (this.isDefenderDefeated (combatRound)) {
      attackerWon = true;
    } else {
      const wantContinueBattle = await this.storyService.wantContinueBattle (combatRound.attacker.id);
      attackedRegion = this.attackedRegion (combatRound.action);
      if (wantContinueBattle && !combatRound.siegeBattle) { // TODO && defender can retreat
        const wantRetreat = await this.storyService.wantRetreat (combatRound.defender.id);
        if (wantRetreat) {
          attackerWon = true;
        } else {
          continueBattle = true;
        }
      } else {
        continueBattle = true;
      }
    }

    if (attackerWon) {
      if (combatRound.action.toRegion !== combatRound.action.fromRegion) {
        await this.storyService.battleAdvance (combatRound.attacker.id);
      }
      if (this.attackedRegion (combatRound.action).settlement) {
        this.regionStore.setControlledBy (combatRound.attacker.id, combatRound.action.toRegion); // TODO controllare se avanza
        this.nationService.checkNationAdvanceByCapture (combatRound.action.toRegion);
        this.frontService.refreshVictoryPoints ();
      }
    }

    await this.checkSorcerer (combatRound);

    return continueBattle;
  }

  private isDefenderDefeated (combatRound: WotrCombatRound) {
    const region = this.attackedRegion (combatRound.action);
    const hasDefenderArmy = region.army?.front === combatRound.defender.id || region.underSiegeArmy?.front === combatRound.defender.id;
    return !hasDefenderArmy;
  }

  private async chooseCombatCards (combatRound: WotrCombatRound) {
    await this.chooseCombatCard (combatRound.attacker);
    await this.chooseCombatCard (combatRound.defender);
  }
  
  private async chooseCombatCard (combatFront: WotrCombatFront) {
    const cardId = await this.storyService.chooseCombatCard (combatFront.id);
    // eslint-disable-next-line require-atomic-updates
    if (cardId) { combatFront.combatCard = getCard (cardId); }
  }

  private revealCombatCards (combatRound: WotrCombatRound) {
    this.revealCombatCard (combatRound.attacker);
    this.revealCombatCard (combatRound.defender);
  }

  private revealCombatCard (combatFront: WotrCombatFront) {
    if (combatFront.combatCard) {
      this.frontStore.discardCards ([combatFront.combatCard.id], combatFront.id);
      this.battleStore.addAttackerCombatCard (combatFront.combatCard.id);
      this.logStore.logCombatCard (combatFront.combatCard.id, combatFront.id);
    }
  }

  private async resolveCombatCards (timing: number, combatRound: WotrCombatRound) {
    await this.resolveCombatCard (timing, combatRound.defender, combatRound);
    await this.resolveCombatCard (timing, combatRound.attacker, combatRound);
  }

  private async resolveCombatCard (timing: number, combatFront: WotrCombatFront, combatRound: WotrCombatRound) {
    if (combatFront.combatCard?.combatTiming === timing) {
      await this.combatCards.combatCardReaction ({
        combatRound,
        shadow: combatRound.shadow,
        freePeoples: combatRound.freePeoples,
        card: combatFront.combatCard,
        front: combatFront.id,
        isAttacker: combatFront.isAttacker,
        attackedArmy: () => this.attackedArmy (combatRound),
        attackingArmy: () => this.attackingArmy (combatRound)
      });
    }
  }

  private async combatRolls (combatRound: WotrCombatRound) {
    const { shadow: shadowRoll, "free-peoples": freePeoplesRoll } = await this.storyService.parallelRollCombatDice ();
    combatRound.shadow.combatRoll = shadowRoll;
    combatRound.shadow.nCombatSuccesses = this.getNRollSuccesses (shadowRoll, combatRound.shadow, combatRound);
    combatRound.freePeoples.combatRoll = freePeoplesRoll;
    combatRound.freePeoples.nCombatSuccesses = this.getNRollSuccesses (freePeoplesRoll, combatRound.freePeoples, combatRound);
  }

  private async leaderReRolls (combatRound: WotrCombatRound) {
    const defenderNReRolls = this.getNReRolls (combatRound.defender, combatRound.attacker, combatRound);
    const attackerNReRolls = this.getNReRolls (combatRound.attacker, combatRound.defender, combatRound);
    if (defenderNReRolls) {
      if (attackerNReRolls) {
        const { shadow: shadowReRoll, "free-peoples": freePeoplesReRoll } = await this.storyService.parallelReRollCombatDice ();
        combatRound.shadow.leaderReRoll = shadowReRoll;
        combatRound.shadow.nLeaderSuccesses = this.getNRollSuccesses (shadowReRoll, combatRound.shadow, combatRound);
        combatRound.freePeoples.leaderReRoll = freePeoplesReRoll;
        combatRound.freePeoples.nLeaderSuccesses = this.getNRollSuccesses (freePeoplesReRoll, combatRound.freePeoples, combatRound);
      } else {
        const defenderReRoll = await this.storyService.reRollCombatDice (combatRound.defender.id);
        combatRound.defender.leaderReRoll = defenderReRoll;
        combatRound.defender.nLeaderSuccesses = this.getNRollSuccesses (defenderReRoll, combatRound.defender, combatRound);
      }
    } else if (attackerNReRolls) {
      const attackerReRoll = await this.storyService.reRollCombatDice (combatRound.attacker.id);
      combatRound.attacker.leaderReRoll = attackerReRoll;
      combatRound.attacker.nLeaderSuccesses = this.getNRollSuccesses (attackerReRoll, combatRound.attacker, combatRound);
    }
    combatRound.defender.nTotalHits = (combatRound.defender.nCombatSuccesses ?? 0) + (combatRound.defender.nLeaderSuccesses ?? 0);
    combatRound.attacker.nTotalHits = (combatRound.attacker.nCombatSuccesses ?? 0) + (combatRound.attacker.nLeaderSuccesses ?? 0);
  }

  private getNReRolls (combatFront: WotrCombatFront, oppositeCombatFront: WotrCombatFront, combatRound: WotrCombatRound): number {
    const combatRoll = combatFront.combatRoll!;
    const nSuccesses = combatFront.nCombatSuccesses!;
    const nFailures = combatRoll.length - nSuccesses;
    if (!nFailures) { return 0; }
    const oppositeHitPoints = this.getHitPoints (oppositeCombatFront, combatRound);
    if (nSuccesses >= oppositeHitPoints) { return 0; }
    const leadership = this.getLeadership (combatFront, combatRound);
    if (!leadership) { return 0; }
    return Math.min (nFailures, leadership);
  }

  private getHitPoints (combatFront: WotrCombatFront, combatRound: WotrCombatRound): number {
    if (combatFront.isAttacker) {
      const retroguard = this.battle ().retroguard;
      const retroguardLeadership = retroguard ? this.getUnitsHitPoints (retroguard) : 0;
      const armyLeadership = this.getUnitsHitPoints (this.attackingArmy (combatRound));
      return armyLeadership - retroguardLeadership;
    } else {
      return this.getUnitsHitPoints (this.attackedArmy (combatRound));
    }
  }

  private getUnitsHitPoints (army: WotrArmy | undefined) {
    if (!army) { return 0; }
    let damagePoints = 0;
    damagePoints += army.regulars?.reduce ((d, r) => d + r.quantity, 0) || 0;
    damagePoints += army.elites?.reduce ((d, r) => d + r.quantity * 2, 0) || 0;
    return damagePoints;
  }

  private getLeadership (combatFront: WotrCombatFront, combatRound: WotrCombatRound): number {
    if (combatFront.isAttacker) {
      const retroguard = this.battle ().retroguard;
      const retroguardLeadership = retroguard ? this.getArmyLeadership (retroguard) : 0;
      const armyLeadership = this.getArmyLeadership (this.attackingArmy (combatRound));
      return armyLeadership - retroguardLeadership;
    } else {
      return this.getArmyLeadership (this.attackedArmy (combatRound));
    }
  }

  private getArmyLeadership (army: WotrArmy | undefined) {
    if (!army) { return 0; }
    let leadership = 0;
    if (army.elites) { leadership += this.getEliteUnitsLeadership (army.elites); }
    if (army.leaders) { leadership += this.getLeadersLeadership (army.leaders); }
    if (army.nNazgul) { leadership += this.getNazgulLeadership (army.nNazgul); }
    if (army.characters) { leadership += this.getCharactersLeadership (army.characters); }
    return leadership;
  }

  private getEliteUnitsLeadership (elites: WotrNationUnit[]) {
    return elites.reduce ((l, armyUnit) => {
      if (armyUnit.nation === "isengard" &&
        this.characterStore.isInPlay ("saruman")) {
        return l + 1;
      }
      return l;
    }, 0);
  }

  private getLeadersLeadership (leaders: WotrNationUnit[]) {
    return leaders.length;
  }

  private getNazgulLeadership (nNazgul: number) {
    return nNazgul;
  }

  private getCharactersLeadership (characters: WotrCharacterId[]) {
    return characters.reduce ((l, characterId) => {
      return l + this.characterStore.character (characterId).leadership;
    }, 0);
  }

  private getNRollSuccesses (roll: WotrCombatDie[], combatFront: WotrCombatFront, combatRound: WotrCombatRound) {
    const successThreashold = this.getSuccessThreashold (combatFront, combatRound);
    return roll.reduce ((successes, dice) => {
      if (dice >= successThreashold) {
        successes++;
      }
      return successes;
    }, 0);
  }

  private getSuccessThreashold (combatFront: WotrCombatFront, combatRound: WotrCombatRound) {
    const defaultSuccessThreashold = this.getDefaultSuccessThreashold (combatFront, combatRound);
    return combatFront.combatModifiers.reduce ((t, modifier) => {
      t -= modifier;
      return t;
    }, defaultSuccessThreashold);
  }

  private getDefaultSuccessThreashold (combatFront: WotrCombatFront, combatRound: WotrCombatRound): number {
    if (combatFront.isAttacker) {
      const region = this.attackedRegion (combatRound.action);
      if ((region.fortification || region.settlement === "city") && combatRound.round === 1) { return 6; }
      if (region.underSiegeArmy) { return 6; } // TODO non sempre
    }
    return 5;
  }

  private async chooseCasualties (combatRound: WotrCombatRound) {
    await this.chooseFrontCasualties (combatRound.attacker, combatRound.defender);
    await this.chooseFrontCasualties (combatRound.defender, combatRound.attacker);
  }

  private async chooseFrontCasualties (combatFront: WotrCombatFront, oppositeCombatFront: WotrCombatFront) {
    if (oppositeCombatFront.nTotalHits) {
      await this.storyService.chooseCasualties (combatFront.id);
    }
  }

  private async checkSorcerer (combatRound: WotrCombatRound) {
    if (this.isCharacterInBattle ("the-witch-king", combatRound) && combatRound.round === 1 && combatRound.shadow.combatCard) {
      await this.storyService.activateCharacterAbility ("the-witch-king", "shadow");
    }
  }

  private isCharacterInBattle (character: WotrCharacterId, combatRound: WotrCombatRound) {
    if (this.battleStore.isCharacterInRetroguard (character)) { return false; }
    return this.regionStore.isCharacterInRegion (character, combatRound.action.fromRegion);
  }

  private attackingRegion (combatRound: WotrCombatRound) { return this.regionStore.region (combatRound.action.fromRegion); }
  private attackingArmy (combatRound: WotrCombatRound) {
    if (combatRound.action.retroguard) {
      return this.armyUtil.splitUnits (this.attackingRegion (combatRound).army, combatRound.action.retroguard)!;
    } else {
      return this.attackingRegion (combatRound).army!;
    }
  }
  private attackedArmy (combatRound: WotrCombatRound) {
    const attackedRegion = this.attackedRegion (combatRound.action);
    return combatRound.siegeBattle ? attackedRegion.underSiegeArmy : attackedRegion.army;
  }
  private attackedRegion (action: WotrArmyAttack) { return this.regionStore.region (action.toRegion); }
  private battle () { return this.battleStore.battle ()!; }

}


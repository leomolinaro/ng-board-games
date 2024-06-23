import { getCard } from "../card/wotr-card.models";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrCharacterStore } from "../character/wotr-character.store";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrArmyUtils } from "../unit/wotr-army.utils";
import { WotrArmy, WotrNationUnit } from "../unit/wotr-unit.models";
import { WotrArmyAttack } from "./wotr-battle-actions";
import { WotrCombatFront } from "./wotr-battle-flow.service";
import { WotrBattleStore } from "./wotr-battle.store";
import { WotrCombatCardsService } from "./wotr-combat-cards.service";
import { WotrCombatDie } from "./wotr-combat-die.models";

export class WotrCombatRound {
  
  constructor (
    private round: number,
    private action: WotrArmyAttack,
    attackerId: WotrFrontId,
    defenderId: WotrFrontId,
    private battleStore: WotrBattleStore,
    private combatCards: WotrCombatCardsService,
    private characterStore: WotrCharacterStore,
    private frontStore: WotrFrontStore,
    private logStore: WotrLogStore,
    private regionStore: WotrRegionStore,
    private nationService: WotrNationService,
    private storyService: WotrStoryService,
    private armyUtil: WotrArmyUtils,
  ) {
    this.attacker = new WotrCombatFront (attackerId, true);
    this.defender = new WotrCombatFront (defenderId, false);
    if (attackerId === "shadow") {
      this.shadow = this.attacker;
      this.freePeoples = this.defender;
    } else {
      this.shadow = this.defender;
      this.freePeoples = this.attacker;
    }
    this.siegeBattle = !!this.attackedRegion ().underSiegeArmy;
  }

  attacker: WotrCombatFront;
  defender: WotrCombatFront;
  shadow: WotrCombatFront;
  freePeoples: WotrCombatFront;
  siegeBattle: boolean;

  endBattle = false;

  private attackingRegion () { return this.regionStore.region (this.action.fromRegion); }
  attackingArmy () {
    if (this.action.retroguard) {
      return this.armyUtil.splitUnits (this.attackingRegion ().army, this.action.retroguard)!;
    } else {
      return this.attackingRegion ().army!;
    }
  }
  attackedArmy () {
    const attackedRegion = this.attackedRegion ();
    return this.siegeBattle ? attackedRegion.underSiegeArmy : attackedRegion.army;
  }
  private attackedRegion () { return this.regionStore.region (this.action.toRegion); }
  private battle () { return this.battleStore.battle ()!; }

  async resolve (): Promise<boolean> {
    let attackedRegion = this.attackedRegion ();
    const hasStronghold = attackedRegion.settlement === "stronghold";
    if (hasStronghold && !this.siegeBattle) {
      const retreatIntoSiege = await this.storyService.wantRetreatIntoSiege (this.defender.id);
      if (retreatIntoSiege) {
        await this.storyService.battleAdvance (this.attacker.id); // TODO controllare se avanza
        return false;
      }
    }
    await this.chooseCombatCards ();
    this.revealCombatCards ();
    await this.resolveCombatCards (0);
    await this.resolveCombatCards (1);
    if (!this.endBattle) {
      await this.resolveCombatCards (2);
      await this.resolveCombatCards (3);
      await this.combatRolls ();
      await this.resolveCombatCards (4);
      await this.leaderReRolls ();
      await this.resolveCombatCards (5);
      await this.resolveCombatCards (6);
      await this.chooseCasualties ();
      await this.resolveCombatCards (7);
    }

    let continueBattle = false;
    let attackerWon = false;
    if (this.isDefenderDefeated ()) {
      attackerWon = true;
    } else {
      const wantContinueBattle = await this.storyService.wantContinueBattle (this.attacker.id);
      attackedRegion = this.attackedRegion ();
      if (wantContinueBattle && !this.siegeBattle) { // TODO && defender can retreat
        const wantRetreat = await this.storyService.wantRetreat (this.defender.id);
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
      if (this.action.toRegion !== this.action.fromRegion) {
        await this.storyService.battleAdvance (this.attacker.id);
      }
      if (this.attackedRegion ().settlement) {
        this.regionStore.setControlledBy (this.attacker.id, this.action.toRegion); // TODO controllare se avanza
        this.nationService.checkNationAdvanceByCapture (this.action.toRegion);
      }
    }

    await this.checkSorcerer ();

    return continueBattle;
  }

  private isDefenderDefeated () {
    const region = this.attackedRegion ();
    const hasDefenderArmy = region.army?.front === this.defender.id || region.underSiegeArmy?.front === this.defender.id;
    return !hasDefenderArmy;
  }

  private async chooseCombatCards () {
    await this.chooseCombatCard (this.attacker);
    await this.chooseCombatCard (this.defender);
  }
  
  private async chooseCombatCard (combatFront: WotrCombatFront) {
    const cardId = await this.storyService.chooseCombatCard (combatFront.id);
    // eslint-disable-next-line require-atomic-updates
    if (cardId) { combatFront.combatCard = getCard (cardId); }
  }

  private revealCombatCards () {
    this.revealCombatCard (this.attacker);
    this.revealCombatCard (this.defender);
  }

  private revealCombatCard (combatFront: WotrCombatFront) {
    if (combatFront.combatCard) {
      this.frontStore.discardCards ([combatFront.combatCard.id], combatFront.id);
      this.battleStore.addAttackerCombatCard (combatFront.combatCard.id);
      this.logStore.logCombatCard (combatFront.combatCard.id, combatFront.id);
    }
  }

  private async resolveCombatCards (timing: number) {
    await this.resolveCombatCard (timing, this.defender);
    await this.resolveCombatCard (timing, this.attacker);
  }

  private async resolveCombatCard (timing: number, combatFront: WotrCombatFront) {
    if (combatFront.combatCard?.combatTiming === timing) {
      await this.combatCards.combatCardReaction ({
        combatRound: this,
        shadow: this.shadow,
        freePeoples: this.freePeoples,
        card: combatFront.combatCard,
        front: combatFront.id,
        isAttacker: combatFront.isAttacker
      });
    }
  }

  private async combatRolls () {
    const { shadow: shadowRoll, "free-peoples": freePeoplesRoll } = await this.storyService.parallelRollCombatDice ();
    this.shadow.combatRoll = shadowRoll;
    this.shadow.nCombatSuccesses = this.getNRollSuccesses (shadowRoll, this.shadow);
    this.freePeoples.combatRoll = freePeoplesRoll;
    this.freePeoples.nCombatSuccesses = this.getNRollSuccesses (freePeoplesRoll, this.freePeoples);
  }

  private async leaderReRolls () {
    const defenderNReRolls = this.getNReRolls (this.defender, this.attacker);
    const attackerNReRolls = this.getNReRolls (this.attacker, this.defender);
    if (defenderNReRolls) {
      if (attackerNReRolls) {
        const { shadow: shadowReRoll, "free-peoples": freePeoplesReRoll } = await this.storyService.parallelReRollCombatDice ();
        this.shadow.leaderReRoll = shadowReRoll;
        this.shadow.nLeaderSuccesses = this.getNRollSuccesses (shadowReRoll, this.shadow);
        this.freePeoples.leaderReRoll = freePeoplesReRoll;
        this.freePeoples.nLeaderSuccesses = this.getNRollSuccesses (freePeoplesReRoll, this.freePeoples);
      } else {
        const defenderReRoll = await this.storyService.reRollCombatDice (this.defender.id);
        this.defender.leaderReRoll = defenderReRoll;
        this.defender.nLeaderSuccesses = this.getNRollSuccesses (defenderReRoll, this.defender);
      }
    } else if (attackerNReRolls) {
      const attackerReRoll = await this.storyService.reRollCombatDice (this.attacker.id);
      this.attacker.leaderReRoll = attackerReRoll;
      this.attacker.nLeaderSuccesses = this.getNRollSuccesses (attackerReRoll, this.attacker);
    }
    this.defender.nTotalHits = (this.defender.nCombatSuccesses ?? 0) + (this.defender.nLeaderSuccesses ?? 0);
    this.attacker.nTotalHits = (this.attacker.nCombatSuccesses ?? 0) + (this.attacker.nLeaderSuccesses ?? 0);
  }

  private getNReRolls (combatFront: WotrCombatFront, oppositeCombatFront: WotrCombatFront): number {
    const combatRoll = combatFront.combatRoll!;
    const nSuccesses = combatFront.nCombatSuccesses!;
    const nFailures = combatRoll.length - nSuccesses;
    if (!nFailures) { return 0; }
    const oppositeHitPoints = this.getHitPoints (oppositeCombatFront);
    if (nSuccesses >= oppositeHitPoints) { return 0; }
    const leadership = this.getLeadership (combatFront);
    if (!leadership) { return 0; }
    return Math.min (nFailures, leadership);
  }

  private getHitPoints (combatFront: WotrCombatFront): number {
    if (combatFront.isAttacker) {
      const retroguard = this.battle ().retroguard;
      const retroguardLeadership = retroguard ? this.getUnitsHitPoints (retroguard) : 0;
      const armyLeadership = this.getUnitsHitPoints (this.attackingArmy ());
      return armyLeadership - retroguardLeadership;
    } else {
      return this.getUnitsHitPoints (this.attackedArmy ());
    }
  }

  private getUnitsHitPoints (army: WotrArmy | undefined) {
    if (!army) { return 0; }
    let damagePoints = 0;
    damagePoints += army.regulars?.reduce ((d, r) => d + r.quantity, 0) || 0;
    damagePoints += army.elites?.reduce ((d, r) => d + r.quantity * 2, 0) || 0;
    return damagePoints;
  }

  private getLeadership (combatFront: WotrCombatFront): number {
    if (combatFront.isAttacker) {
      const retroguard = this.battle ().retroguard;
      const retroguardLeadership = retroguard ? this.getArmyLeadership (retroguard) : 0;
      const armyLeadership = this.getArmyLeadership (this.attackingArmy ());
      return armyLeadership - retroguardLeadership;
    } else {
      return this.getArmyLeadership (this.attackedArmy ());
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

  private getNRollSuccesses (roll: WotrCombatDie[], combatFront: WotrCombatFront) {
    const successThreashold = this.getSuccessThreashold (combatFront);
    return roll.reduce ((successes, dice) => {
      if (dice >= successThreashold) {
        successes++;
      }
      return successes;
    }, 0);
  }

  private getSuccessThreashold (combatFront: WotrCombatFront) {
    const defaultSuccessThreashold = this.getDefaultSuccessThreashold (combatFront);
    return combatFront.combatModifiers.reduce ((t, modifier) => {
      t -= modifier;
      return t;
    }, defaultSuccessThreashold);
  }

  private getDefaultSuccessThreashold (combatFront: WotrCombatFront): number {
    if (combatFront.isAttacker) {
      const region = this.attackedRegion ();
      if ((region.fortification || region.settlement === "city") && this.round === 1) { return 6; }
      if (region.underSiegeArmy) { return 6; } // TODO non sempre
    }
    return 5;
  }

  private async chooseCasualties () {
    await this.chooseFrontCasualties (this.attacker, this.defender);
    await this.chooseFrontCasualties (this.defender, this.attacker);
  }

  private async chooseFrontCasualties (combatFront: WotrCombatFront, oppositeCombatFront: WotrCombatFront) {
    if (oppositeCombatFront.nTotalHits) {
      await this.storyService.chooseCasualties (combatFront.id);
    }
  }

  private async checkSorcerer () {
    if (this.isCharacterInBattle ("the-witch-king") && this.round === 1 && this.shadow.combatCard) {
      await this.storyService.activateCharacterAbility ("the-witch-king", "shadow");
    }
  }

  private isCharacterInBattle (character: WotrCharacterId) {
    if (this.battleStore.isCharacterInRetroguard (character)) { return false; }
    return this.regionStore.isCharacterInRegion (character, this.action.fromRegion);
  }

}

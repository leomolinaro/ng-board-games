import { inject, Injectable } from "@angular/core";
import { getCard, isCharacterCard } from "../card/wotr-card-models";
import { WotrActionLoggerMap, WotrStoryApplier } from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFrontHandler } from "../front/wotr-front-handler";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";
import { WotrGameQuery } from "../game/wotr-game-query";
import {
  assertAction,
  WotrCombatCardEffectStory,
  WotrSkipCombatCardEffectStory
} from "../game/wotr-story-models";
import { WotrLogWriter } from "../log/wotr-log-writer";
import { WotrNationHandler } from "../nation/wotr-nation-handler";
import { WotrAllPlayers } from "../player/wotr-all-players";
import { WotrFreePeoplesPlayer } from "../player/wotr-free-peoples-player";
import { WotrPlayer } from "../player/wotr-player";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrUnitHandler } from "../unit/wotr-unit-handler";
import { WotrArmy } from "../unit/wotr-unit-models";
import { WotrUnitRules } from "../unit/wotr-unit-rules";
import { WotrUnitUtils } from "../unit/wotr-unit-utils";
import {
  WotrArmyAdvance,
  WotrArmyAttack,
  WotrArmyNotAdvance,
  WotrArmyNotRetreat,
  WotrArmyNotRetreatIntoSiege,
  WotrArmyRetreat,
  WotrArmyRetreatIntoSiege,
  WotrBattleAction,
  WotrBattleCease,
  WotrBattleContinue,
  WotrCombatCardChoose,
  WotrCombatCardChooseNot,
  WotrCombatReRoll,
  WotrCombatRoll
} from "./wotr-battle-actions";
import { WotrBattle, WotrCombatFront, WotrCombatRound } from "./wotr-battle-models";
import { WotrBattleModifiers } from "./wotr-battle-modifiers";
import { WotrBattleStore } from "./wotr-battle-store";
import { WotrCombatCardParams, WotrCombatCards } from "./wotr-combat-cards";
import { WotrCombatDie } from "./wotr-combat-die-models";

@Injectable({ providedIn: "root" })
export class WotrBattleHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private nationHandler = inject(WotrNationHandler);
  private regionStore = inject(WotrRegionStore);
  private battleStore = inject(WotrBattleStore);
  private frontHandler = inject(WotrFrontHandler);
  private combatCards = inject(WotrCombatCards);
  private frontStore = inject(WotrFrontStore);
  private logger = inject(WotrLogWriter);
  private unitUtils = inject(WotrUnitUtils);
  private allPlayers = inject(WotrAllPlayers);
  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);
  private unitRules = inject(WotrUnitRules);
  private unitHandler = inject(WotrUnitHandler);
  private battleModifiers = inject(WotrBattleModifiers);
  private q = inject(WotrGameQuery);

  init() {
    this.actionRegistry.registerAction<WotrArmyAttack>(
      "army-attack",
      this.applyArmyAttack.bind(this)
    );
    this.actionRegistry.registerAction<WotrArmyRetreatIntoSiege>(
      "army-retreat-into-siege",
      this.applyArmyRetreatIntoSiege.bind(this)
    );
    this.actionRegistry.registerAction<WotrArmyRetreat>(
      "army-retreat",
      this.applyArmyRetreat.bind(this)
    );
    this.actionRegistry.registerAction<WotrArmyAdvance>(
      "army-advance",
      this.applyArmyAdvance.bind(this)
    );
    this.actionRegistry.registerActionLoggers(this.getActionLoggers() as any);
    this.actionRegistry.registerStory("combat-card-effect", this.reactionCombatCard);
    this.actionRegistry.registerStory("combat-card-effect-skip", this.reactionCombatCardSkip);
  }

  private reactionCombatCard: WotrStoryApplier<WotrCombatCardEffectStory> = async (
    story,
    front
  ) => {
    for (const action of story.actions) {
      this.logger.logAction(action, story, front);
      await this.actionRegistry.applyAction(action, front);
    }
  };

  private reactionCombatCardSkip: WotrStoryApplier<WotrSkipCombatCardEffectStory> = async (
    story,
    front
  ) => {
    this.logger.logStory(story, front);
  };

  private async applyArmyAttack(action: WotrArmyAttack, front: WotrFrontId) {
    this.nationHandler.checkNationActivationByAttack(action);
    this.nationHandler.checkNationAdvanceByAttack(action.toRegion);
    if (front === "free-peoples") {
      await this.resolveBattleFlow(action, this.freePeoples, this.shadow);
    } else {
      await this.resolveBattleFlow(action, this.shadow, this.freePeoples);
    }
  }

  private getNSiegeCombatRounds() {
    const currentCard = this.frontStore.currentCard();
    if (currentCard) {
      // TODO modifiers
      if (currentCard === "sstr02" || currentCard === "scha20") return 3;
    }
    return 1;
  }

  private applyArmyRetreatIntoSiege(action: WotrArmyRetreatIntoSiege) {
    this.regionStore.moveArmyIntoSiege(action.region);
  }

  private applyArmyRetreat(action: WotrArmyRetreat) {
    const battleRegion = this.battleStore.state()!.action.toRegion;
    this.regionStore.moveArmy(battleRegion, action.toRegion);
  }

  private applyArmyAdvance(action: WotrArmyAdvance) {
    const fromRegion = this.battleStore.state()!.action.fromRegion;
    const toRegion = this.battleStore.state()!.action.toRegion;
    this.regionStore.moveArmy(fromRegion, toRegion, action.leftUnits);
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrBattleAction> {
    return {
      "army-attack": (action, front, f) => [
        f.player(front),
        " army in ",
        f.region(action.fromRegion),
        " attacks ",
        f.region(action.toRegion)
      ],
      "army-retreat-into-siege": (action, front, f) => [
        f.player(front),
        " army in ",
        f.region(action.region),
        " retreat into siege"
      ],
      "army-not-retreat-into-siege": (action, front, f) => [
        f.player(front),
        " army in ",
        f.region(action.region),
        " does not retreat into siege"
      ],
      "army-retreat": (action, front, f) => [
        f.player(front),
        " retreats in ",
        f.region(action.toRegion)
      ],
      "army-not-retreat": (action, front, f) => [f.player(front), " does not retreat"],
      "army-advance": (action, front, f) => [f.player(front), " advances into the attacked region"],
      "army-not-advance": (action, front, f) => [
        f.player(front),
        " does not advance into the attacked region"
      ],
      "battle-continue": (action, front, f) => [
        f.player(front),
        " continue battle in ",
        f.region(action.region)
      ],
      "battle-cease": (action, front, f) => [
        f.player(front),
        " cease tha battle in ",
        f.region(action.region)
      ],
      "leader-forfeit": (action, front, f) => {
        const forfeitedUnits: string[] = [];
        const nElites = action.leaders.elites?.reduce((n, elite) => n + elite.quantity, 0) || 0;
        if (nElites > 0) forfeitedUnits.push(`${nElites} elite unit${nElites > 1 ? "s" : ""}`);
        const nLeaders = action.leaders.leaders?.reduce((n, leader) => n + leader.quantity, 0) || 0;
        if (nLeaders > 0) forfeitedUnits.push(`${nLeaders} leader${nLeaders > 1 ? "s" : ""}`);
        const nNazgul = action.leaders.nNazgul || 0;
        if (nNazgul > 0) forfeitedUnits.push(`${nNazgul} Nazgul${nNazgul > 1 ? "s" : ""}`);
        action.leaders.characters?.forEach(characterId => {
          forfeitedUnits.push(this.q.character(characterId).name());
        });
        return [f.player(front), ` forfeits leadership of ${forfeitedUnits.join(", ")}`];
      },
      "combat-card-choose": (action, front, f) => [
        f.player(front),
        ` chooses a ${isCharacterCard(action.card) ? "character" : "strategy"} combat card`
      ],
      "combat-card-choose-not": (action, front, f) => [
        f.player(front),
        " does not play any combat card"
      ],
      "combat-roll": (action, front, f) => [f.player(front), " rolls ", action.dice.join(", ")],

      "combat-re-roll": (action, front, f) => [
        f.player(front),
        " re-rolls ",
        action.dice.join(", ")
      ]
    };
  }

  async resolveBattleFlow(action: WotrArmyAttack, attacker: WotrPlayer, defender: WotrPlayer) {
    this.logger.logBattleResolution();
    const retroguard = action.retroguard;
    const siege = !!this.attackedRegion(action).underSiegeArmy;
    const nSiegeCombatRounds = siege ? this.getNSiegeCombatRounds() : undefined;

    const battle: WotrBattle = {
      action,
      attacker,
      defender,
      retroguard,
      region: action.toRegion,
      siege: !!this.attackedRegion(action).underSiegeArmy,
      nSiegeCombatRounds
    };
    this.battleStore.startBattle(battle);
    await this.resolveBattle(battle);
    this.battleStore.endBattle();
  }

  private async resolveBattle(battle: WotrBattle) {
    let round = 1;
    let continueBattle = true;
    do {
      const combatRound = new WotrCombatRound(
        round,
        battle.action,
        battle.attacker,
        () => this.attackingArmy(battle.action),
        battle.defender,
        () => this.defendingArmy(battle.action, battle.siege),
        battle.siege,
        battle.siege && (battle.nSiegeCombatRounds ?? 0) > round
      );
      continueBattle = await this.resolveCombat(combatRound, battle);
      round++;
    } while (continueBattle);
  }

  private async resolveCombat(combatRound: WotrCombatRound, battle: WotrBattle): Promise<boolean> {
    this.battleModifiers.onBeforeCombatRound(combatRound);
    const attackedRegion = this.attackedRegion(combatRound.action);
    const hasStronghold = attackedRegion.settlement === "stronghold";
    if (hasStronghold && !combatRound.siege) {
      const retreatIntoSiege = await this.wantRetreatIntoSiege(combatRound.defender.player);
      if (retreatIntoSiege) {
        await this.battleAdvance(combatRound.attacker.player); // TODO controllare se avanza
        return false;
      }
    }
    await this.chooseCombatCards(combatRound);
    this.revealCombatCards(combatRound);
    await this.resolveCombatCards(0, combatRound);
    await this.resolveCombatCards(1, combatRound);
    if (!combatRound.endBattle) {
      await this.resolveCombatCards(2, combatRound);
      if (!combatRound.endBattle) {
        await this.resolveCombatCards(3, combatRound);
        await this.combatRolls(combatRound);
        await this.resolveCombatCards(4, combatRound);
        await this.leaderReRolls(combatRound);
        await this.resolveCombatCards(5, combatRound);
        await this.resolveCombatCards(6, combatRound);
        await this.chooseCasualties(combatRound, battle);
        await this.resolveCombatCards(7, combatRound);
      }
    }

    let continueBattle = false;
    let attackerWon = false;
    const attackerArmy = combatRound.attacker.army();
    const attackerHasUnitLeft =
      attackerArmy && !this.unitUtils.isEmptyArmy(combatRound.attacker.army());
    if (this.isDefenderDefeated(combatRound)) {
      attackerWon = true;
    } else if (attackerHasUnitLeft) {
      if (combatRound.siege) {
        if (combatRound.siegeAutoContinueBattle) {
          continueBattle = true;
        } else {
          if (this.canContinueSiegeBattle(combatRound)) {
            continueBattle = await this.wantContinueBattle(combatRound.attacker.player);
          }
        }
      } else {
        const canCease = this.canCease(combatRound);
        const wantContinueBattle =
          !canCease || (await this.wantContinueBattle(combatRound.attacker.player));
        if (wantContinueBattle) {
          if (this.canRetreat(combatRound.defender)) {
            const wantRetreat = await this.wantRetreat(combatRound.defender.player);
            if (wantRetreat === "army-retreat-into-siege" || wantRetreat === "army-retreat") {
              attackerWon = true;
            } else {
              continueBattle = true;
            }
          } else {
            continueBattle = true;
          }
        } else {
          continueBattle = true;
        }
      }
    }

    if (attackerWon) {
      if (combatRound.action.toRegion !== combatRound.action.fromRegion) {
        await this.battleAdvance(combatRound.attacker.player);
      }
      const attackedRegion = this.attackedRegion(combatRound.action);
      if (!attackedRegion.underSiegeArmy && attackedRegion.settlement) {
        this.regionStore.setControlledBy(combatRound.attacker.frontId, combatRound.action.toRegion); // TODO controllare se avanza
        this.nationHandler.checkNationAdvanceByCapture(combatRound.action.toRegion);
        this.frontHandler.refreshVictoryPoints();
      }
    }

    await this.battleModifiers.onAfterCombatRound(combatRound);

    return continueBattle;
  }

  private isDefenderDefeated(combatRound: WotrCombatRound) {
    const region = this.attackedRegion(combatRound.action);
    const hasDefenderArmy =
      region.army?.front === combatRound.defender.frontId ||
      region.underSiegeArmy?.front === combatRound.defender.frontId;
    return !hasDefenderArmy;
  }

  private async chooseCombatCards(combatRound: WotrCombatRound) {
    await this.chooseCombatCard(combatRound.attacker, combatRound);
    await this.chooseCombatCard(combatRound.defender, combatRound);
  }

  private async chooseCombatCard(combatFront: WotrCombatFront, combatRound: WotrCombatRound) {
    if (!this.canChooseCombatCard(combatFront, combatRound)) return;
    const story = await combatFront.player.chooseCombatCard(combatRound);
    const action = assertAction<WotrCombatCardChoose | WotrCombatCardChooseNot>(
      story,
      "combat-card-choose",
      "combat-card-choose-not"
    );
    switch (action.type) {
      case "combat-card-choose":
        // eslint-disable-next-line require-atomic-updates
        combatFront.combatCard = getCard(action.card);
        break;
      case "combat-card-choose-not":
        break;
    }
  }

  private canChooseCombatCard(combatFront: WotrCombatFront, combatRound: WotrCombatRound): boolean {
    const currentCard = this.frontStore.currentCard();
    if (!currentCard) return true;
    if (!this.battleModifiers.canUseCombatCard(combatFront, combatRound)) return false;
    // TODO modifiers
    if (combatFront.frontId === "shadow") return true;
    if (currentCard === "sstr02" || currentCard === "scha20") {
      if (combatRound.round !== 1) return true;
      const freeArmy = combatRound.defender.army();
      if (this.unitUtils.hasCompanions(freeArmy)) return true;
      return false;
    }
    return true;
  }

  private canCease(combatRound: WotrCombatRound): boolean {
    const currentCard = this.frontStore.currentCard();
    if (!currentCard) return true;
    if (currentCard === "sstr10") return false;
    return true;
  }

  private revealCombatCards(combatRound: WotrCombatRound) {
    this.revealCombatCard(combatRound.attacker);
    this.revealCombatCard(combatRound.defender);
  }

  private revealCombatCard(combatFront: WotrCombatFront) {
    if (combatFront.combatCard) {
      this.frontStore.discardCards([combatFront.combatCard.id], combatFront.frontId);
      this.battleStore.addAttackerCombatCard(combatFront.combatCard.id);
      this.logger.logCombatCard(combatFront.combatCard.id, combatFront.frontId);
    }
  }

  private async resolveCombatCards(timing: number, combatRound: WotrCombatRound) {
    await this.resolveCombatCard(timing, combatRound.defender, combatRound);
    await this.resolveCombatCard(timing, combatRound.attacker, combatRound);
  }

  private async resolveCombatCard(
    timing: number,
    combatFront: WotrCombatFront,
    combatRound: WotrCombatRound
  ) {
    if (combatFront.combatCard?.combatTiming === timing) {
      const params = this.combatCardParams(combatFront.frontId, combatRound);
      await this.combatCards.combatCardReaction(combatFront.combatCard, params);
    }
  }

  combatCardParams(frontId: WotrFrontId, combatRound: WotrCombatRound): WotrCombatCardParams {
    return {
      front: frontId,
      combatRound,
      shadow: combatRound.shadow,
      freePeoples: combatRound.freePeoples,
      isAttacker: combatRound.attacker.frontId === frontId,
      attackedArmy: () => this.defendingArmy(combatRound.action, combatRound.siege),
      attackingArmy: () => this.attackingArmy(combatRound.action),
      regionId: combatRound.action.toRegion
    };
  }

  private async combatRolls(combatRound: WotrCombatRound) {
    const nDice: Record<WotrFrontId, number> = {
      "free-peoples": this.getNRolls(combatRound.freePeoples, combatRound),
      "shadow": this.getNRolls(combatRound.shadow, combatRound)
    };
    const { "shadow": shadowRoll, "free-peoples": freePeoplesRoll } =
      await this.parallelRollCombatDice(nDice);
    // eslint-disable-next-line require-atomic-updates
    combatRound.shadow.combatRoll = shadowRoll;
    combatRound.shadow.nCombatSuccesses = this.getNRollSuccesses(
      shadowRoll,
      combatRound.shadow,
      combatRound,
      false
    );
    combatRound.freePeoples.combatRoll = freePeoplesRoll;
    combatRound.freePeoples.nCombatSuccesses = this.getNRollSuccesses(
      freePeoplesRoll,
      combatRound.freePeoples,
      combatRound,
      false
    );
  }

  private async leaderReRolls(combatRound: WotrCombatRound) {
    const defenderNReRolls = this.getNReRolls(
      combatRound.defender,
      combatRound.attacker,
      combatRound
    );
    const attackerNReRolls = this.getNReRolls(
      combatRound.attacker,
      combatRound.defender,
      combatRound
    );
    if (defenderNReRolls) {
      if (attackerNReRolls) {
        const nDice: Record<WotrFrontId, number> = {
          "shadow": combatRound.defender.frontId === "shadow" ? defenderNReRolls : attackerNReRolls,
          "free-peoples":
            combatRound.defender.frontId === "free-peoples" ? defenderNReRolls : attackerNReRolls
        };
        const { "shadow": shadowReRoll, "free-peoples": freePeoplesReRoll } =
          await this.parallelReRollCombatDice(nDice);
        // eslint-disable-next-line require-atomic-updates
        combatRound.shadow.leaderReRoll = shadowReRoll;
        combatRound.shadow.nLeaderSuccesses = this.getNRollSuccesses(
          shadowReRoll,
          combatRound.shadow,
          combatRound,
          true
        );
        combatRound.freePeoples.leaderReRoll = freePeoplesReRoll;
        combatRound.freePeoples.nLeaderSuccesses = this.getNRollSuccesses(
          freePeoplesReRoll,
          combatRound.freePeoples,
          combatRound,
          true
        );
      } else {
        const defenderReRoll = await this.reRollCombatDice(
          defenderNReRolls,
          combatRound.defender.player
        );
        // eslint-disable-next-line require-atomic-updates
        combatRound.defender.leaderReRoll = defenderReRoll;
        combatRound.defender.nLeaderSuccesses = this.getNRollSuccesses(
          defenderReRoll,
          combatRound.defender,
          combatRound,
          true
        );
      }
    } else if (attackerNReRolls) {
      const attackerReRoll = await this.reRollCombatDice(
        attackerNReRolls,
        combatRound.attacker.player
      );
      // eslint-disable-next-line require-atomic-updates
      combatRound.attacker.leaderReRoll = attackerReRoll;
      combatRound.attacker.nLeaderSuccesses = this.getNRollSuccesses(
        attackerReRoll,
        combatRound.attacker,
        combatRound,
        true
      );
    }
    combatRound.defender.nTotalHits =
      (combatRound.defender.nCombatSuccesses ?? 0) + (combatRound.defender.nLeaderSuccesses ?? 0);
    combatRound.attacker.nTotalHits =
      (combatRound.attacker.nCombatSuccesses ?? 0) + (combatRound.attacker.nLeaderSuccesses ?? 0);
  }

  private getNRolls(combatFront: WotrCombatFront, combatRound: WotrCombatRound): number {
    const combatStrength = this.getCombatStrength(combatFront, combatRound);
    let nRolls = Math.min(combatStrength, 5);
    if (combatFront.lessNCombatDice) nRolls = Math.max(1, nRolls - combatFront.lessNCombatDice);
    if (combatFront.maxNCombatDice) nRolls = Math.min(nRolls, combatFront.maxNCombatDice);
    return nRolls;
  }

  private getNReRolls(
    combatFront: WotrCombatFront,
    oppositeCombatFront: WotrCombatFront,
    combatRound: WotrCombatRound
  ): number {
    if (combatFront.leaderRollCancelled) return 0;
    const combatRoll = combatFront.combatRoll!;
    const nSuccesses = combatFront.nCombatSuccesses!;
    const nFailures = combatRoll.length - nSuccesses;
    if (!nFailures) return 0;
    const oppositeHitPoints = this.getHitPoints(oppositeCombatFront, combatRound);
    if (nSuccesses >= oppositeHitPoints) return 0;
    const leadership = this.getLeadership(combatFront, combatRound);
    if (!leadership) return 0;
    let nReRolls = Math.min(nFailures, leadership);
    if (combatFront.lessNLeaderDice) nReRolls = Math.max(0, nReRolls - combatFront.lessNLeaderDice);
    return nReRolls;
  }

  private getHitPoints(combatFront: WotrCombatFront, combatRound: WotrCombatRound): number {
    if (combatFront.isAttacker) {
      const retroguard = this.battle().retroguard;
      const retroguardLeadership = retroguard ? this.getUnitsHitPoints(retroguard) : 0;
      const armyLeadership = this.getUnitsHitPoints(this.attackingArmy(combatRound.action));
      return armyLeadership - retroguardLeadership;
    } else {
      return this.getUnitsHitPoints(this.defendingArmy(combatRound.action, combatRound.siege));
    }
  }

  private getUnitsHitPoints(army: WotrArmy | undefined) {
    if (!army) {
      return 0;
    }
    let damagePoints = 0;
    damagePoints += army.regulars?.reduce((d, r) => d + r.quantity, 0) || 0;
    damagePoints += army.elites?.reduce((d, r) => d + r.quantity * 2, 0) || 0;
    return damagePoints;
  }

  getCombatStrength(combatFront: WotrCombatFront, combatRound: WotrCombatRound): number {
    const army = combatFront.army();
    let strength = this.unitRules.getArmyCombatStrength(army);
    combatFront.combatStrengthModifiers.forEach(modifier => {
      strength += modifier;
    });
    return strength;
  }

  private getLeadership(combatFront: WotrCombatFront, combatRound: WotrCombatRound): number {
    if (combatFront.isAttacker) {
      const attackingArmy = this.attackingArmy(combatRound.action);
      return (
        this.unitRules.getArmyLeadership(attackingArmy, false, combatFront.cancelledCharacters) -
        combatFront.forfeitedLeadership
      );
    } else {
      const attackedArmy = this.defendingArmy(combatRound.action, combatRound.siege);
      return attackedArmy
        ? this.unitRules.getArmyLeadership(attackedArmy, false, combatFront.cancelledCharacters) -
            combatFront.forfeitedLeadership
        : 0;
    }
  }

  private getNRollSuccesses(
    roll: WotrCombatDie[],
    combatFront: WotrCombatFront,
    combatRound: WotrCombatRound,
    reRoll: boolean
  ) {
    const successThreashold = this.getSuccessThreashold(combatFront, combatRound, reRoll);
    return roll.reduce((successes, dice) => {
      if (dice >= successThreashold) {
        successes++;
      }
      return successes;
    }, 0);
  }

  private getSuccessThreashold(
    combatFront: WotrCombatFront,
    combatRound: WotrCombatRound,
    reRoll: boolean
  ) {
    const defaultSuccessThreashold = this.getDefaultSuccessThreashold(combatFront, combatRound);
    const modifiers = reRoll ? combatFront.leaderModifiers : combatFront.combatModifiers;
    return modifiers.reduce((t, modifier) => {
      t -= modifier;
      return t;
    }, defaultSuccessThreashold);
  }

  private getDefaultSuccessThreashold(
    combatFront: WotrCombatFront,
    combatRound: WotrCombatRound
  ): number {
    if (combatFront.isAttacker) {
      const region = this.attackedRegion(combatRound.action);
      if ((region.fortification || region.settlement === "city") && combatRound.round === 1) {
        return 6;
      }
      if (region.underSiegeArmy) {
        return 6;
      } // TODO non sempre
    }
    return 5;
  }

  private async chooseCasualties(combatRound: WotrCombatRound, battle: WotrBattle) {
    const attackingArmy = this.attackingArmy(combatRound.action);
    let defenderHits = combatRound.defender.nTotalHits || 0;
    defenderHits += combatRound.defender.hitsModifiers.reduce(
      (hits, modifier) => hits + modifier,
      0
    );
    await this.unitHandler.chooseArmyCasualties(
      defenderHits,
      attackingArmy,
      battle.action.fromRegion,
      null,
      combatRound.attacker.player
    );
    const attackedArmy = this.defendingArmy(combatRound.action, combatRound.siege);
    let attackerHits = combatRound.attacker.nTotalHits || 0;
    attackerHits += combatRound.attacker.hitsModifiers.reduce(
      (hits, modifier) => hits + modifier,
      0
    );
    await this.unitHandler.chooseArmyCasualties(
      attackerHits,
      attackedArmy,
      battle.action.toRegion,
      null,
      combatRound.defender.player
    );
  }

  private attackingRegion(action: WotrArmyAttack) {
    return this.regionStore.region(action.fromRegion);
  }
  private attackingArmy(action: WotrArmyAttack): WotrArmy {
    if (action.retroguard) {
      return this.unitUtils.splitUnits(this.attackingRegion(action).army, action.retroguard)!;
    } else {
      return this.attackingRegion(action).army!;
    }
  }
  private defendingArmy(action: WotrArmyAttack, siege: boolean): WotrArmy {
    const attackedRegion = this.attackedRegion(action);
    return siege ? attackedRegion.underSiegeArmy! : attackedRegion.army!;
  }
  private attackedRegion(action: WotrArmyAttack) {
    return this.regionStore.region(action.toRegion);
  }
  private battle() {
    return this.battleStore.battle()!;
  }

  private async wantRetreatIntoSiege(player: WotrPlayer): Promise<boolean> {
    const story = await player.wantRetreatIntoSiege();
    const action = assertAction<WotrArmyRetreatIntoSiege | WotrArmyNotRetreatIntoSiege>(
      story,
      "army-retreat-into-siege",
      "army-not-retreat-into-siege"
    );
    switch (action.type) {
      case "army-retreat-into-siege":
        return true;
      case "army-not-retreat-into-siege":
        return false;
    }
  }

  private canRetreat(defender: WotrCombatFront): boolean {
    const battle = this.battle();
    const region = this.regionStore.region(battle.action.toRegion);
    return region.neighbors.some(neighbor => {
      return this.regionStore.isFreeForArmyRetreat(neighbor, defender.frontId);
    });
  }

  private async wantRetreat(
    player: WotrPlayer
  ): Promise<"army-retreat-into-siege" | "army-retreat" | "army-not-retreat"> {
    const story = await player.wantRetreat();
    const action = assertAction<WotrArmyRetreatIntoSiege | WotrArmyRetreat | WotrArmyNotRetreat>(
      story,
      "army-retreat-into-siege",
      "army-retreat",
      "army-not-retreat"
    );
    return action.type;
  }

  private async reRollCombatDice(nDice: number, player: WotrPlayer): Promise<WotrCombatDie[]> {
    const story = await player.reRollCombatDice(nDice);
    const action = assertAction<WotrCombatReRoll>(story, "combat-re-roll");
    return action.dice;
  }

  private async parallelRollCombatDice(
    nDice: Record<WotrFrontId, number>
  ): Promise<Record<WotrFrontId, WotrCombatDie[]>> {
    const stories = await this.allPlayers.rollCombatDice(nDice);
    return {
      "free-peoples": assertAction<WotrCombatRoll>(stories["free-peoples"], "combat-roll").dice,
      "shadow": assertAction<WotrCombatRoll>(stories.shadow, "combat-roll").dice
    };
  }

  private async parallelReRollCombatDice(
    nDice: Record<WotrFrontId, number>
  ): Promise<Record<WotrFrontId, WotrCombatDie[]>> {
    const stories = await this.allPlayers.reRollCombatDice(nDice);
    return {
      "free-peoples": assertAction<WotrCombatReRoll>(stories["free-peoples"], "combat-re-roll")
        .dice,
      "shadow": assertAction<WotrCombatReRoll>(stories.shadow, "combat-re-roll").dice
    };
  }

  private async battleAdvance(player: WotrPlayer): Promise<boolean> {
    const currentCard = this.frontStore.currentCard();
    if (currentCard === "sstr10") {
      this.applyArmyAdvance({
        type: "army-advance"
      });
      return true;
    }
    const story = await player.battleAdvance();
    const action = assertAction<WotrArmyAdvance | WotrArmyNotAdvance>(
      story,
      "army-advance",
      "army-not-advance"
    );
    switch (action.type) {
      case "army-advance":
        return true;
      case "army-not-advance":
        return false;
    }
  }

  private canContinueSiegeBattle(combatRound: WotrCombatRound): boolean {
    const attackingArmy = this.attackingArmy(combatRound.action);
    return this.unitUtils.hasEliteUnits(attackingArmy);
  }

  private async wantContinueBattle(player: WotrPlayer): Promise<boolean> {
    const story = await player.wantContinueBattle();
    const action = assertAction<WotrBattleContinue | WotrBattleCease>(
      story,
      "battle-continue",
      "battle-cease"
    );
    switch (action.type) {
      case "battle-continue":
        return true;
      case "battle-cease":
        return false;
    }
  }
}

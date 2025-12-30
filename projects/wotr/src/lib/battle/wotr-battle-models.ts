import { WotrCard, WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrPlayer } from "../player/wotr-player";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrArmy } from "../unit/wotr-unit-models";
import { WotrArmyAttack } from "./wotr-battle-actions";
import { WotrCombatDie } from "./wotr-combat-die-models";

export interface WotrBattle {
  region: WotrRegionId;
  action: WotrArmyAttack;
  attacker: WotrPlayer;
  defender: WotrPlayer;
  retroguard?: WotrArmy;
  attackerCombatCard?: WotrCardId;
  defenderCombatCard?: WotrCardId;
  siege: boolean;
  nSiegeCombatRounds?: number;
}

export class WotrCombatFront {
  constructor(
    public player: WotrPlayer,
    public isAttacker: boolean,
    public army: () => WotrArmy
  ) {}

  frontId = this.player.frontId;

  combatCard?: WotrCard;
  maxNCombatDice: number = 5;
  lessNCombatDice: number = 0;
  lessNLeaderDice: number = 0;
  /** Modifiers applied to the combat strength */
  combatStrengthModifiers: number[] = [];
  /** Modifiers applied to each die during the combat roll */
  combatModifiers: number[] = [];
  /** Modifiers applied to each die during the leader re-roll */
  leaderModifiers: number[] = [];
  /** Modifiers to the number of hits inflicted by this front to the other */
  hitsModifiers: number[] = [];
  cancelledCharacters: WotrCharacterId[] = [];
  leaderRollCancelled: boolean = false;

  combatRoll?: WotrCombatDie[];
  nCombatSuccesses?: number;
  leaderReRoll?: WotrCombatDie[];
  nLeaderSuccesses?: number;
  nTotalHits?: number;
}

export class WotrCombatRound {
  constructor(
    public round: number,
    public action: WotrArmyAttack,
    attacker: WotrPlayer,
    attackingArmy: () => WotrArmy,
    defender: WotrPlayer,
    defendingArmy: () => WotrArmy,
    public siege: boolean,
    public siegeAutoContinueBattle: boolean
  ) {
    this.attacker = new WotrCombatFront(attacker, true, attackingArmy);
    this.defender = new WotrCombatFront(defender, false, defendingArmy);
    if (attacker.frontId === "shadow") {
      this.shadow = this.attacker;
      this.freePeoples = this.defender;
    } else {
      this.shadow = this.defender;
      this.freePeoples = this.attacker;
    }
  }

  attacker: WotrCombatFront;
  defender: WotrCombatFront;
  shadow: WotrCombatFront;
  freePeoples: WotrCombatFront;
  endBattle = false;
}

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
  maxNDice: number = 5;
  lessNDice: number = 0;
  combatModifiers: number[] = [];
  leaderModifiers: number[] = [];
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

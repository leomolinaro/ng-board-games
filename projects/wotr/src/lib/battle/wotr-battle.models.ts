import { WotrCard, WotrCardId } from "../card/wotr-card.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrArmy } from "../unit/wotr-unit.models";
import { WotrArmyAttack } from "./wotr-battle-actions";
import { WotrCombatDie } from "./wotr-combat-die.models";

export interface WotrBattle {
  region: WotrRegionId;
  action: WotrArmyAttack;
  attackerId: WotrFrontId;
  defenderId: WotrFrontId;
  retroguard?: WotrArmy;
  attackerCombatCard?: WotrCardId;
  defenderCombatCard?: WotrCardId;
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

export class WotrCombatRound {
  
  constructor (
    public round: number,
    public action: WotrArmyAttack,
    attackerId: WotrFrontId,
    defenderId: WotrFrontId,
    public siegeBattle: boolean
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
  }

  attacker: WotrCombatFront;
  defender: WotrCombatFront;
  shadow: WotrCombatFront;
  freePeoples: WotrCombatFront;
  endBattle = false;

}

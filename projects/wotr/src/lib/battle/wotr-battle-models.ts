import type { WotrCard, WotrCardId } from '../card/wotr-card-models';
import type { WotrCharacterId } from '../character/wotr-character-models';
import { WotrFrontId } from '../front/wotr-front-models';
import type { WotrPlayer } from '../player/wotr-player';
import type { WotrRegionId } from '../region/wotr-region-models';
import type { WotrArmy } from '../unit/wotr-unit-models';
import type { WotrArmyAttack } from './wotr-battle-actions';
import type { WotrCombatDie } from './wotr-combat-die-models';

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
  nRegularCasualtiesToContinueSiege?: number;
}

export class WotrCombatFront {
  constructor(
    public player: WotrPlayer,
    public isAttacker: boolean,
    public army: () => WotrArmy,
    public regionId: WotrRegionId,
  ) {
    this.frontId = this.player.frontId;
  }
  frontId: WotrFrontId;

  combatCard?: WotrCard;
  forfeitedCombatCard = false;
  cancelledCombatCard = false;
  maxNCombatDice = 5;
  lessNCombatDice = 0;
  lessNLeaderDice = 0;
  forfeitedLeadership = 0;
  negateNazgulLeadership = false;
  /** Modifiers applied to the combat strength */
  combatStrengthModifiers: number[] = [];
  /** Modifiers applied to each die during the combat roll */
  combatModifiers: number[] = [];
  /** Modifiers applied to each die during the leader re-roll */
  leaderModifiers: number[] = [];
  /** Modifiers to the number of hits inflicted by this front to the other */
  hitsModifiers: number[] = [];
  cancelledCharacters: WotrCharacterId[] = [];
  leaderRollCancelled = false;

  combatRoll?: WotrCombatDie[];
  nCombatSuccesses?: number;
  leaderReRoll?: WotrCombatDie[];
  nLeaderSuccesses?: number;
  nTotalHits?: number;
  nPreCombatHits = 0;

  canRemoveRegularToContinueSiege?: boolean;

  isCharacterActiveInBattle(characterId: WotrCharacterId): boolean {
    if (!this.army().characters?.includes(characterId)) return false;
    return !this.cancelledCharacters.includes(characterId);
  }
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
    public siegeAutoContinueBattle: boolean,
  ) {
    this.attacker = new WotrCombatFront(
      attacker,
      true,
      attackingArmy,
      action.fromRegion,
    );
    this.defender = new WotrCombatFront(
      defender,
      false,
      defendingArmy,
      action.toRegion,
    );
    if (attacker.frontId === 'shadow') {
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

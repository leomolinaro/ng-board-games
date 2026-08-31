import { BritAreaId, BritLandAreaId } from './brit-components.models';
import { BritAreaUnit } from './brit-game-state.models';

export type BritStory =
  BritArmyPlacement | BritArmyMovements | BritBattleInitiation;

export interface BritArmyPlacement {
  infantryPlacement: (
    BritLandAreaId | { areaId: BritLandAreaId; quantity: number }
  )[];
}

export interface BritArmyMovements {
  movements: BritArmyMovement[];
}

export interface BritArmyMovement {
  units: BritAreaUnit[];
  toAreaId: BritAreaId;
}

export interface BritBattleInitiation {
  landId: BritLandAreaId;
}

export interface BritBattleAttack {}

export interface BritBattleDefend {}

export interface BritBattleDefendResolution {}

export interface BritBattleAttackResolution {}

export interface BritRaidRetreat {}

export interface BritOverpopulationChecks {}

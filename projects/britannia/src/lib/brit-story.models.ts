import { BritAreaId, BritLandAreaId } from "./brit-components.models";
import { BritAreaUnit } from "./brit-game-state.models";

export type BritStory =
  | BritArmyPlacement
  | BritArmyMovements
  | BritBattleInitiation;

export interface BritArmyPlacement {
  infantryPlacement: (
    | BritLandAreaId
    | { areaId: BritLandAreaId; quantity: number }
  )[];
} // BritArmyPlacement

export interface BritArmyMovements {
  movements: BritArmyMovement[];
} // BritArmyMovements

export interface BritArmyMovement {
  units: BritAreaUnit[];
  toAreaId: BritAreaId;
} // BritArmyMovement

export interface BritBattleInitiation {
  landId: BritLandAreaId;
} // BritBattleInitiation

export interface BritBattleAttack {} // BritBattleAttack

export interface BritBattleDefend {} // BritBattleDefend

export interface BritBattleDefendResolution {} // BritBattleDefendResolution

export interface BritBattleAttackResolution {} // BritBattleAttackResolution

export interface BritRaidRetreat {} // BritRaidRetreat

export interface BritOverpopulationChecks {} // BritOverpopulationChecks

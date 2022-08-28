import { BritAreaId, BritLandAreaId } from "./brit-components.models";
import { BritAreaUnit } from "./brit-game-state.models";

export type BritStory = BritArmyPlacement | BritArmyMovements;

export interface BritArmyPlacement {
  infantryPlacement: (BritLandAreaId | { areaId: BritLandAreaId, quantity: number })[];
} // BritArmyPlacement

export interface BritArmyMovements {
  movements: BritArmyMovement[];
} // BritArmyMovements

export interface BritArmyMovement {
  units: BritAreaUnit[],
  toAreaId: BritAreaId;
} // BritArmyMovement

import { BritLandAreaId } from "./brit-components.models";

export type BritStory = BritArmyPlacement | BritArmyMovement;

export interface BritArmyPlacement {
  infantryPlacement: (BritLandAreaId | { areaId: BritLandAreaId, quantity: number })[];
} // BritArmyPlacement

export interface BritArmyMovement {

} // BritArmyMovement
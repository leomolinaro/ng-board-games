import { BritLandAreaId } from "./brit-components.models";

export type BritStory = BritArmyPlacement;

export interface BritArmyPlacement {
  infantryPlacement: (BritLandAreaId | { areaId: BritLandAreaId, quantity: number })[];
} // BritArmyPlacement
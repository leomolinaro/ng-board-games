import { BritLandAreaId } from "./brit-components.models";

export type BritStory = BritArmiesPlacement;

export interface BritArmiesPlacement {
  infantriesPlacement: BritLandAreaId[];
} // BritArmiesPlacement
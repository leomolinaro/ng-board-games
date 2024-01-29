import { WotrFrontId } from "./wotr-front.models";

export type WotrNationId = "dwarves" | "elves" | "gondor" | "north" | "rohan" | "isengard" | "sauron" | "southrons";

export interface WotrNation {
  id: WotrNationId;
  name: string;
  front: WotrFrontId;
  regularLabel: string;
  eliteLabel: string;
  leaderLabel: string | null;
  units: {
    regular: number;
    elite: number;
    leader: number;
    nazgul: number;
  };
  reinforcements: {
    regular: number;
    elite: number;
    leader: number;
    nazgul: number;
  };
  casualties: {
    regular: number;
    elite: number;
    leader: number;
  };
  active: boolean;
  politicalStep: WotrPoliticalStep;
}

export type WotrArmyUnitType = "regular" | "elite";
export type WotrFreePeopleLeaderUnitType = "leader" | "companion";
export type WotrShadowLeaderUnitType = "nazgul" | "minion";
export type WotrFreeUnitType = "nazgul" | "companion" | "minion" | "fellowship";
export type WotrUnitType = WotrArmyUnitType | WotrFreePeopleLeaderUnitType | WotrShadowLeaderUnitType | WotrFreeUnitType;

export type WotrPoliticalStep = 3 | 2 | 1 | "atWar";

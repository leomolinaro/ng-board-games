import { WotrFrontId } from "../front/wotr-front.models";

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
export type WotrFreeUnitType = "nazgul" | "companion" | "minion" | "fellowship";
export type WotrFreeGenericUnitType = WotrArmyUnitType | "leader";
export type WotrGenericUnitType = WotrArmyUnitType | "leader" | "nazgul";

export type WotrPoliticalStep = 3 | 2 | 1 | "atWar";

export function frontOfNation (nationId: WotrNationId): WotrFrontId {
  switch (nationId) {
    case "dwarves":
    case "elves":
    case "gondor":
    case "north":
    case "rohan": return "free-peoples";
    case "isengard":
    case "sauron":
    case "southrons": return "shadow";
  }
}

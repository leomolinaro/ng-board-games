import { WotrFront } from "./front.models";

export type WotrNationId = "dwarves" | "elves" | "gondor" | "north" | "rohan" | "isengard" | "sauron" | "southrons";

export interface WotrNation {
  id: WotrNationId;
  name: string;
  front: WotrFront;
  nRegulars: number;
  nElites: number;
  nLeaders: number;
  nNazgul: number;
} // WotrNation

export type WotrCompanionId = "gandalf-the-grey" | "strider" | "boromir" | "legolas" | "gimli" | "meriadoc" | "peregrin" | "aragorn" | "gandalf-the-white" | "gollum";
export type WotrMinionId = "saruman" | "the-witch-king" | "the-mouth-of-sauron";
export type WotrArmyUnitType = "regular" | "elite";
export type WotrFreePeopleLeaderUnitType = "leader" | "companion";
export type WotrShadowLeaderUnitType = "nazgul" | "minion";
export type WotrFreeUnitType = "nazgul" | "companion" | "minion" | "fellowship";
export type WotrUnitType = WotrArmyUnitType | WotrFreePeopleLeaderUnitType | WotrShadowLeaderUnitType | WotrFreeUnitType;

export interface WotrCompanion {
  id: WotrCompanionId;
  name: string;
  level: number;
  leadership: number;
} // WotrCompanion

export interface WotrMinion {
  id: WotrMinionId;
  name: string;
  level: number;
  leadership: number;
} // WotrMinion

export type WotrPoliticalStep = 3 | 2 | 1 | "atWar";
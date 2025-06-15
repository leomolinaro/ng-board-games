import { WotrFrontId } from "../front/wotr-front.models";
import { WotrNationId } from "../nation/wotr-nation.models";

export type WotrCompanionId =
  | "gandalf-the-grey"
  | "strider"
  | "boromir"
  | "legolas"
  | "gimli"
  | "meriadoc"
  | "peregrin"
  | "aragorn"
  | "gandalf-the-white"
  | "gollum";
export type WotrMinionId = "saruman" | "the-witch-king" | "the-mouth-of-sauron";

export type WotrCharacterId = WotrCompanionId | WotrMinionId;

export interface WotrCharacter {
  id: WotrCharacterId;
  name: string;
  level: number;
  leadership: number;
  status: "inFellowship" | "available" | "inPlay" | "eliminated";
  front: WotrFrontId;
  activationNation?: WotrNationId | "all";
  flying: boolean;
}

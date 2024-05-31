import { WotrFrontId } from "../front/wotr-front.models";

export type WotrCompanionId = "gandalf-the-grey" | "strider" | "boromir" | "legolas" | "gimli" | "meriadoc" | "peregrin" | "aragorn" | "gandalf-the-white";
export type WotrMinionId = "saruman" | "the-witch-king" | "the-mouth-of-sauron";

export type WotrCharacterId = WotrCompanionId | WotrMinionId;

export interface WotrCharacter {
  id: WotrCharacterId;
  name: string;
  level: number;
  leadership: number;
  status: "inFellowship" | "available" | "inPlay" | "eliminated";
  front: WotrFrontId;
}

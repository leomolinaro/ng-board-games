import { WotrFrontId } from "../front/wotr-front-models";
import { WotrNationId } from "../nation/wotr-nation-models";

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
  | "gollum"
  | KomeSovereignId;

export type WotrMinionId =
  | "saruman"
  | "the-witch-king"
  | "the-mouth-of-sauron"
  // Kome
  | "the-black-serpent"
  | "the-shadow-of-mirkwood"
  | "ugluk";

export type KomeSovereignId = "brand" | "dain" | "denethor" | "theoden" | "thranduil";

export type WotrCharacterId = WotrCompanionId | WotrMinionId;

export interface WotrCharacter {
  id: WotrCharacterId;
  name: string;
  level: number;
  leadership: number;
  dieBonus?: "actionDie" | "rulerDie";
  status: "inFellowship" | "available" | "inPlay" | "eliminated";
  rulerStatus?: "leader" | "awakened" | "corrupted";
  awakenedLeadership?: number;
  front: WotrFrontId;
  activationNation?: WotrNationId | "all";
  shadowResistance?: number;
  flying: boolean;
}

export function baseCharacters(): WotrCharacterId[] {
  return [
    "gandalf-the-grey",
    "strider",
    "boromir",
    "legolas",
    "gimli",
    "meriadoc",
    "peregrin",
    "gandalf-the-white",
    "aragorn",
    "gollum",
    "saruman",
    "the-witch-king",
    "the-mouth-of-sauron"
  ];
}

export function komeCharacters(): WotrCharacterId[] {
  return [
    "brand",
    "dain",
    "denethor",
    "theoden",
    "thranduil",
    "the-black-serpent",
    "the-shadow-of-mirkwood",
    "ugluk"
  ];
}

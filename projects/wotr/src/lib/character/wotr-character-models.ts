import { WotrFrontId } from "../front/wotr-front-models";
import { WotrHuntTileId } from "../hunt/wotr-hunt-models";
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
  isMinionForGandalfTheWhite: boolean;
  awakenedLeadership?: number;
  front: WotrFrontId;
  activationNation?: WotrNationId | "all";
  shadowResistance?: number;
  flying: boolean;
}

export interface KomeSovereign extends WotrCharacter {
  id: KomeSovereignId;
  sovereignStatus: "leader" | "awakened" | "corrupted";
  dieBonus: "rulerDie";
  front: "free-peoples";
  shadowResistance: number;
  corruptionTiles: WotrHuntTileId[];
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

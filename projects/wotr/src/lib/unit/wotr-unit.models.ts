import { WotrCharacterId } from "../companion/wotr-character.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrNationId } from "../nation/wotr-nation.models";

export interface WotrArmy {
  front: WotrFrontId;
  regulars?: WotrNationUnit[];
  elites?: WotrNationUnit[];
  leaders?: WotrNationUnit[];
  nNazgul?: number;
  characters?: WotrCharacterId[];
}

export interface WotrFreeUnits {
  nNazgul?: number;
  characters?: WotrCharacterId[];
}

export interface WotrLeaderUnits {
  nNazgul?: number;
  characters?: WotrCharacterId[];
}

export interface WotrNationUnit {
  nation: WotrNationId;
  quantity: number;
}

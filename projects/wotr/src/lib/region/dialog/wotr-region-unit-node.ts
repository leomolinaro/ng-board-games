import { WotrCharacterQuery } from "../../character/wotr-character-query";
import { WotrFrontId } from "../../front/wotr-front-models";
import { WotrGenericUnitType, WotrNationId } from "../../nation/wotr-nation-models";

interface AUnitNode {
  id: string;
  group: "army" | "underSiege" | "freeUnits" | "fellowship";
  nationId: WotrNationId | null;
  frontId: WotrFrontId;
  source: string;
  label: string;
  width: number;
  height: number;
  selected?: boolean;
  downgrading?: boolean;
  removing?: boolean;
  selectable?: boolean;
}

export interface FellowshipNode extends AUnitNode {
  type: "fellowship";
}

export interface CharacterNode extends AUnitNode {
  type: "character";
  character: WotrCharacterQuery;
}

export interface GenericUnitNode extends AUnitNode {
  type: WotrGenericUnitType;
  nationId: WotrNationId;
}

export type UnitNode = FellowshipNode | CharacterNode | GenericUnitNode;

import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGenericUnitType, WotrNationId } from "../nation/wotr-nation-models";
import { WotrRegionId } from "../region/wotr-region-models";

export interface WotrUnits {
  regulars?: WotrNationUnit[];
  elites?: WotrNationUnit[];
  leaders?: WotrNationUnit[];
  nNazgul?: number;
  characters?: WotrCharacterId[];
}

export interface WotrArmy extends WotrUnits {
  front: WotrFrontId;
}

export interface WotrRegionUnits extends WotrUnits {
  regionId: WotrRegionId;
}

export interface WotrFreeUnits {
  nNazgul?: number;
  characters?: WotrCharacterId[];
}

export interface WotrLeaderUnits {
  elites?: WotrNationUnit[];
  leaders?: WotrNationUnit[];
  nNazgul?: number;
  characters?: WotrCharacterId[];
}

export interface WotrNationUnit {
  nation: WotrNationId;
  quantity: number;
}

export interface WotrReinforcementUnit {
  nation: WotrNationId;
  type: WotrGenericUnitType;
}

export interface WotrEliminateUnitsParams {
  regionIds: WotrRegionId[] | null;
  units: WotrRegionUnitMatch[];
}

export interface WotrRegionUnitMatch {
  unitType: WotrRegionUnitTypeMatch;
  nationId?: WotrNationId;
}

export interface WotrForfeitLeadershipParams {
  cardId: WotrCardId;
  frontId: WotrFrontId;
  regionId: WotrRegionId;
  onlyNazgul?: boolean;
  points: 1 | 2 | "oneOrMore";
}

export type WotrRegionUnitTypeMatch =
  | WotrRegionNationUnitTypeMatch
  | "nazgul"
  | "companion"
  | "minion"
  | "nazgulOrMinion";
export type WotrRegionNationUnitTypeMatch = "regular" | "elite" | "leader" | "army";

export function unitTypeMatchLabel(type: WotrRegionUnitTypeMatch): string {
  switch (type) {
    case "regular":
      return "regular unit";
    case "elite":
      return "elite unit";
    case "leader":
      return "leader";
    case "army":
      return "army unit";
    case "nazgul":
      return "Nazgul";
    case "companion":
      return "Companion";
    case "minion":
      return "Minion";
    case "nazgulOrMinion":
      return "Nazgul or Minion";
  }
}

export function regular(nation: WotrNationId, quantity: number = 1) {
  return new WotrNationUnitComposer("regulars", nation, quantity);
}
export function elite(nation: WotrNationId, quantity: number = 1) {
  return new WotrNationUnitComposer("elites", nation, quantity);
}
export function leader(nation: WotrNationId, quantity: number = 1) {
  return new WotrNationUnitComposer("leaders", nation, quantity);
}
export function nazgul(quantity: number = 1) {
  return new WotrNazgulComposer(quantity);
}
export function character(...characters: WotrCharacterId[]) {
  return new WotrCharacterComposer(characters);
}

export interface WotrUnitComposer {
  addTo(a: WotrUnits): WotrUnits;
}
class WotrNationUnitComposer implements WotrUnitComposer {
  constructor(
    private field: "regulars" | "elites" | "leaders",
    private nationId: WotrNationId,
    private quantity: number
  ) {}
  addTo(units: WotrUnits) {
    let slot = units[this.field];
    if (!slot) {
      slot = [];
      units[this.field] = slot;
    }
    slot.push({ quantity: this.quantity, nation: this.nationId });
    return units;
  }
}
class WotrNazgulComposer implements WotrUnitComposer {
  constructor(private quantity: number) {}
  addTo(units: WotrUnits) {
    if (!units.nNazgul) {
      units.nNazgul = 0;
    }
    units.nNazgul += this.quantity;
    return units;
  }
}
class WotrCharacterComposer implements WotrUnitComposer {
  constructor(private characters: WotrCharacterId[]) {}
  addTo(units: WotrUnits) {
    if (!units.characters) {
      units.characters = [];
    }
    this.characters.forEach(m => units.characters!.push(m));
    return units;
  }
}

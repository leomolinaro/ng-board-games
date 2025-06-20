import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGenericUnitType, WotrNationId } from "../nation/wotr-nation.models";

export interface WotrArmy {
  front: WotrFrontId;
  regulars?: WotrNationUnit[];
  elites?: WotrNationUnit[];
  leaders?: WotrNationUnit[];
  nNazgul?: number;
  characters?: WotrCharacterId[];
}

export interface WotrUnits {
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

export interface WotrReinforcementUnit {
  front: WotrFrontId;
  nation: WotrNationId;
  type: WotrGenericUnitType;
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

import { WotrCharacterId } from "../companion/wotr-character.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrArmyUnitType, WotrNationId, frontOfNation } from "../nation/wotr-nation.models";
import { WotrRegionId } from "../region/wotr-region.models";

export type WotrUnitAction =
  WotrArmyMovement | WotrArmyUnitRecruitment | WotrArmyUnitElimination |
  WotrLeaderRecruitment | WotrLeaderElimination |
  WotrNazgulRecruitment | WotrNazgulElimination;

export interface WotrArmyMovement { type: "army-movement"; fromRegion: WotrRegionId; toRegion: WotrRegionId; army?: WotrUnits }
export function moveArmy (fromRegion: WotrRegionId, toRegion: WotrRegionId, ...comp: WotrUnitComposer[]): WotrArmyMovement { return { type: "army-movement", fromRegion, toRegion, army: composeUnits (...comp) }; }
export function moveAllArmy (fromRegion: WotrRegionId, toRegion: WotrRegionId): WotrArmyMovement { return { type: "army-movement", fromRegion, toRegion }; }
export interface WotrArmyUnitRecruitment { type: "army-unit-recruitment"; region: WotrRegionId; unitType: WotrArmyUnitType; quantity: number; nation: WotrNationId }
export function recruitArmyUnit (region: WotrRegionId, comp: WotrArmyUnitsComposer): WotrArmyUnitRecruitment { return { type: "army-unit-recruitment", region, ...comp.recruited () }; }
export interface WotrArmyUnitElimination { type: "army-unit-elimination"; region: WotrRegionId; unitType: WotrArmyUnitType; quantity: number; nation: WotrNationId }
export function eliminateArmyUnit (region: WotrRegionId, comp: WotrArmyUnitsComposer): WotrArmyUnitElimination { return { type: "army-unit-elimination", region, ...comp.recruited () }; }
export interface WotrLeaderRecruitment { type: "leader-recruitment"; region: WotrRegionId; quantity: number; nation: WotrNationId }
export function recruitLeader (region: WotrRegionId, comp: WotrLeaderComposer): WotrLeaderRecruitment { return { type: "leader-recruitment", region, ...comp.recruited () }; }
export interface WotrLeaderElimination { type: "leader-elimination"; region: WotrRegionId; quantity: number; nation: WotrNationId }
export function eliminateLeader (region: WotrRegionId, comp: WotrLeaderComposer): WotrLeaderElimination { return { type: "leader-elimination", region, ...comp.recruited () }; }
export interface WotrNazgulRecruitment { type: "nazgul-recruitment"; region: WotrRegionId; quantity: number }
export function recruitNazgul (region: WotrRegionId, comp: WotrNazgulComposer): WotrNazgulRecruitment { return { type: "nazgul-recruitment", region, ...comp.recruited () }; }
export interface WotrNazgulElimination { type: "nazgul-elimination"; region: WotrRegionId; quantity: number }
export function eliminateNazgul (region: WotrRegionId, comp: WotrNazgulComposer): WotrNazgulElimination { return { type: "nazgul-elimination", region, ...comp.recruited () }; }

export function regular (nation: WotrNationId, quantity: number = 1) { return new WotrArmyUnitsComposer ("regular", nation, quantity); }
export function elite (nation: WotrNationId, quantity: number = 1) { return new WotrArmyUnitsComposer ("elite", nation, quantity); }
export function leader (nation: WotrNationId, quantity: number = 1) { return new WotrLeaderComposer (nation, quantity); }
export function nazgul (quantity: number = 1) { return new WotrNazgulComposer (quantity); }
export function character (...characters: WotrCharacterId[]) { return new WotrCharacterComposer (characters); }

export interface WotrUnits {
  armyUnits?: WotrArmyUnit[];
  leaders?: WotrLeader[];
  nNazgul?: number;
  characters?: WotrCharacterId[];
}

export interface WotrArmyUnit {
  nation: WotrNationId;
  front: WotrFrontId;
  type: WotrArmyUnitType;
  quantity: number;
}

export interface WotrLeader {
  nation: WotrNationId;
  quantity: number;
}

export function composeUnits (...comp: WotrUnitComposer[]): WotrUnits {
  const a: WotrUnits = { }; comp.forEach (c => c.addTo (a)); return a; }

export interface WotrUnitComposer {
  addTo (a: WotrUnits): void;
}
class WotrArmyUnitsComposer implements WotrUnitComposer {
  constructor (private type: WotrArmyUnitType, private nationId: WotrNationId, private quantity: number) { }
  addTo (a: WotrUnits) { if (!a.armyUnits) { a.armyUnits = []; } a.armyUnits?.push ({ quantity: this.quantity, nation: this.nationId, front: frontOfNation (this.nationId), type: this.type }); }
  recruited () { return { unitType: this.type, quantity: this.quantity, nation: this.nationId }; }
}
class WotrLeaderComposer implements WotrUnitComposer {
  constructor (private nation: WotrNationId, private quantity: number) { }
  addTo (a: WotrUnits) { if (!a.leaders) { a.leaders = []; } a.leaders.push ({ quantity: this.quantity, nation: this.nation }); }
  recruited () { return { quantity: this.quantity, nation: this.nation }; }
}
class WotrNazgulComposer implements WotrUnitComposer {
  constructor (private quantity: number) { }
  addTo (a: WotrUnits) { if (!a.nNazgul) { a.nNazgul = 0; } a.nNazgul += this.quantity; }
  recruited () { return { quantity: this.quantity }; }
}
class WotrCharacterComposer implements WotrUnitComposer {
  constructor (private characters: WotrCharacterId[]) { }
  addTo (a: WotrUnits) { if (!a.characters) { a.characters = []; } this.characters.forEach (m => a.characters!.push (m)); }
}

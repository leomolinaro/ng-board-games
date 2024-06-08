import { WotrCharacterId } from "../companion/wotr-character.models";
import { WotrNationId, frontOfNation } from "../nation/wotr-nation.models";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrArmy } from "./wotr-unit.models";

export type WotrUnitAction =
  WotrArmyMovement | WotrNazgulMovement |
  WotrRegularUnitRecruitment | WotrRegularUnitElimination |
  WotrEliteUnitRecruitment | WotrEliteUnitElimination |
  WotrLeaderRecruitment | WotrLeaderElimination |
  WotrNazgulRecruitment | WotrNazgulElimination;

export interface WotrArmyMovement { type: "army-movement"; fromRegion: WotrRegionId; toRegion: WotrRegionId; army?: WotrArmy }
export function moveArmy (fromRegion: WotrRegionId, toRegion: WotrRegionId, ...comp: WotrUnitComposer[]): WotrArmyMovement { return { type: "army-movement", fromRegion, toRegion, army: composeArmy (comp) }; }
export function composeArmy (comp: WotrUnitComposer[]): WotrArmy {
  const a: Omit<WotrArmy, "front"> = { };
  comp.forEach (c => c.addTo (a));
  const front = a.regulars?.length ? frontOfNation (a.regulars[0].nation) : frontOfNation (a.elites![0].nation);
  return { ...a, front };
}
export function moveAllArmy (fromRegion: WotrRegionId, toRegion: WotrRegionId): WotrArmyMovement { return { type: "army-movement", fromRegion, toRegion }; }
export function regular (nation: WotrNationId, quantity: number = 1) { return new WotrNationUnitComposer ("regulars", nation, quantity); }
export function elite (nation: WotrNationId, quantity: number = 1) { return new WotrNationUnitComposer ("elites", nation, quantity); }
export function leader (nation: WotrNationId, quantity: number = 1) { return new WotrNationUnitComposer ("leaders", nation, quantity); }
export function nazgul (quantity: number = 1) { return new WotrNazgulComposer (quantity); }
export function character (...characters: WotrCharacterId[]) { return new WotrCharacterComposer (characters); }

export interface WotrNazgulMovement { type: "nazgul-movement"; fromRegion: WotrRegionId; toRegion: WotrRegionId; nNazgul: number }
export function moveNazgul (fromRegion: WotrRegionId, toRegion: WotrRegionId, nNazgul: number = 1): WotrNazgulMovement { return { type: "nazgul-movement", fromRegion, toRegion, nNazgul }; }

export interface WotrRegularUnitRecruitment { type: "regular-unit-recruitment"; region: WotrRegionId; quantity: number; nation: WotrNationId }
export function recruitRegularUnit (region: WotrRegionId, nation: WotrNationId, quantity: number = 1): WotrRegularUnitRecruitment { return { type: "regular-unit-recruitment", region, nation, quantity }; }
export interface WotrRegularUnitElimination { type: "regular-unit-elimination"; region: WotrRegionId; quantity: number; nation: WotrNationId }
export function eliminateRegularUnit (region: WotrRegionId, nation: WotrNationId, quantity: number = 1): WotrRegularUnitElimination { return { type: "regular-unit-elimination", region, nation, quantity }; }

export interface WotrEliteUnitRecruitment { type: "elite-unit-recruitment"; region: WotrRegionId; quantity: number; nation: WotrNationId }
export function recruitEliteUnit (region: WotrRegionId, nation: WotrNationId, quantity: number = 1): WotrEliteUnitRecruitment { return { type: "elite-unit-recruitment", region, nation, quantity }; }
export interface WotrEliteUnitElimination { type: "elite-unit-elimination"; region: WotrRegionId; quantity: number; nation: WotrNationId }
export function eliminateEliteUnit (region: WotrRegionId, nation: WotrNationId, quantity: number = 1): WotrEliteUnitElimination { return { type: "elite-unit-elimination", region, nation, quantity }; }

export interface WotrLeaderRecruitment { type: "leader-recruitment"; region: WotrRegionId; quantity: number; nation: WotrNationId }
export function recruitLeader (region: WotrRegionId, nation: WotrNationId, quantity: number = 1): WotrLeaderRecruitment { return { type: "leader-recruitment", region, nation, quantity }; }
export interface WotrLeaderElimination { type: "leader-elimination"; region: WotrRegionId; quantity: number; nation: WotrNationId }
export function eliminateLeader (region: WotrRegionId, nation: WotrNationId, quantity: number = 1): WotrLeaderElimination { return { type: "leader-elimination", region, nation, quantity }; }

export interface WotrNazgulRecruitment { type: "nazgul-recruitment"; region: WotrRegionId; quantity: number }
export function recruitNazgul (region: WotrRegionId, quantity: number = 1): WotrNazgulRecruitment { return { type: "nazgul-recruitment", region, quantity }; }
export interface WotrNazgulElimination { type: "nazgul-elimination"; region: WotrRegionId; quantity: number }
export function eliminateNazgul (region: WotrRegionId, quantity: number = 1): WotrNazgulElimination { return { type: "nazgul-elimination", region, quantity }; }

export interface WotrUnitComposer {
  addTo (a: Omit<WotrArmy, "front">): void;
}
class WotrNationUnitComposer implements WotrUnitComposer {
  constructor (private slotKey: "regulars" | "elites" | "leaders", private nationId: WotrNationId, private quantity: number) { }
  addTo (a: WotrArmy) {
    let slot = a[this.slotKey];
    if (!slot) {
      slot = [];
      a[this.slotKey] = slot;
    }
    slot.push ({ quantity: this.quantity, nation: this.nationId });
  }
}
class WotrNazgulComposer implements WotrUnitComposer {
  constructor (private quantity: number) { }
  addTo (a: WotrArmy) { if (!a.nNazgul) { a.nNazgul = 0; } a.nNazgul += this.quantity; }
}
class WotrCharacterComposer implements WotrUnitComposer {
  constructor (private characters: WotrCharacterId[]) { }
  addTo (a: WotrArmy) { if (!a.characters) { a.characters = []; } this.characters.forEach (m => a.characters!.push (m)); }
}

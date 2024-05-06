import { WotrCompanionId } from "../../wotr-elements/companion/wotr-companion.models";
import { WotrMinionId } from "../../wotr-elements/minion/wotr-minion.models";
import { WotrArmyUnitType, WotrGenericUnitType, WotrNationId } from "../../wotr-elements/nation/wotr-nation.models";
import { WotrRegionId } from "../../wotr-elements/region/wotr-region.models";
import { WotrArmy } from "../../wotr-story.models";

export type WotrArmyAction = WotrArmyMovement | WotrUnitRecruitment | WotrUnitElimination | WotrArmyAttack | WotrArmyRetreatIntoSiege;
export interface WotrArmyMovement { type: "army-movement"; fromRegion: WotrRegionId; toRegion: WotrRegionId; army: WotrArmy }
export function moveArmy (fromRegion: WotrRegionId, toRegion: WotrRegionId, ...comp: WotrUnitComposer[]): WotrArmyMovement { return { type: "army-movement", fromRegion, toRegion, army: army (...comp) }; }
export interface WotrUnitRecruitment { type: "unit-recruitment"; region: WotrRegionId; unitType: WotrGenericUnitType; quantity: number; nation: WotrNationId }
export function recruitUnit (region: WotrRegionId, comp: WotrGenericUnitsComposer): WotrUnitRecruitment { return { type: "unit-recruitment", region, ...comp.recruited () }; }
export interface WotrUnitElimination { type: "unit-elimination"; region: WotrRegionId; unitType: WotrGenericUnitType; quantity: number; nation: WotrNationId }
export function eliminateUnit (region: WotrRegionId, comp: WotrGenericUnitsComposer): WotrUnitElimination { return { type: "unit-elimination", region, ...comp.recruited () }; }
export interface WotrArmyRetreatIntoSiege { type: "army-retreat-into-siege"; region: WotrRegionId }
export function retreatIntoSiege (region: WotrRegionId): WotrArmyRetreatIntoSiege { return { type: "army-retreat-into-siege", region }; }
export interface WotrArmyAttack { type: "army-attack"; fromRegion: WotrRegionId; toRegion: WotrRegionId; army: WotrArmy }
export function attack (fromRegion: WotrRegionId, toRegion: WotrRegionId, ...comp: WotrUnitComposer[]): WotrArmyAttack { return { type: "army-attack", fromRegion, toRegion, army: army (...comp) }; }

function army (...comp: WotrUnitComposer[]): WotrArmy {
  const a: WotrArmy = { units: [] }; comp.forEach (c => c.addTo (a)); return a; }
export function regular (nation: WotrNationId, quantity: number = 1) { return new WotrGenericUnitsComposer ("regular", nation, quantity); }
export function elite (nation: WotrNationId, quantity: number = 1) { return new WotrGenericUnitsComposer ("elite", nation, quantity); }
export function leader (nation: WotrNationId, quantity: number = 1) { return new WotrLeaderComposer (nation, quantity); }
export function nazgul (quantity: number = 1) { return new WotrNazgulComposer (quantity); }
export function companion (...companions: WotrCompanionId[]) { return new WotrCompanionComposer (companions); }
export function minion (...minions: WotrMinionId[]) { return new WotrMinionComposer (minions); }

interface WotrUnitComposer {
  addTo (a: WotrArmy): void;
}
class WotrGenericUnitsComposer implements WotrUnitComposer {
  constructor (private type: WotrArmyUnitType | "leader" | "nazgul", private nationId: WotrNationId, private quantity: number) { }
  addTo (a: WotrArmy) { a.units?.push ({ quantity: this.quantity, nation: this.nationId, type: this.type }); }
  recruited () { return { unitType: this.type, quantity: this.quantity, nation: this.nationId }; }
}
class WotrLeaderComposer extends WotrGenericUnitsComposer { constructor (nation: WotrNationId, quantity: number) { super ("nazgul", nation, quantity); } }
class WotrNazgulComposer extends WotrGenericUnitsComposer { constructor (quantity: number) { super ("nazgul", "sauron", quantity); } }
class WotrCompanionComposer implements WotrUnitComposer {
  constructor (private companions: WotrCompanionId[]) { }
  addTo (a: WotrArmy) { if (!a.companions) { a.companions = []; } this.companions.forEach (m => a.companions!.push (m)); }
}
class WotrMinionComposer implements WotrUnitComposer {
  constructor (private minions: WotrMinionId[]) { }
  addTo (a: WotrArmy) { if (!a.minions) { a.minions = []; } this.minions.forEach (m => a.minions!.push (m)); }
}
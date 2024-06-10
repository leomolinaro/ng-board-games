import { WotrNationId } from "../nation/wotr-nation.models";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrUnitComposer, WotrUnits } from "./wotr-unit.models";

export type WotrUnitAction =
  WotrArmyMovement | WotrNazgulMovement |
  WotrRegularUnitRecruitment | WotrRegularUnitElimination |
  WotrEliteUnitRecruitment | WotrEliteUnitElimination |
  WotrLeaderRecruitment | WotrLeaderElimination |
  WotrNazgulRecruitment | WotrNazgulElimination;

export interface WotrArmyMovement { type: "army-movement"; fromRegion: WotrRegionId; toRegion: WotrRegionId; leftUnits?: WotrUnits }
// eslint-disable-next-line @typescript-eslint/no-shadow
export function moveArmy (fromRegion: WotrRegionId, toRegion: WotrRegionId, leftUnits?: WotrUnits): WotrArmyMovement { return { type: "army-movement", fromRegion, toRegion, leftUnits }; }
export function leftUnits (...comp: WotrUnitComposer[]): WotrUnits { return comp.reduce ((units, u) => u.addTo (units), { }); }

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

import { WotrNationId } from "../nation/wotr-nation-models";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrUnitComposer, WotrUnits } from "./wotr-unit-models";

export type WotrUnitAction =
  | WotrArmyMovements
  | WotrNazgulMovement
  | WotrRegularUnitRecruitment
  | WotrRegularUnitElimination
  | WotrRegulardUnitUpgrade
  | WotrRegularUnitDisband
  | WotrEliteUnitRecruitment
  | WotrEliteUnitElimination
  | WotrEliteUnitDowngrade
  | WotrEliteUnitDisband
  | WotrLeaderRecruitment
  | WotrLeaderElimination
  | WotrNazgulRecruitment
  | WotrNazgulElimination;

export interface WotrArmyMovements {
  type: "army-movements";
  movements: WotrArmyMovement[];
}
export interface WotrArmyMovement {
  fromRegion: WotrRegionId;
  toRegion: WotrRegionId;
  leftUnits?: WotrUnits;
}
export function moveArmies(...movements: WotrArmyMovement[]): WotrArmyMovements {
  return { type: "army-movements", movements };
}
export function armyMovement(
  fromRegion: WotrRegionId,
  toRegion: WotrRegionId,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  leftUnits?: WotrUnits
): WotrArmyMovement {
  const movement: WotrArmyMovement = { fromRegion, toRegion };
  if (leftUnits) {
    movement.leftUnits = leftUnits;
  }
  return movement;
}
export function leftUnits(...comp: WotrUnitComposer[]): WotrUnits {
  return comp.reduce((units, u) => u.addTo(units), {});
}

export interface WotrNazgulMovement {
  type: "nazgul-movement";
  fromRegion: WotrRegionId;
  toRegion: WotrRegionId;
  nNazgul: number;
}
export function moveNazgul(
  fromRegion: WotrRegionId,
  toRegion: WotrRegionId,
  nNazgul: number = 1
): WotrNazgulMovement {
  return { type: "nazgul-movement", fromRegion, toRegion, nNazgul };
}

export interface WotrRegularUnitRecruitment {
  type: "regular-unit-recruitment";
  region: WotrRegionId;
  quantity: number;
  nation: WotrNationId;
}
export function recruitRegularUnit(
  region: WotrRegionId,
  nation: WotrNationId,
  quantity: number = 1
): WotrRegularUnitRecruitment {
  return { type: "regular-unit-recruitment", region, nation, quantity };
}
export interface WotrRegularUnitElimination {
  type: "regular-unit-elimination";
  region: WotrRegionId;
  quantity: number;
  nation: WotrNationId;
}
export function eliminateRegularUnit(
  region: WotrRegionId,
  nation: WotrNationId,
  quantity: number = 1
): WotrRegularUnitElimination {
  return { type: "regular-unit-elimination", region, nation, quantity };
}

export interface WotrRegulardUnitUpgrade {
  type: "regular-unit-upgrade";
  region: WotrRegionId;
  quantity: number;
  nation: WotrNationId;
}
export function upgradeRegularUnit(
  region: WotrRegionId,
  nation: WotrNationId,
  quantity: number = 1
): WotrRegulardUnitUpgrade {
  return { type: "regular-unit-upgrade", region, nation, quantity };
}

export interface WotrRegularUnitDisband {
  type: "regular-unit-disband";
  region: WotrRegionId;
  quantity: number;
  nation: WotrNationId;
}
export function disbandRegularUnit(
  region: WotrRegionId,
  nation: WotrNationId,
  quantity: number = 1
): WotrRegularUnitDisband {
  return { type: "regular-unit-disband", region, nation, quantity };
}

export interface WotrEliteUnitRecruitment {
  type: "elite-unit-recruitment";
  region: WotrRegionId;
  quantity: number;
  nation: WotrNationId;
}
export function recruitEliteUnit(
  region: WotrRegionId,
  nation: WotrNationId,
  quantity: number = 1
): WotrEliteUnitRecruitment {
  return { type: "elite-unit-recruitment", region, nation, quantity };
}

export interface WotrEliteUnitElimination {
  type: "elite-unit-elimination";
  region: WotrRegionId;
  quantity: number;
  nation: WotrNationId;
}
export function eliminateEliteUnit(
  region: WotrRegionId,
  nation: WotrNationId,
  quantity: number = 1
): WotrEliteUnitElimination {
  return { type: "elite-unit-elimination", region, nation, quantity };
}

export interface WotrEliteUnitDowngrade {
  type: "elite-unit-downgrade";
  region: WotrRegionId;
  quantity: number;
  nation: WotrNationId;
}
export function downgradeEliteUnit(
  region: WotrRegionId,
  nation: WotrNationId,
  quantity: number = 1
): WotrEliteUnitDowngrade {
  return { type: "elite-unit-downgrade", region, nation, quantity };
}

export interface WotrEliteUnitDisband {
  type: "elite-unit-disband";
  region: WotrRegionId;
  quantity: number;
  nation: WotrNationId;
}
export function disbandEliteUnit(
  region: WotrRegionId,
  nation: WotrNationId,
  quantity: number = 1
): WotrEliteUnitDisband {
  return { type: "elite-unit-disband", region, nation, quantity };
}

export interface WotrLeaderRecruitment {
  type: "leader-recruitment";
  region: WotrRegionId;
  quantity: number;
  nation: WotrNationId;
}
export function recruitLeader(
  region: WotrRegionId,
  nation: WotrNationId,
  quantity: number = 1
): WotrLeaderRecruitment {
  return { type: "leader-recruitment", region, nation, quantity };
}
export interface WotrLeaderElimination {
  type: "leader-elimination";
  region: WotrRegionId;
  quantity: number;
  nation: WotrNationId;
}
export function eliminateLeader(
  region: WotrRegionId,
  nation: WotrNationId,
  quantity: number = 1
): WotrLeaderElimination {
  return { type: "leader-elimination", region, nation, quantity };
}

export interface WotrNazgulRecruitment {
  type: "nazgul-recruitment";
  region: WotrRegionId;
  quantity: number;
}
export function recruitNazgul(region: WotrRegionId, quantity: number = 1): WotrNazgulRecruitment {
  return { type: "nazgul-recruitment", region, quantity };
}
export interface WotrNazgulElimination {
  type: "nazgul-elimination";
  region: WotrRegionId;
  quantity: number;
}
export function eliminateNazgul(region: WotrRegionId, quantity: number = 1): WotrNazgulElimination {
  return { type: "nazgul-elimination", region, quantity };
}

import { WotrCardId, WotrCardLabel, labelToCardId } from "../card/wotr-card-models";
import { frontOfNation } from "../nation/wotr-nation-models";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrArmy, WotrLeaderUnits, WotrUnitComposer, WotrUnits } from "../unit/wotr-unit-models";
import { WotrCombatDie } from "./wotr-combat-die-models";

export type WotrBattleAction =
  | WotrArmyAttack
  | WotrArmyRetreatIntoSiege
  | WotrArmyNotRetreatIntoSiege
  | WotrArmyRetreat
  | WotrArmyNotRetreat
  | WotrArmyAdvance
  | WotrArmyNotAdvance
  | WotrBattleContinue
  | WotrBattleCease
  | WotrLeaderForfeit
  | WotrCombatCardChoose
  | WotrCombatCardChooseNot
  | WotrCombatRoll
  | WotrCombatReRoll;

export interface WotrArmyAttack {
  type: "army-attack";
  fromRegion: WotrRegionId;
  toRegion: WotrRegionId;
  retroguard?: WotrArmy;
}
export function attack(
  fromRegion: WotrRegionId,
  toRegion: WotrRegionId,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  retroguard?: WotrArmy
): WotrArmyAttack {
  const action: WotrArmyAttack = { type: "army-attack", fromRegion, toRegion };
  if (retroguard) action.retroguard = retroguard;
  return action;
}
export function retroguard(...comp: WotrUnitComposer[]): WotrArmy {
  return composeArmy(comp);
}

function composeArmy(comp: WotrUnitComposer[]): WotrArmy {
  const a: Omit<WotrArmy, "front"> = comp.reduce((units, u) => u.addTo(units), {});
  const front = a.regulars?.length
    ? frontOfNation(a.regulars[0].nation)
    : frontOfNation(a.elites![0].nation);
  return { ...a, front };
}

export interface WotrLeaderForfeit {
  type: "leader-forfeit";
  leaders: WotrLeaderUnits;
}
export function forfeitLeadership(...comp: WotrUnitComposer[]): WotrLeaderForfeit {
  return { type: "leader-forfeit", leaders: composeLeaders(comp) };
}
export interface WotrArmyRetreatIntoSiege {
  type: "army-retreat-into-siege";
  region: WotrRegionId;
}
export function retreatIntoSiege(region: WotrRegionId): WotrArmyRetreatIntoSiege {
  return { type: "army-retreat-into-siege", region };
}
export interface WotrArmyNotRetreatIntoSiege {
  type: "army-not-retreat-into-siege";
  region: WotrRegionId;
}
export function notRetreatIntoSiege(region: WotrRegionId): WotrArmyNotRetreatIntoSiege {
  return { type: "army-not-retreat-into-siege", region };
}
export interface WotrBattleContinue {
  type: "battle-continue";
  region: WotrRegionId;
}
export function continueBattle(region: WotrRegionId): WotrBattleContinue {
  return { type: "battle-continue", region };
}
export interface WotrBattleCease {
  type: "battle-cease";
  region: WotrRegionId;
}
export function ceaseBattle(region: WotrRegionId): WotrBattleCease {
  return { type: "battle-cease", region };
}
export interface WotrArmyRetreat {
  type: "army-retreat";
  toRegion: WotrRegionId;
}
export function retreat(toRegion: WotrRegionId): WotrArmyRetreat {
  return { type: "army-retreat", toRegion };
}
export interface WotrArmyNotRetreat {
  type: "army-not-retreat";
}
export function notRetreat(): WotrArmyNotRetreat {
  return { type: "army-not-retreat" };
}
export interface WotrArmyAdvance {
  type: "army-advance";
  leftUnits?: WotrUnits;
}
export function advanceArmy(leftUnits?: WotrUnits): WotrArmyAdvance {
  const action: WotrArmyAdvance = { type: "army-advance" };
  if (leftUnits) action.leftUnits = leftUnits;
  return action;
}
export interface WotrArmyNotAdvance {
  type: "army-not-advance";
  region: WotrRegionId;
}
export function notAdvanceArmy(region: WotrRegionId): WotrArmyNotAdvance {
  return { type: "army-not-advance", region };
}

export interface WotrCombatCardChoose {
  type: "combat-card-choose";
  card: WotrCardId;
}
export function combatCard(card: WotrCardLabel): WotrCombatCardChoose {
  return { type: "combat-card-choose", card: labelToCardId(card) };
}
export interface WotrCombatCardChooseNot {
  type: "combat-card-choose-not";
}
export function noCombatCard(): WotrCombatCardChooseNot {
  return { type: "combat-card-choose-not" };
}
export interface WotrCombatRoll {
  type: "combat-roll";
  dice: WotrCombatDie[];
}
export function rollCombatDice(...dice: WotrCombatDie[]): WotrCombatRoll {
  return { type: "combat-roll", dice };
}
export interface WotrCombatReRoll {
  type: "combat-re-roll";
  dice: WotrCombatDie[];
}
export function reRollCombatDice(...dice: WotrCombatDie[]): WotrCombatReRoll {
  return { type: "combat-re-roll", dice };
}

export function composeLeaders(comp: WotrUnitComposer[]): WotrLeaderUnits {
  const a: WotrLeaderUnits = {};
  comp.forEach(c => c.addTo(a));
  return a;
}

import { WotrCardId, WotrCardLabel, labelToCardId } from "../card/wotr-card.models";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrUnitComposer, composeArmy } from "../unit/wotr-unit-actions";
import { WotrArmy, WotrLeaderUnits } from "../unit/wotr-unit.models";
import { WotrCombatDie } from "./wotr-combat-die.models";

export type WotrBattleAction =
  WotrArmyAttack |
  WotrArmyRetreatIntoSiege | WotrArmyNotRetreatIntoSiege |
  WotrArmyRetreat | WotrArmyNotRetreat |
  WotrBattleContinue | WotrBattleCease | WotrLeaderForfeit |
  WotrCombatCardChoose | WotrCombatCardChooseNot | WotrCombatRoll | WotrCombatReRoll;

export interface WotrArmyAttack { type: "army-attack"; fromRegion: WotrRegionId; toRegion: WotrRegionId; army: WotrArmy }
export function attack (fromRegion: WotrRegionId, toRegion: WotrRegionId, ...comp: WotrUnitComposer[]): WotrArmyAttack { return { type: "army-attack", fromRegion, toRegion, army: composeArmy (comp) }; }
export interface WotrLeaderForfeit { type: "leader-forfeit"; leaders: WotrLeaderUnits }
export function forfeitLeadership (...comp: WotrUnitComposer[]): WotrLeaderForfeit { return { type: "leader-forfeit", leaders: composeLeaders (comp) }; }
export interface WotrArmyRetreatIntoSiege { type: "army-retreat-into-siege"; region: WotrRegionId }
export function retreatIntoSiege (region: WotrRegionId): WotrArmyRetreatIntoSiege { return { type: "army-retreat-into-siege", region }; }
export interface WotrArmyNotRetreatIntoSiege { type: "army-not-retreat-into-siege"; region: WotrRegionId }
export function notRetreatIntoSiege (region: WotrRegionId): WotrArmyNotRetreatIntoSiege { return { type: "army-not-retreat-into-siege", region }; }
export interface WotrBattleContinue { type: "battle-continue"; region: WotrRegionId }
export function continueBattle (region: WotrRegionId): WotrBattleContinue { return { type: "battle-continue", region }; }
export interface WotrBattleCease { type: "battle-cease"; region: WotrRegionId }
export function ceaseBattle (region: WotrRegionId): WotrBattleCease { return { type: "battle-cease", region }; }
export interface WotrArmyRetreat { type: "army-retreat"; fromRegion: WotrRegionId; toRegion: WotrRegionId }
export function retreat (fromRegion: WotrRegionId, toRegion: WotrRegionId): WotrArmyRetreat { return { type: "army-retreat", fromRegion, toRegion }; }
export interface WotrArmyNotRetreat { type: "army-not-retreat"; region: WotrRegionId }
export function notRetreat (region: WotrRegionId): WotrArmyNotRetreat { return { type: "army-not-retreat", region }; }

export interface WotrCombatCardChoose { type: "combat-card-choose"; card: WotrCardId }
export function combatCard (card: WotrCardLabel): WotrCombatCardChoose { return { type: "combat-card-choose", card: labelToCardId (card) }; }
export interface WotrCombatCardChooseNot { type: "combat-card-choose-not" }
export function noCombatCard (): WotrCombatCardChooseNot { return { type: "combat-card-choose-not" }; }
export interface WotrCombatRoll { type: "combat-roll"; dice: WotrCombatDie[] }
export function rollCombatDice (...dice: WotrCombatDie[]): WotrCombatRoll { return { type: "combat-roll", dice }; }
export interface WotrCombatReRoll { type: "combat-re-roll"; dice: WotrCombatDie[] }
export function reRollCombatDice (...dice: WotrCombatDie[]): WotrCombatReRoll { return { type: "combat-re-roll", dice }; }

export function composeLeaders (comp: WotrUnitComposer[]): WotrLeaderUnits {
  const a: WotrLeaderUnits = { };
  comp.forEach (c => c.addTo (a));
  return a;
}

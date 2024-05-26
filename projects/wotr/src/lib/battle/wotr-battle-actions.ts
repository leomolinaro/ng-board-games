import { WotrCardId, WotrCardLabel, labelToCardId } from "../card/wotr-card.models";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrUnitComposer, WotrUnits, composeUnits } from "../unit/wotr-unit-actions";
import { WotrCombatDie } from "./wotr-combat-die.models";

export type WotrBattleAction =
  WotrArmyAttack |
  WotrArmyRetreatIntoSiege | WotrArmyNotRetreatIntoSiege |
  WotrAttackContinue | WotrAttackCease | WotrLeaderForfeit |
  WotrCombatCardChoose | WotrCombatCardChooseNot | WotrCombatRoll | WotrCombatReRoll;

export interface WotrArmyAttack { type: "army-attack"; fromRegion: WotrRegionId; toRegion: WotrRegionId; army: WotrUnits }
export function attack (fromRegion: WotrRegionId, toRegion: WotrRegionId, ...comp: WotrUnitComposer[]): WotrArmyAttack { return { type: "army-attack", fromRegion, toRegion, army: composeUnits (...comp) }; }
export interface WotrLeaderForfeit { type: "leader-forfeit"; leaders: WotrUnits }
export function forfeitLeadership (...comp: WotrUnitComposer[]): WotrLeaderForfeit { return { type: "leader-forfeit", leaders: composeUnits (...comp) }; }
export interface WotrArmyRetreatIntoSiege { type: "army-retreat-into-siege"; region: WotrRegionId }
export function retreatIntoSiege (region: WotrRegionId): WotrArmyRetreatIntoSiege { return { type: "army-retreat-into-siege", region }; }
export interface WotrArmyNotRetreatIntoSiege { type: "army-not-retreat-into-siege"; region: WotrRegionId }
export function notRetreatIntoSiege (region: WotrRegionId): WotrArmyNotRetreatIntoSiege { return { type: "army-not-retreat-into-siege", region }; }
export interface WotrAttackContinue { type: "attack-continue"; region: WotrRegionId }
export function continueAttack (region: WotrRegionId): WotrAttackContinue { return { type: "attack-continue", region }; }
export interface WotrAttackCease { type: "attack-cease"; region: WotrRegionId }
export function ceaseAttack (region: WotrRegionId): WotrAttackCease { return { type: "attack-cease", region }; }

export interface WotrCombatCardChoose { type: "combat-card-choose"; card: WotrCardId }
export function combatCard (card: WotrCardLabel): WotrCombatCardChoose { return { type: "combat-card-choose", card: labelToCardId (card) }; }
export interface WotrCombatCardChooseNot { type: "combat-card-choose-not" }
export function noCombatCard (): WotrCombatCardChooseNot { return { type: "combat-card-choose-not" }; }
export interface WotrCombatRoll { type: "combat-roll"; dice: WotrCombatDie[] }
export function rollCombatDice (...dice: WotrCombatDie[]): WotrCombatRoll { return { type: "combat-roll", dice }; }
export interface WotrCombatReRoll { type: "combat-re-roll"; dice: WotrCombatDie[] }
export function reRollCombatDice (...dice: WotrCombatDie[]): WotrCombatReRoll { return { type: "combat-re-roll", dice }; }
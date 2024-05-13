import { WotrCardId, WotrCardLabel, labelToCardId } from "../card/wotr-card.models";
import { WotrCombatDie } from "./wotr-combat-die.models";

export type WotrCombatAction = WotrCombatCardChoose | WotrCombatCardChooseNot | WotrCombatRoll;
export interface WotrCombatCardChoose { type: "combat-card-choose"; card: WotrCardId }
export function combatCard (card: WotrCardLabel): WotrCombatCardChoose { return { type: "combat-card-choose", card: labelToCardId (card) }; }
export interface WotrCombatCardChooseNot { type: "combat-card-choose-not" }
export function noCombatCard (): WotrCombatCardChooseNot { return { type: "combat-card-choose-not" }; }
export interface WotrCombatRoll { type: "combat-roll"; dice: WotrCombatDie[] }
export function rollCombatDice (...dice: WotrCombatDie[]): WotrCombatRoll { return { type: "combat-roll", dice }; }

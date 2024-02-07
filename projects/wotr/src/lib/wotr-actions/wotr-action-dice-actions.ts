import { WotrActionDie } from "../wotr-elements/wotr-dice.models";
import { WotrFrontId } from "../wotr-elements/wotr-front.models";

export type WotrActionDiceAction = WotrActionRoll | WotrActionPass | WotrActionDiceDiscard;
export interface WotrActionRoll { type: "action-roll"; dice: WotrActionDie[] }
export function rollActionDice (dice: WotrActionDie[]): WotrActionRoll { return { type: "action-roll", dice }; }
export interface WotrActionPass { type: "action-pass" }
export function passAction (): WotrActionPass { return { type: "action-pass" }; }
export interface WotrActionDiceDiscard { type: "action-dice-discard"; front: WotrFrontId; dice: WotrActionDie[] }
export function discardDice (front: WotrFrontId, ...dice: WotrActionDie[]): WotrActionDiceDiscard { return { type: "action-dice-discard", front, dice }; }

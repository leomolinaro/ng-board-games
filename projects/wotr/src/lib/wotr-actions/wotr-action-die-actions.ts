import { WotrActionDie } from "../wotr-elements/wotr-dice.models";
import { WotrFrontId } from "../wotr-elements/wotr-front.models";

export type WotrActionDieAction = WotrActionRoll | WotrActionDiceDiscard | WotrActionSkip;
export interface WotrActionRoll { type: "action-roll"; dice: WotrActionDie[] }
export function rollActionDice (dice: WotrActionDie[]): WotrActionRoll { return { type: "action-roll", dice }; }
export interface WotrActionDiceDiscard { type: "action-dice-discard"; front: WotrFrontId; dice: WotrActionDie[] }
export function discardDice (front: WotrFrontId, ...dice: WotrActionDie[]): WotrActionDiceDiscard { return { type: "action-dice-discard", front, dice }; }
export interface WotrActionSkip { type: "action-die-skip"; die: WotrActionDie }
export function skipActionDie (die: WotrActionDie): WotrActionSkip { return { type: "action-die-skip", die }; }
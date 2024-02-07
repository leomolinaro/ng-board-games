import { WotrCompanionId } from "../wotr-elements/wotr-companion.models";
import { WotrRegionId } from "../wotr-elements/wotr-region.models";

export interface WotrFellowshipDeclare { type: "fellowship-declare"; region: WotrRegionId }
export function declareFellowship (region: WotrRegionId): WotrFellowshipDeclare { return { type: "fellowship-declare", region }; }
export interface WotrFellowshipDeclareNot { type: "fellowship-declare-not" }
export function notDeclareFellowship (): WotrFellowshipDeclareNot { return { type: "fellowship-declare-not" }; }
export interface WotrFellowhipProgress { type: "fellowship-progress" }
export function moveFelloswhip (): WotrFellowhipProgress { return { type: "fellowship-progress" }; }
export interface WotrFellowhipCorruption { type: "fellowship-corruption"; quantity: number }
export function corruptFelloswhip (quantity: number): WotrFellowhipCorruption { return { type: "fellowship-corruption", quantity }; }
export interface WotrFellowhipHeal { type: "fellowship-heal"; quantity: number }
export function healFellowship (quantity: number): WotrFellowhipHeal { return { type: "fellowship-heal", quantity }; }
export interface WotrFellowhipHide { type: "fellowship-hide" }
export function hideFellowship (): WotrFellowhipHide { return { type: "fellowship-hide" }; }
export interface WotrFellowhipReveal { type: "fellowship-reveal"; region: WotrRegionId }
export function revealFellowship (region: WotrRegionId): WotrFellowhipReveal { return { type: "fellowship-reveal", region }; }
export interface WotrFellowshipGuide { type: "fellowship-guide"; companion: WotrCompanionId }
export function changeGuide (companion: WotrCompanionId): WotrFellowshipGuide { return { type: "fellowship-guide", companion }; }


export type WotrFellowshipAction = WotrFellowshipDeclare | WotrFellowshipDeclareNot | WotrFellowhipProgress | WotrFellowhipCorruption | WotrFellowhipHide | WotrFellowhipReveal | WotrFellowshipGuide;

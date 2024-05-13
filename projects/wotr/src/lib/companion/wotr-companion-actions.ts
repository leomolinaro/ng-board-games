import { WotrRegionId } from "../region/wotr-region.models";
import { WotrCompanionId } from "./wotr-companion.models";

export type WotrCompanionAction = WotrCompanionSeparation | WotrCompanionMovement | WotrCompanionRandom | WotrCompanionElimination | WotrCompanionPlay;
export interface WotrCompanionSeparation { type: "companion-separation"; companions: WotrCompanionId[]; toRegion: WotrRegionId }
export function separateCompanions (toRegion: WotrRegionId, ...companions: WotrCompanionId[]): WotrCompanionSeparation { return { type: "companion-separation", companions, toRegion }; }
export interface WotrCompanionMovement { type: "companion-movement"; companions: WotrCompanionId[]; fromRegion: WotrRegionId; toRegion: WotrRegionId }
export function moveCompanions (fromRegion: WotrRegionId, toRegion: WotrRegionId, ...companions: WotrCompanionId[]): WotrCompanionMovement { return { type: "companion-movement", companions, fromRegion, toRegion }; }
export interface WotrCompanionRandom { type: "companion-random"; companions: WotrCompanionId[] }
export function chooseRandomCompanion (...companions: WotrCompanionId[]): WotrCompanionRandom { return { type: "companion-random", companions }; }
export interface WotrCompanionElimination { type: "companion-elimination"; companions: WotrCompanionId[] }
export function eliminateCompanion (...companions: WotrCompanionId[]): WotrCompanionElimination { return { type: "companion-elimination", companions }; }
export interface WotrCompanionPlay { type: "companion-play"; companions: WotrCompanionId[]; region: WotrRegionId }
export function playCompanion (region: WotrRegionId, ...companions: WotrCompanionId[]): WotrCompanionPlay { return { type: "companion-play", region, companions }; }

import { WotrMinionId } from "../wotr-elements/wotr-minion.models";
import { WotrRegionId } from "../wotr-elements/wotr-region.models";

export type WotrMinionAction = WotrMinionMovement | WotrMinionElimination | WotrNazgulMovement | WotrMinionPlay;
export interface WotrMinionMovement { type: "minion-movement"; minions: WotrMinionId[]; fromRegion: WotrRegionId, toRegion: WotrRegionId }
export function moveMinions (fromRegion: WotrRegionId, toRegion: WotrRegionId, ...minions: WotrMinionId[]): WotrMinionMovement { return { type: "minion-movement", minions, fromRegion, toRegion }; }
export interface WotrMinionElimination { type: "minion-elimination"; minions: WotrMinionId[] }
export function eliminateMinion (...minions: WotrMinionId[]): WotrMinionElimination { return { type: "minion-elimination", minions }; }
export interface WotrNazgulMovement { type: "nazgul-movement"; fromRegion: WotrRegionId; toRegion: WotrRegionId; nNazgul: number }
export function moveNazgul (fromRegion: WotrRegionId, toRegion: WotrRegionId, nNazgul: number = 1): WotrNazgulMovement { return { type: "nazgul-movement", fromRegion, toRegion, nNazgul }; }
export interface WotrMinionPlay { type: "minion-play"; minions: WotrMinionId[]; region: WotrRegionId }
export function playMinion (region: WotrRegionId, ...minions: WotrMinionId[]): WotrMinionPlay { return { type: "minion-play", region, minions }; }

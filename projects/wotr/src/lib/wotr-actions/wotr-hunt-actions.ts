import { WotrCombatDie } from "../wotr-elements/wotr-dice.models";
import { WotrHuntTile } from "../wotr-elements/wotr-hunt.models";

export type WotrHuntAction = WotrHuntAllocation | WotrHuntRoll | WotrHuntTileDraw | WotrHuntTileAdd;
export interface WotrHuntAllocation { type: "hunt-allocation"; quantity: number }
export function allocateHuntDice (quantity: number): WotrHuntAllocation { return { type: "hunt-allocation", quantity }; }
export interface WotrHuntRoll { type: "hunt-roll"; dice: WotrCombatDie[] }
export function rollHuntDice (...dice: WotrCombatDie[]): WotrHuntRoll { return { type: "hunt-roll", dice }; }
export interface WotrHuntTileDraw { type: "hunt-tile-draw"; tile: WotrHuntTile }
export function drawHuntTile (tile: WotrHuntTile): WotrHuntTileDraw { return { type: "hunt-tile-draw", tile }; }
export interface WotrHuntTileAdd { type: "hunt-tile-add"; tile: WotrHuntTile }
export function addHuntTile (tile: WotrHuntTile): WotrHuntTileAdd { return { type: "hunt-tile-add", tile }; }
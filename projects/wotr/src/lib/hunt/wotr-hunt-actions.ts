import { WotrCombatDie } from "../battle/wotr-combat-die.models";
import { WotrHuntTileId } from "./wotr-hunt.models";

export type WotrHuntAction = WotrHuntAllocation | WotrHuntRoll | WotrHuntTileDraw | WotrHuntTileAdd;
export interface WotrHuntAllocation { type: "hunt-allocation"; quantity: number }
export function allocateHuntDice (quantity: number): WotrHuntAllocation { return { type: "hunt-allocation", quantity }; }
export interface WotrHuntRoll { type: "hunt-roll"; dice: WotrCombatDie[] }
export function rollHuntDice (...dice: WotrCombatDie[]): WotrHuntRoll { return { type: "hunt-roll", dice }; }
export interface WotrHuntTileDraw { type: "hunt-tile-draw"; tile: WotrHuntTileId }
export function drawHuntTile (tile: WotrHuntTileId): WotrHuntTileDraw { return { type: "hunt-tile-draw", tile }; }
export interface WotrHuntTileAdd { type: "hunt-tile-add"; tile: WotrHuntTileId }
export function addHuntTile (tile: WotrHuntTileId): WotrHuntTileAdd { return { type: "hunt-tile-add", tile }; }
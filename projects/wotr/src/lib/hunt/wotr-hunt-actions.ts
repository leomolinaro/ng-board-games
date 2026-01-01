import { WotrActionDie } from "../action-die/wotr-action-die-models";
import { WotrCombatDie } from "../battle/wotr-combat-die-models";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrHuntTileId } from "./wotr-hunt-models";

export type WotrHuntAction =
  | WotrHuntAllocation
  | WotrHuntRoll
  | WotrHuntReRoll
  | WotrHuntTileDraw
  | WotrHuntTileAdd
  | WotrHuntTileReturn
  | WotrHuntShelobsLairRoll
  | WotrHuntLidlessEyeDieChange;

export interface WotrHuntAllocation {
  type: "hunt-allocation";
  quantity: number;
}
export function allocateHuntDice(quantity: number): WotrHuntAllocation {
  return { type: "hunt-allocation", quantity };
}

export interface WotrHuntLidlessEyeDieChange {
  type: "hunt-lidless-eye-die-change";
  dice: WotrActionDie[];
}
export function lidlessEye(...dice: WotrActionDie[]): WotrHuntLidlessEyeDieChange {
  return { type: "hunt-lidless-eye-die-change", dice };
}

export interface WotrHuntRoll {
  type: "hunt-roll";
  dice: WotrCombatDie[];
}
export function rollHuntDice(...dice: WotrCombatDie[]): WotrHuntRoll {
  return { type: "hunt-roll", dice };
}
export interface WotrHuntReRoll {
  type: "hunt-re-roll";
  dice: WotrCombatDie[];
}
export function reRollHuntDice(...dice: WotrCombatDie[]): WotrHuntReRoll {
  return { type: "hunt-re-roll", dice };
}

export interface WotrHuntShelobsLairRoll {
  type: "hunt-shelobs-lair-roll";
  die: WotrCombatDie;
}
export function rollShelobsLairDie(die: WotrCombatDie): WotrHuntShelobsLairRoll {
  return { type: "hunt-shelobs-lair-roll", die };
}

export interface WotrHuntTileDraw {
  type: "hunt-tile-draw";
  tile: WotrHuntTileId;
  tiles?: WotrHuntTileId[];
}
export function drawHuntTile(tile: WotrHuntTileId, tiles?: WotrHuntTileId[]): WotrHuntTileDraw {
  const action: WotrHuntTileDraw = { type: "hunt-tile-draw", tile };
  if (tiles) action.tiles = tiles;
  return action;
}

export interface WotrHuntTileAdd {
  type: "hunt-tile-add";
  tile: WotrHuntTileId;
}
export function addHuntTile(tile: WotrHuntTileId): WotrHuntTileAdd {
  return { type: "hunt-tile-add", tile };
}

export interface WotrHuntTileReturn {
  type: "hunt-tile-return";
  tile: WotrHuntTileId;
}
export function returnHuntTile(tile: WotrHuntTileId): WotrHuntTileReturn {
  return { type: "hunt-tile-return", tile };
}

export interface WotrHuntEffect {
  type: "hunt-effect";
  actions: WotrAction[];
}

import { BaronyAction, BaronyLandTile, BaronyPlayer } from "../models";
import { BaronyContext } from "./barony-context";

export function getAvailableLandTilesForSetupPlacement (context: BaronyContext): BaronyLandTile[] {
  const availableLandTiles = context.getFilteredLandTiles (lt => {
    if (lt.type === "lake") { return false; }
    if (lt.type === "forest") { return false; }
    if (lt.pawns.length) { return false; }
    const nearbyLandTiles = context.getNearbyLandTiles (lt.coordinates);
    if (nearbyLandTiles.some (nlt => nlt.pawns.length)) { return false; }
    return true;
  });
  return availableLandTiles;
} // getAvailableLandTilesForSetupPlacement

export function getAvailableLandTileForRecruitment (turnPlayer: BaronyPlayer, context: BaronyContext): BaronyLandTile[] {
  const availableLandTiles = context.getFilteredLandTiles (lt => {
    return lt.pawns.some (p => p.type === "city" && p.color === turnPlayer.color);
  });
  return availableLandTiles;
} // getAvailableLandTileForRecruitment

export function getAvailableActions (turnPlayer: BaronyPlayer, context: BaronyContext): BaronyAction[] {
  const availableActions: BaronyAction[] = [];
  if (isRecruitmentAvailable (turnPlayer, context)) { availableActions.push ("recruitment"); }
  if (isMovementAvailable (turnPlayer, context)) { availableActions.push ("movement"); }
  if (isConstructionAvailable (turnPlayer, context)) { availableActions.push ("construction"); }
  if (isNewCityAvailable (turnPlayer, context)) { availableActions.push ("newCity"); }
  if (isExpeditionAvailable (turnPlayer, context)) { availableActions.push ("expedition"); }
  if (isNobleTitleAvailable (turnPlayer, context)) { availableActions.push ("nobleTitle"); }
  return availableActions;
} // getAvailableActions

export function isRecruitmentAvailable (turnPlayer: BaronyPlayer, context: BaronyContext): boolean {
  if (!turnPlayer.pawns.knight) { return false; }
  const availableLandTiles = context.getFilteredLandTiles (lt => lt.pawns.some (p => p.color === turnPlayer.color && p.type === "city"));
  if (!availableLandTiles.length) { return false; }
  return true;
} // isRecruitmentAvailable

export function isMovementAvailable (turnPlayer: BaronyPlayer, context: BaronyContext): boolean {
  return false;
} // isMovementAvailable

export function isConstructionAvailable (turnPlayer: BaronyPlayer, context: BaronyContext): boolean {
  return false;
} // isConstructionAvailable

export function isNewCityAvailable (turnPlayer: BaronyPlayer, context: BaronyContext): boolean {
  return false;
} // isNewCityAvailable

export function isExpeditionAvailable (turnPlayer: BaronyPlayer, context: BaronyContext): boolean {
  return false;
} // isExpeditionAvailable

export function isNobleTitleAvailable (turnPlayer: BaronyPlayer, context: BaronyContext): boolean {
  return false;
} // isNobleTitleAvailable

export function getMaxKnightForRecruitment (landTile: BaronyLandTile, turnPlayer: BaronyPlayer, context: BaronyContext): number {
  const playerKnights = turnPlayer.pawns.knight;
  if (isLandTileAdiacentToLake (landTile, context)) {
    return Math.min (playerKnights, 3);
  } else {
    return Math.min (playerKnights, 2);
  } // if - else
} // getMaxKnightForRecruitment

export function isLandTileAdiacentToLake (landTile: BaronyLandTile, context: BaronyContext): boolean {
  const c = landTile.coordinates;
  const offsets = [
    { x: 0, y: -1, z: 1 },
    { x: 1, y: -1, z: 0 },
    { x: 1, y: 0, z: -1 },
    { x: 0, y: 1, z: -1 },
    { x: -1, y: 1, z: 0 },
    { x: -1, y: 0, z: 1 }
  ];
  return offsets.some (o => {
    const adiacentC = { x: c.x + o.x, y: c.y + o.y, z: c.z + o.z };
    const adiacentLandTile = context.getLandTileByCoordinates (adiacentC);
    if (adiacentLandTile) {
      return adiacentLandTile.type === "lake";
    } else {
      return false;
    } // if - else
  });
} // isLandTileNearLake

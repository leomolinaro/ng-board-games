import { BaronyAction, BaronyColor, baronyColors, BaronyLandTile, BaronyPawnType, BaronyPlayer } from "../models";
import { BaronyMovement } from "../process";
import { BaronyContext } from "./barony-context";

export function getValidActions (player: BaronyPlayer, context: BaronyContext): BaronyAction[] {
  const validActions: BaronyAction[] = [];
  if (isRecruitmentValid (player, context)) { validActions.push ("recruitment"); }
  if (isMovementValid (player, context)) { validActions.push ("movement"); }
  if (isConstructionValid (player, context)) { validActions.push ("construction"); }
  if (isNewCityValid (player, context)) { validActions.push ("newCity"); }
  if (isExpeditionValid (player, context)) { validActions.push ("expedition"); }
  if (isNobleTitleValid (player, context)) { validActions.push ("nobleTitle"); }
  return validActions;
} // getValidActions

export function getValidLandTilesForSetupPlacement (context: BaronyContext): BaronyLandTile[] {
  const validLandTiles = context.getLandTiles ().filter (lt => {
    if (lt.type === "lake") { return false; }
    if (lt.type === "forest") { return false; }
    if (lt.pawns.length) { return false; }
    const nearbyLandTiles = context.getNearbyLandTiles (lt.coordinates);
    if (nearbyLandTiles.some (nlt => nlt.pawns.length)) { return false; }
    return true;
  });
  return validLandTiles;
} // getValidLandTilesForSetupPlacement

export function getValidLandTilesForRecruitment (player: BaronyPlayer, context: BaronyContext): BaronyLandTile[] {
  const validLandTiles = context.getLandTiles ().filter (lt => {
    return lt.pawns.some (p => p.type === "city" && p.color === player.color);
  });
  return validLandTiles;
} // getValidLandTileForRecruitment

export function getValidSourceLandTilesForFirstMovement (player: BaronyPlayer, context: BaronyContext): BaronyLandTile[] {
  return context.getLandTiles ().filter (lt => isValidFirstMovementSource (lt, player, context));
} // getValidSourceLandTilesForFirstMovement

export function getValidSourceLandTilesForSecondMovement (player: BaronyPlayer, firstMovement: BaronyMovement, context: BaronyContext): BaronyLandTile[] {
  return context.getLandTiles ().filter (lt => isValidSecondMovementSource (lt, player, firstMovement, context));
} // getValidSourceLandTilesForSecondMovement

export function getValidTargetLandTilesForFirstMovement (movementSource: BaronyLandTile, player: BaronyPlayer, context: BaronyContext): BaronyLandTile[] {
  return context.getNearbyLandTiles (movementSource.coordinates).filter (lt => isValidMovementTarget (lt, player));
} // getValidTargetLandTilesForFirstMovement

export function getMaxKnightForRecruitment (landTile: BaronyLandTile, player: BaronyPlayer, context: BaronyContext): number {
  const playerKnights = player.pawns.knight;
  if (isLandTileAdiacentToLake (landTile, context)) {
    return Math.min (playerKnights, 3);
  } else {
    return Math.min (playerKnights, 2);
  } // if - else
} // getMaxKnightForRecruitment

export function isRecruitmentValid (player: BaronyPlayer, context: BaronyContext): boolean {
  if (!player.pawns.knight) { return false; }
  const hasValidLandTiles = context.getLandTiles ().some (lt => lt.pawns.some (p => p.color === player.color && p.type === "city"));
  return hasValidLandTiles;
} // isRecruitmentValid

export function isMovementValid (player: BaronyPlayer, context: BaronyContext): boolean {
  return context.getLandTiles ().some (lt => isValidFirstMovementSource (lt, player, context));
} // isMovementValid

export function isSecondMovementValid (player: BaronyPlayer, firstMovement: BaronyMovement, context: BaronyContext): boolean {
  return context.getLandTiles ().some (lt => isValidSecondMovementSource (lt, player, firstMovement, context));
} // isSecondMovementValid

function isValidSecondMovementSource (landTile: BaronyLandTile, player: BaronyPlayer, firstMovement: BaronyMovement, context: BaronyContext) {
  return (
    (landTile.coordinates !== firstMovement.fromLandTileCoordinates && hasOneOrMoreOwnKnight (landTile, player)) ||
    (landTile.coordinates === firstMovement.fromLandTileCoordinates && hasTwoOrMoreOwnKigths (landTile, player))
  ) &&
  context.getNearbyLandTiles (landTile.coordinates).some (nlt => isValidMovementTarget (nlt, player));
} // isValidSecondMovementSource

function isValidFirstMovementSource (landTile: BaronyLandTile, player: BaronyPlayer, context: BaronyContext) {
  return hasOneOrMoreOwnKnight (landTile, player) &&
  context.getNearbyLandTiles (landTile.coordinates).some (nlt => isValidMovementTarget (nlt, player));
} // isValidFirstMovementSource

function isValidMovementTarget (landTile: BaronyLandTile, player: BaronyPlayer) {
  return landTile.type !== "lake" &&
  !landTile.pawns.some (p => p.color !== player.color && (p.type === "city" || p.type === "stronghold")) &&
  !hasTwoOrMorePawnsOfSameOpponent (landTile, player) &&
  !(landTile.type === "mountain" && hasOneOrMoreOppoentKnight (landTile, player))
} // isValidMovementTarget

export function isConstructionValid (player: BaronyPlayer, context: BaronyContext): boolean {
  return false;
} // isConstructionValid

export function isNewCityValid (player: BaronyPlayer, context: BaronyContext): boolean {
  return false;
} // isNewCityValid

export function isExpeditionValid (player: BaronyPlayer, context: BaronyContext): boolean {
  return false;
} // isExpeditionValid

export function isNobleTitleValid (player: BaronyPlayer, context: BaronyContext): boolean {
  return false;
} // isNobleTitleValid

export function isDestroyingOpponentVillage (movementTarget: BaronyLandTile, player: BaronyPlayer): boolean {
  return movementTarget.pawns.some (p => p.type === "village" && p.color !== player.color);
} // isDestroyingOpponentVillage

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

function hasOneOrMoreOppoentKnight (landTile: BaronyLandTile, player: BaronyPlayer) {
  return hasPawnsByColor (landTile, nPawns => nPawns >= 1, null, c => c !== player.color);
} // hasOneOrMoreOppoentKnight

function hasOneOrMoreOwnKnight (landTile: BaronyLandTile, player: BaronyPlayer) {
  return hasPawnsByColor (landTile, nPawns => nPawns >= 1, p => p === "knight", c => c === player.color);
} // hasOneOwnKnight

function hasTwoOrMoreOwnKigths (landTile: BaronyLandTile, player: BaronyPlayer) {
  return hasPawnsByColor (landTile, nPawns => nPawns >= 2, p => p === "knight", c => c === player.color);
} // hasTwoOwnKigths

function hasTwoOrMorePawnsOfSameOpponent (landTile: BaronyLandTile, player: BaronyPlayer) {
  return hasPawnsByColor (landTile, nPawns => nPawns >= 2, null, c => c !== player.color);
} // hasTwoPawnsOfSameOpponent

function hasPawnsByColor (landTile: BaronyLandTile, some: (nPawns: number) => boolean, pawnFilter?: ((p: BaronyPawnType) => boolean) | null, colorFilter?: ((c: BaronyColor) => boolean) | null) {
  const pawns: Record<BaronyColor, number> = {
    yellow: 0, red: 0, green: 0, blue: 0
  };
  const filteredPawns = pawnFilter ? landTile.pawns.filter (p => pawnFilter (p.type)) : landTile.pawns;
  filteredPawns.forEach (p => pawns[p.color] += 1);
  const filteredColors = colorFilter ? baronyColors.filter (c => colorFilter (c)) : baronyColors;
  return filteredColors.some (c => some (pawns[c]));
} // hasPawns

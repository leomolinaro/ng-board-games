import { BaronyAction, BaronyColor, baronyColors, BaronyLand, BaronyLandCoordinates, BaronyPawn, BaronyPawnType, BaronyPlayer, BaronyResourceType, baronyResourceTypes } from "../models";
import { BaronyMovement } from "../models";
import { BaronyPlay } from "../process";
import { BaronyContext } from "./barony-context";

export function getValidActions (player: string, context: BaronyContext): BaronyAction[] {
  const validActions: BaronyAction[] = [];
  if (isRecruitmentValid (player, context)) { validActions.push ("recruitment"); }
  if (isMovementValid (player, context)) { validActions.push ("movement"); }
  if (isConstructionValid (player, context)) { validActions.push ("construction"); }
  if (isNewCityValid (player, context)) { validActions.push ("newCity"); }
  if (isExpeditionValid (player, context)) { validActions.push ("expedition"); }
  if (isNobleTitleValid (player, context)) { validActions.push ("nobleTitle"); }
  return validActions;
} // getValidActions

export function getValidLandsForSetupPlacement (context: BaronyContext): BaronyLand[] {
  const validLandTiles = context.getLands ().filter (lt => {
    if (lt.type === "lake") { return false; }
    if (lt.type === "forest") { return false; }
    if (lt.pawns.length) { return false; }
    const nearbyLandTiles = getNearbyLands (lt.coordinates, context);
    if (nearbyLandTiles.some (nlt => nlt.pawns.length)) { return false; }
    return true;
  });
  return validLandTiles;
} // getValidLandsForSetupPlacement

function getNearbyLands (land: BaronyLandCoordinates, context: BaronyContext): BaronyLand[] {
  const x = land.x;
  const y = land.y;
  const z = land.z;
  const toReturn: BaronyLand[] = [];
  let lt;
  lt = context.getLandOrNull ({ x: x + 1, y: y - 1, z }); if (lt) { toReturn.push (lt); }
  lt = context.getLandOrNull ({ x: x - 1, y: y + 1, z }); if (lt) { toReturn.push (lt); }
  lt = context.getLandOrNull ({ x: x, y: y + 1 , z: z - 1 }); if (lt) { toReturn.push (lt); }
  lt = context.getLandOrNull ({ x: x, y: y - 1, z: z + 1 }); if (lt) { toReturn.push (lt); }
  lt = context.getLandOrNull ({ x: x - 1, y, z: z + 1 }); if (lt) { toReturn.push (lt); }
  lt = context.getLandOrNull ({ x: x + 1, y, z: z - 1 }); if (lt) { toReturn.push (lt); }
  return toReturn;
} // getNearbyLands

export function getValidLandsForRecruitment (playerId: string, context: BaronyContext): BaronyLand[] {
  const player = context.getPlayer (playerId);
  const validLandTiles = context.getLands ().filter (lt => {
    return lt.pawns.some (p => p.type === "city" && p.color === player.color);
  });
  return validLandTiles;
} // getValidLandsForRecruitment

export function getValidSourceLandsForFirstMovement (player: string, context: BaronyContext): BaronyLand[] {
  return context.getLands ().filter (land => isValidFirstMovementSource (land, player, context));
} // getValidSourceLandsForFirstMovement

export function getValidSourceLandsForSecondMovement (player: string, firstMovement: BaronyMovement, context: BaronyContext): BaronyLand[] {
  return context.getLands ().filter (land => isValidSecondMovementSource (land, player, firstMovement, context));
} // getValidSourceLandsForSecondMovement

export function getValidTargetLandsForMovement (movementSource: BaronyLandCoordinates, player: string, context: BaronyContext): BaronyLand[] {
  return getNearbyLands (movementSource, context).filter (lt => isValidMovementTarget (lt, player, context));
} // getValidTargetLandsForMovement

export function getValidLandsForConstruction (player: string, context: BaronyContext) {
  return context.getLands ().filter (lt => isValidLandTileForConstruction (lt, player, context));
} // getValidLandTilesForConstruction

export function getValidBuildingsForConstruction (playerId: string, context: BaronyContext): ("stronghold" | "village")[] {
  const player = context.getPlayer (playerId);
  const toReturn: ("stronghold" | "village")[] = [];
  if (player.pawns.stronghold > 0) { toReturn.push ("stronghold"); }
  if (player.pawns.village > 0) { toReturn.push ("village"); }
  return toReturn;
} // getValidBuildingsForConstruction

export function getMaxKnightForRecruitment (land: BaronyLandCoordinates, playerId: string, context: BaronyContext): number {
  const player = context.getPlayer (playerId);
  const playerKnights = player.pawns.knight;
  if (isLandTileAdiacentToLake (land, context)) {
    return Math.min (playerKnights, 3);
  } else {
    return Math.min (playerKnights, 2);
  } // if - else
} // getMaxKnightForRecruitment

export function getValidLandsForNewCity (player: string, context: BaronyContext): BaronyLand[] {
  return context.getLands ().filter (land => isValidLandForNewCity (land.coordinates, player, context));
} // getValidLandsForNewCity

export function getValidLandsForExpedition (player: string, context: BaronyContext): BaronyLand[] {
  return context.getLands ().filter (land => isValidLandForExpedition (land.coordinates, player, context));
} // getValidLandsForExpedition

export function getValidResourcesForNobleTitle (playerId: string, context: BaronyContext): BaronyResourceType[] {
  const player = context.getPlayer (playerId);
  return baronyResourceTypes.filter (r => player.resources[r] > 0);
} // getValidResourcesForNobleTitle

export function getVillageDestroyedPlayer (landCoordinates: BaronyLandCoordinates, playerId: string, context: BaronyContext): BaronyPlayer {
  const land = context.getLand (landCoordinates);
  const player = context.getPlayer (playerId);
  const villagePawn = land.pawns.find (p => p.type === "village" && p.color !== player.color) as BaronyPawn;
  return context.getPlayers ().find (p => p.color === villagePawn.color) as BaronyPlayer;
} // getVillageDestroyedPlayer

export function getValidResourcesForVillageDestruction (playerId: string, context: BaronyContext) {
  const player = context.getPlayer (playerId);
  return baronyResourceTypes.filter (r => player.resources[r]);
} // getValidResourcesForVillageDestruction

export function isRecruitmentValid (playerId: string, context: BaronyContext): boolean {
  const player = context.getPlayer (playerId);
  if (!player.pawns.knight) { return false; }
  const hasValidLandTiles = context.getLands ().some (lt => lt.pawns.some (p => p.color === player.color && p.type === "city"));
  return hasValidLandTiles;
} // isRecruitmentValid

export function isMovementValid (player: string, context: BaronyContext): boolean {
  return context.getLands ().some (land => isValidFirstMovementSource (land, player, context));
} // isMovementValid

export function isSecondMovementValid (player: string, firstMovement: BaronyMovement, context: BaronyContext): boolean {
  return context.getLands ().some (land => isValidSecondMovementSource (land, player, firstMovement, context));
} // isSecondMovementValid

function isValidSecondMovementSource (land: BaronyLand, player: string, firstMovement: BaronyMovement, context: BaronyContext) {
  return (
    (land.coordinates !== firstMovement.toLand && hasOneOrMoreOwnKnight (land.coordinates, player, context)) ||
    (land.coordinates === firstMovement.toLand && hasTwoOrMoreOwnKigths (land.coordinates, player, context))
  ) &&
  getNearbyLands (land.coordinates, context).some (nlt => isValidMovementTarget (nlt, player, context));
} // isValidSecondMovementSource

function isValidFirstMovementSource (land: BaronyLand, player: string, context: BaronyContext) {
  return hasOneOrMoreOwnKnight (land.coordinates, player, context) &&
  getNearbyLands (land.coordinates, context).some (nlt => isValidMovementTarget (nlt, player, context));
} // isValidFirstMovementSource

function isValidMovementTarget (land: BaronyLand, playerId: string, context: BaronyContext) {
  const player = context.getPlayer (playerId);
  return land.type !== "lake" &&
  !land.pawns.some (p => p.color !== player.color && (p.type === "city" || p.type === "stronghold")) &&
  !hasTwoOrMorePawnsOfSameOpponent (land.coordinates, player.id, context) &&
  !(land.type === "mountain" && hasOneOrMoreOpponentKnight (land.coordinates, player.id, context));
} // isValidMovementTarget

export function isConstructionValid (player: string, context: BaronyContext): boolean {
  return context.getLands ().some (land => isValidLandTileForConstruction (land, player, context));
} // isConstructionValid

function isValidLandTileForConstruction (land: BaronyLand, playerId: string, context: BaronyContext) {
  const player = context.getPlayer (playerId);
  if (!hasOneOrMoreOwnKnight (land.coordinates, playerId, context)) { return false; }
  return land.pawns.every (p => p.type !== "city" && p.type !== "stronghold" && p.type !== "village" && p.color === player.color);
} // isValidLandTileForConstruction

export function isNewCityValid (player: string, context: BaronyContext): boolean {
  return hasPawnInReserve ("city", player, context) &&
    context.getLandCoordinates ().some (land => isValidLandForNewCity (land, player, context))
} // isNewCityValid

function isValidLandForNewCity (landCoordinates: BaronyLandCoordinates, playerId: string, context: BaronyContext) {
  const land = context.getLand (landCoordinates);
  const player = context.getPlayer (playerId);
  return land.pawns.some (p => p.type === "village" && p.color === player.color) &&
    land.type !== "forest" &&
    !hasOneOrMoreOpponentKnight (landCoordinates, playerId, context) &&
    !getNearbyLands (landCoordinates, context).some (nl => nl.pawns.some (p => p.type === "city"));
} // isValidLandForNewCity

function isValidLandForExpedition (landCoordinates: BaronyLandCoordinates, playerId: string, context: BaronyContext) {
  const land = context.getLand (landCoordinates);
  return land.type !== "lake" &&
    !land.pawns.length &&
    getNearbyLands (landCoordinates, context).length < 6;
} // isValidLandForNewCity

export function isExpeditionValid (player: string, context: BaronyContext): boolean {
  return hasPawnsInReserve (2, "knight", player, context) &&
    context.getLandCoordinates ().some (land => isValidLandForExpedition (land, player, context));
} // isExpeditionValid

export function isNobleTitleValid (playerId: string, context: BaronyContext): boolean {
  return getPlayerResourcePoints (playerId, context) >= 15;
} // isNobleTitleValid

function getPlayerResourcePoints (playerId: string, context: BaronyContext) {
  const player = context.getPlayer (playerId);
  const sum = baronyResourceTypes.reduce (
    (pSum, resource) => (pSum + player.resources[resource] * getResourcePoints (resource)),
    0
  );
  return sum;
} // getPlayerResourcePoints

export function getResourcePoints (resource: BaronyResourceType) {
  switch (resource) {
    case "fields": return 5;
    case "plain": return 4;
    case "forest": return 3;
    case "mountain": return 2;
  } // switch
} // getResourcePoints

export function isConflict (landCoordinates: BaronyLandCoordinates, playerId: string, context: BaronyContext): boolean {
  const land = context.getLand (landCoordinates);
  const player = context.getPlayer (playerId);
  return land.pawns.some (p => p.color !== player.color)
    && land.pawns.some (p => p.color === player.color);
} // isConflict

export function isVillageBeingDestroyed (landCoordinates: BaronyLandCoordinates, playerId: string, context: BaronyContext): boolean {
  const land = context.getLand (landCoordinates);
  const player = context.getPlayer (playerId);
  return land.pawns.some (p => p.type === "village" && p.color !== player.color);
} // isVillageBeingDestroyed

export function isLandTileAdiacentToLake (land: BaronyLandCoordinates, context: BaronyContext): boolean {
  const offsets = [
    { x: 0, y: -1, z: 1 },
    { x: 1, y: -1, z: 0 },
    { x: 1, y: 0, z: -1 },
    { x: 0, y: 1, z: -1 },
    { x: -1, y: 1, z: 0 },
    { x: -1, y: 0, z: 1 }
  ];
  return offsets.some (o => {
    const adiacentC = { x: land.x + o.x, y: land.y + o.y, z: land.z + o.z };
    const adiacentLand = context.getLand (adiacentC);
    if (adiacentLand) {
      return adiacentLand.type === "lake";
    } else {
      return false;
    } // if - else
  });
} // isLandTileNearLake

function hasOneOrMoreOpponentKnight (land: BaronyLandCoordinates, playerId: string, context: BaronyContext) {
  const player = context.getPlayer (playerId);
  return hasPawnsByColor (land, nPawns => nPawns >= 1, null, c => c !== player.color, context);
} // hasOneOrMoreOppoentKnight

function hasOneOrMoreOwnKnight (land: BaronyLandCoordinates, playerId: string, context: BaronyContext) {
  const player = context.getPlayer (playerId);
  return hasPawnsByColor (land, nPawns => nPawns >= 1, p => p === "knight", c => c === player.color, context);
} // hasOneOwnKnight

function hasTwoOrMoreOwnKigths (land: BaronyLandCoordinates, playerId: string, context: BaronyContext) {
  const player = context.getPlayer (playerId);
  return hasPawnsByColor (land, nPawns => nPawns >= 2, p => p === "knight", c => c === player.color, context);
} // hasTwoOwnKigths

function hasTwoOrMorePawnsOfSameOpponent (land: BaronyLandCoordinates, playerId: string, context: BaronyContext) {
  const player = context.getPlayer (playerId);
  return hasPawnsByColor (land, nPawns => nPawns >= 2, null, c => c !== player.color, context);
} // hasTwoPawnsOfSameOpponent

function hasPawnsByColor (
  landCoordinates: BaronyLandCoordinates,
  some: (nPawns: number) => boolean,
  pawnFilter: ((p: BaronyPawnType) => boolean) | null,
  colorFilter: ((c: BaronyColor) => boolean) | null,
  context: BaronyContext
) {
  const land = context.getLand (landCoordinates);
  const pawns: Record<BaronyColor, number> = {
    yellow: 0, red: 0, green: 0, blue: 0
  };
  const filteredPawns = pawnFilter ? land.pawns.filter (p => pawnFilter (p.type)) : land.pawns;
  filteredPawns.forEach (p => pawns[p.color] += 1);
  const filteredColors = colorFilter ? baronyColors.filter (c => colorFilter (c)) : baronyColors;
  return filteredColors.some (c => some (pawns[c]));
} // hasPawns

function hasPawnInReserve (pawnType: BaronyPawnType, playerId: string, context: BaronyContext) {
  return hasPawnsInReserve (1, pawnType, playerId, context);
} // hasPawnInReserve

function hasPawnsInReserve (quantity: number, pawnType: BaronyPawnType, playerId: string, context: BaronyContext) {
  const player = context.getPlayer (playerId);
  return player.pawns[pawnType] >= quantity;
} // hasPawnInReserve

export function hasResourcesToTakeForVillageDestruction (playerId: string, context: BaronyContext) {
  const player = context.getPlayer (playerId);
  return baronyResourceTypes.some (r => player.resources[r]);
} // hasResourcesToTakeForVillageDestruction

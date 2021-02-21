import { BaronyAction, BaronyColor, baronyColors, BaronyLand, BaronyLandCoordinates, BaronyPawn, BaronyPawnType, BaronyPlayer, BaronyResourceType, baronyResourceTypes } from "../models";
import { BaronyMovement } from "../models";
import { BaronyPlay } from "../process";
import { BaronyGameStore } from "./barony-game.store";

export function getValidActions (player: string, game: BaronyGameStore): BaronyAction[] {
  const validActions: BaronyAction[] = [];
  if (isRecruitmentValid (player, game)) { validActions.push ("recruitment"); }
  if (isMovementValid (player, game)) { validActions.push ("movement"); }
  if (isConstructionValid (player, game)) { validActions.push ("construction"); }
  if (isNewCityValid (player, game)) { validActions.push ("newCity"); }
  if (isExpeditionValid (player, game)) { validActions.push ("expedition"); }
  if (isNobleTitleValid (player, game)) { validActions.push ("nobleTitle"); }
  return validActions;
} // getValidActions

export function getValidLandsForSetupPlacement (game: BaronyGameStore): BaronyLand[] {
  const validLandTiles = game.getLands ().filter (lt => {
    if (lt.type === "lake") { return false; }
    if (lt.type === "forest") { return false; }
    if (lt.pawns.length) { return false; }
    const nearbyLandTiles = getNearbyLands (lt.coordinates, game);
    if (nearbyLandTiles.some (nlt => nlt.pawns.length)) { return false; }
    return true;
  });
  return validLandTiles;
} // getValidLandsForSetupPlacement

function getNearbyLands (land: BaronyLandCoordinates, game: BaronyGameStore): BaronyLand[] {
  const x = land.x;
  const y = land.y;
  const z = land.z;
  const toReturn: BaronyLand[] = [];
  let lt;
  lt = game.getLandOrNull ({ x: x + 1, y: y - 1, z }); if (lt) { toReturn.push (lt); }
  lt = game.getLandOrNull ({ x: x - 1, y: y + 1, z }); if (lt) { toReturn.push (lt); }
  lt = game.getLandOrNull ({ x: x, y: y + 1 , z: z - 1 }); if (lt) { toReturn.push (lt); }
  lt = game.getLandOrNull ({ x: x, y: y - 1, z: z + 1 }); if (lt) { toReturn.push (lt); }
  lt = game.getLandOrNull ({ x: x - 1, y, z: z + 1 }); if (lt) { toReturn.push (lt); }
  lt = game.getLandOrNull ({ x: x + 1, y, z: z - 1 }); if (lt) { toReturn.push (lt); }
  return toReturn;
} // getNearbyLands

export function getValidLandsForRecruitment (playerId: string, game: BaronyGameStore): BaronyLand[] {
  const player = game.getPlayer (playerId);
  const validLandTiles = game.getLands ().filter (lt => {
    return lt.pawns.some (p => p.type === "city" && p.color === player.color);
  });
  return validLandTiles;
} // getValidLandsForRecruitment

export function getValidSourceLandsForFirstMovement (player: string, game: BaronyGameStore): BaronyLand[] {
  return game.getLands ().filter (land => isValidFirstMovementSource (land, player, game));
} // getValidSourceLandsForFirstMovement

export function getValidSourceLandsForSecondMovement (player: string, firstMovement: BaronyMovement, game: BaronyGameStore): BaronyLand[] {
  return game.getLands ().filter (land => isValidSecondMovementSource (land, player, firstMovement, game));
} // getValidSourceLandsForSecondMovement

export function getValidTargetLandsForMovement (movementSource: BaronyLandCoordinates, player: string, game: BaronyGameStore): BaronyLand[] {
  return getNearbyLands (movementSource, game).filter (lt => isValidMovementTarget (lt, player, game));
} // getValidTargetLandsForMovement

export function getValidLandsForConstruction (player: string, game: BaronyGameStore) {
  return game.getLands ().filter (lt => isValidLandTileForConstruction (lt, player, game));
} // getValidLandTilesForConstruction

export function getValidBuildingsForConstruction (playerId: string, game: BaronyGameStore): ("stronghold" | "village")[] {
  const player = game.getPlayer (playerId);
  const toReturn: ("stronghold" | "village")[] = [];
  if (player.pawns.stronghold > 0) { toReturn.push ("stronghold"); }
  if (player.pawns.village > 0) { toReturn.push ("village"); }
  return toReturn;
} // getValidBuildingsForConstruction

export function getMaxKnightForRecruitment (land: BaronyLandCoordinates, playerId: string, game: BaronyGameStore): number {
  const player = game.getPlayer (playerId);
  const playerKnights = player.pawns.knight;
  if (isLandTileAdiacentToLake (land, game)) {
    return Math.min (playerKnights, 3);
  } else {
    return Math.min (playerKnights, 2);
  } // if - else
} // getMaxKnightForRecruitment

export function getValidLandsForNewCity (player: string, game: BaronyGameStore): BaronyLand[] {
  return game.getLands ().filter (land => isValidLandForNewCity (land.coordinates, player, game));
} // getValidLandsForNewCity

export function getValidLandsForExpedition (player: string, game: BaronyGameStore): BaronyLand[] {
  return game.getLands ().filter (land => isValidLandForExpedition (land.coordinates, player, game));
} // getValidLandsForExpedition

export function getValidResourcesForNobleTitle (playerId: string, game: BaronyGameStore): BaronyResourceType[] {
  const player = game.getPlayer (playerId);
  return baronyResourceTypes.filter (r => player.resources[r] > 0);
} // getValidResourcesForNobleTitle

export function getVillageDestroyedPlayer (landCoordinates: BaronyLandCoordinates, playerId: string, game: BaronyGameStore): BaronyPlayer {
  const land = game.getLand (landCoordinates);
  const player = game.getPlayer (playerId);
  const villagePawn = land.pawns.find (p => p.type === "village" && p.color !== player.color) as BaronyPawn;
  return game.getPlayers ().find (p => p.color === villagePawn.color) as BaronyPlayer;
} // getVillageDestroyedPlayer

export function getValidResourcesForVillageDestruction (playerId: string, game: BaronyGameStore) {
  const player = game.getPlayer (playerId);
  return baronyResourceTypes.filter (r => player.resources[r]);
} // getValidResourcesForVillageDestruction

export function isRecruitmentValid (playerId: string, game: BaronyGameStore): boolean {
  const player = game.getPlayer (playerId);
  if (!player.pawns.knight) { return false; }
  const hasValidLandTiles = game.getLands ().some (lt => lt.pawns.some (p => p.color === player.color && p.type === "city"));
  return hasValidLandTiles;
} // isRecruitmentValid

export function isMovementValid (player: string, game: BaronyGameStore): boolean {
  return game.getLands ().some (land => isValidFirstMovementSource (land, player, game));
} // isMovementValid

export function isSecondMovementValid (player: string, firstMovement: BaronyMovement, game: BaronyGameStore): boolean {
  return game.getLands ().some (land => isValidSecondMovementSource (land, player, firstMovement, game));
} // isSecondMovementValid

function isValidSecondMovementSource (land: BaronyLand, player: string, firstMovement: BaronyMovement, game: BaronyGameStore) {
  return (
    (land.coordinates !== firstMovement.toLand && hasOneOrMoreOwnKnight (land.coordinates, player, game)) ||
    (land.coordinates === firstMovement.toLand && hasTwoOrMoreOwnKigths (land.coordinates, player, game))
  ) &&
  getNearbyLands (land.coordinates, game).some (nlt => isValidMovementTarget (nlt, player, game));
} // isValidSecondMovementSource

function isValidFirstMovementSource (land: BaronyLand, player: string, game: BaronyGameStore) {
  return hasOneOrMoreOwnKnight (land.coordinates, player, game) &&
  getNearbyLands (land.coordinates, game).some (nlt => isValidMovementTarget (nlt, player, game));
} // isValidFirstMovementSource

function isValidMovementTarget (land: BaronyLand, playerId: string, game: BaronyGameStore) {
  const player = game.getPlayer (playerId);
  return land.type !== "lake" &&
  !land.pawns.some (p => p.color !== player.color && (p.type === "city" || p.type === "stronghold")) &&
  !hasTwoOrMorePawnsOfSameOpponent (land.coordinates, player.id, game) &&
  !(land.type === "mountain" && hasOneOrMoreOpponentKnight (land.coordinates, player.id, game));
} // isValidMovementTarget

export function isConstructionValid (player: string, game: BaronyGameStore): boolean {
  return game.getLands ().some (land => isValidLandTileForConstruction (land, player, game));
} // isConstructionValid

function isValidLandTileForConstruction (land: BaronyLand, playerId: string, game: BaronyGameStore) {
  const player = game.getPlayer (playerId);
  if (!hasOneOrMoreOwnKnight (land.coordinates, playerId, game)) { return false; }
  return land.pawns.every (p => p.type !== "city" && p.type !== "stronghold" && p.type !== "village" && p.color === player.color);
} // isValidLandTileForConstruction

export function isNewCityValid (player: string, game: BaronyGameStore): boolean {
  return hasPawnInReserve ("city", player, game) &&
    game.getLandCoordinates ().some (land => isValidLandForNewCity (land, player, game))
} // isNewCityValid

function isValidLandForNewCity (landCoordinates: BaronyLandCoordinates, playerId: string, game: BaronyGameStore) {
  const land = game.getLand (landCoordinates);
  const player = game.getPlayer (playerId);
  return land.pawns.some (p => p.type === "village" && p.color === player.color) &&
    land.type !== "forest" &&
    !hasOneOrMoreOpponentKnight (landCoordinates, playerId, game) &&
    !getNearbyLands (landCoordinates, game).some (nl => nl.pawns.some (p => p.type === "city"));
} // isValidLandForNewCity

function isValidLandForExpedition (landCoordinates: BaronyLandCoordinates, playerId: string, game: BaronyGameStore) {
  const land = game.getLand (landCoordinates);
  return land.type !== "lake" &&
    !land.pawns.length &&
    getNearbyLands (landCoordinates, game).length < 6;
} // isValidLandForNewCity

export function isExpeditionValid (player: string, game: BaronyGameStore): boolean {
  return hasPawnsInReserve (2, "knight", player, game) &&
    game.getLandCoordinates ().some (land => isValidLandForExpedition (land, player, game));
} // isExpeditionValid

export function isNobleTitleValid (playerId: string, game: BaronyGameStore): boolean {
  return getPlayerResourcePoints (playerId, game) >= 15;
} // isNobleTitleValid

function getPlayerResourcePoints (playerId: string, game: BaronyGameStore) {
  const player = game.getPlayer (playerId);
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

export function isConflict (landCoordinates: BaronyLandCoordinates, playerId: string, game: BaronyGameStore): boolean {
  const land = game.getLand (landCoordinates);
  const player = game.getPlayer (playerId);
  return land.pawns.some (p => p.color !== player.color)
    && land.pawns.some (p => p.color === player.color);
} // isConflict

export function isVillageBeingDestroyed (landCoordinates: BaronyLandCoordinates, playerId: string, game: BaronyGameStore): boolean {
  const land = game.getLand (landCoordinates);
  const player = game.getPlayer (playerId);
  return land.pawns.some (p => p.type === "village" && p.color !== player.color);
} // isVillageBeingDestroyed

export function isLandTileAdiacentToLake (land: BaronyLandCoordinates, game: BaronyGameStore): boolean {
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
    const adiacentLand = game.getLand (adiacentC);
    if (adiacentLand) {
      return adiacentLand.type === "lake";
    } else {
      return false;
    } // if - else
  });
} // isLandTileNearLake

function hasOneOrMoreOpponentKnight (land: BaronyLandCoordinates, playerId: string, game: BaronyGameStore) {
  const player = game.getPlayer (playerId);
  return hasPawnsByColor (land, nPawns => nPawns >= 1, null, c => c !== player.color, game);
} // hasOneOrMoreOppoentKnight

function hasOneOrMoreOwnKnight (land: BaronyLandCoordinates, playerId: string, game: BaronyGameStore) {
  const player = game.getPlayer (playerId);
  return hasPawnsByColor (land, nPawns => nPawns >= 1, p => p === "knight", c => c === player.color, game);
} // hasOneOwnKnight

function hasTwoOrMoreOwnKigths (land: BaronyLandCoordinates, playerId: string, game: BaronyGameStore) {
  const player = game.getPlayer (playerId);
  return hasPawnsByColor (land, nPawns => nPawns >= 2, p => p === "knight", c => c === player.color, game);
} // hasTwoOwnKigths

function hasTwoOrMorePawnsOfSameOpponent (land: BaronyLandCoordinates, playerId: string, game: BaronyGameStore) {
  const player = game.getPlayer (playerId);
  return hasPawnsByColor (land, nPawns => nPawns >= 2, null, c => c !== player.color, game);
} // hasTwoPawnsOfSameOpponent

function hasPawnsByColor (
  landCoordinates: BaronyLandCoordinates,
  some: (nPawns: number) => boolean,
  pawnFilter: ((p: BaronyPawnType) => boolean) | null,
  colorFilter: ((c: BaronyColor) => boolean) | null,
  game: BaronyGameStore
) {
  const land = game.getLand (landCoordinates);
  const pawns: Record<BaronyColor, number> = {
    yellow: 0, red: 0, green: 0, blue: 0
  };
  const filteredPawns = pawnFilter ? land.pawns.filter (p => pawnFilter (p.type)) : land.pawns;
  filteredPawns.forEach (p => pawns[p.color] += 1);
  const filteredColors = colorFilter ? baronyColors.filter (c => colorFilter (c)) : baronyColors;
  return filteredColors.some (c => some (pawns[c]));
} // hasPawns

function hasPawnInReserve (pawnType: BaronyPawnType, playerId: string, game: BaronyGameStore) {
  return hasPawnsInReserve (1, pawnType, playerId, game);
} // hasPawnInReserve

function hasPawnsInReserve (quantity: number, pawnType: BaronyPawnType, playerId: string, game: BaronyGameStore) {
  const player = game.getPlayer (playerId);
  return player.pawns[pawnType] >= quantity;
} // hasPawnInReserve

export function hasResourcesToTakeForVillageDestruction (playerId: string, game: BaronyGameStore) {
  const player = game.getPlayer (playerId);
  return baronyResourceTypes.some (r => player.resources[r]);
} // hasResourcesToTakeForVillageDestruction

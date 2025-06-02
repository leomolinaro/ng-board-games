import { BARONY_COLORS, BARONY_RESOURCE_TYPES, BARONY_WINNING_POINTS } from "../barony-constants";
import {
  BaronyAction,
  BaronyColor,
  BaronyFinalScores,
  BaronyLand,
  BaronyLandCoordinates,
  BaronyMovement,
  BaronyPawn,
  BaronyPawnType,
  BaronyPlayer,
  BaronyResourceType
} from "../barony-models";
import { BaronyGameStore } from "./barony-game.store";

export function getValidActions(player: BaronyColor, game: BaronyGameStore): BaronyAction[] {
  const validActions: BaronyAction[] = [];
  if (isRecruitmentValid(player, game)) {
    validActions.push("recruitment");
  }
  if (isMovementValid(player, game)) {
    validActions.push("movement");
  }
  if (isConstructionValid(player, game)) {
    validActions.push("construction");
  }
  if (isNewCityValid(player, game)) {
    validActions.push("newCity");
  }
  if (isExpeditionValid(player, game)) {
    validActions.push("expedition");
  }
  if (isNobleTitleValid(player, game)) {
    validActions.push("nobleTitle");
  }
  return validActions;
}

export function getValidLandsForSetupPlacement(game: BaronyGameStore): BaronyLand[] {
  const validLandTiles = game.getLands().filter(lt => {
    if (lt.type === "lake") {
      return false;
    }
    if (lt.type === "forest") {
      return false;
    }
    if (lt.pawns.length) {
      return false;
    }
    const nearbyLandTiles = getNearbyLands(lt.coordinates, game);
    if (nearbyLandTiles.some(nlt => nlt.pawns.length)) {
      return false;
    }
    return true;
  });
  return validLandTiles;
}

function getNearbyLands(land: BaronyLandCoordinates, game: BaronyGameStore): BaronyLand[] {
  const x = land.x;
  const y = land.y;
  const z = land.z;
  const toReturn: BaronyLand[] = [];
  let lt;
  lt = game.getLandOrNull({ x: x + 1, y: y - 1, z });
  if (lt) {
    toReturn.push(lt);
  }
  lt = game.getLandOrNull({ x: x - 1, y: y + 1, z });
  if (lt) {
    toReturn.push(lt);
  }
  lt = game.getLandOrNull({ x: x, y: y + 1, z: z - 1 });
  if (lt) {
    toReturn.push(lt);
  }
  lt = game.getLandOrNull({ x: x, y: y - 1, z: z + 1 });
  if (lt) {
    toReturn.push(lt);
  }
  lt = game.getLandOrNull({ x: x - 1, y, z: z + 1 });
  if (lt) {
    toReturn.push(lt);
  }
  lt = game.getLandOrNull({ x: x + 1, y, z: z - 1 });
  if (lt) {
    toReturn.push(lt);
  }
  return toReturn;
}

export function getValidLandsForRecruitment(playerId: BaronyColor, game: BaronyGameStore): BaronyLand[] {
  const player = game.getPlayer(playerId);
  const validLandTiles = game.getLands().filter(lt => lt.pawns.some(p => p.type === "city" && p.color === player.id));
  return validLandTiles;
}

export function getValidSourceLandsForFirstMovement(player: BaronyColor, game: BaronyGameStore): BaronyLand[] {
  return game.getLands().filter(land => isValidFirstMovementSource(land, player, game));
}

export function getValidSourceLandsForSecondMovement(
  player: BaronyColor,
  firstMovement: BaronyMovement,
  game: BaronyGameStore
): BaronyLand[] {
  return game.getLands().filter(land => isValidSecondMovementSource(land, player, firstMovement, game));
}

export function getValidTargetLandsForMovement(
  movementSource: BaronyLandCoordinates,
  player: BaronyColor,
  game: BaronyGameStore
): BaronyLand[] {
  return getNearbyLands(movementSource, game).filter(lt => isValidMovementTarget(lt, player, game));
}

export function getValidLandsForConstruction(player: BaronyColor, game: BaronyGameStore) {
  return game.getLands().filter(lt => isValidLandTileForConstruction(lt, player, game));
}

export function getValidBuildingsForConstruction(
  playerId: BaronyColor,
  game: BaronyGameStore
): ("stronghold" | "village")[] {
  const player = game.getPlayer(playerId);
  const toReturn: ("stronghold" | "village")[] = [];
  if (player.pawns.stronghold > 0) {
    toReturn.push("stronghold");
  }
  if (player.pawns.village > 0) {
    toReturn.push("village");
  }
  return toReturn;
}

export function getMaxKnightForRecruitment(
  land: BaronyLandCoordinates,
  playerId: BaronyColor,
  game: BaronyGameStore
): number {
  const player = game.getPlayer(playerId);
  const playerKnights = player.pawns.knight;
  if (isLandTileAdiacentToLake(land, game)) {
    return Math.min(playerKnights, 3);
  } else {
    return Math.min(playerKnights, 2);
  }
}

export function getValidLandsForNewCity(player: BaronyColor, game: BaronyGameStore): BaronyLand[] {
  return game.getLands().filter(land => isValidLandForNewCity(land.coordinates, player, game));
}

export function getValidLandsForExpedition(player: BaronyColor, game: BaronyGameStore): BaronyLand[] {
  return game.getLands().filter(land => isValidLandForExpedition(land.coordinates, player, game));
}

export function getValidResourcesForNobleTitle(playerId: BaronyColor, game: BaronyGameStore): BaronyResourceType[] {
  const player = game.getPlayer(playerId);
  return BARONY_RESOURCE_TYPES.filter(r => player.resources[r] > 0);
}

export function getVillageDestroyedPlayer(
  landCoordinates: BaronyLandCoordinates,
  playerId: BaronyColor,
  game: BaronyGameStore
): BaronyPlayer {
  const land = game.getLand(landCoordinates);
  const player = game.getPlayer(playerId);
  const villagePawn = land.pawns.find(p => p.type === "village" && p.color !== player.id) as BaronyPawn;
  return game.getPlayers().find(p => p.id === villagePawn.color) as BaronyPlayer;
}

export function getValidResourcesForVillageDestruction(playerId: BaronyColor, game: BaronyGameStore) {
  const player = game.getPlayer(playerId);
  return BARONY_RESOURCE_TYPES.filter(r => player.resources[r]);
}

export function getFinalScores(game: BaronyGameStore): BaronyFinalScores {
  const players = game.getPlayers();
  const victoryPointsByPlayer: Record<string, number> = {};
  let winner = players[0];
  let winnerVictoryPoints = getPlayerVictoryPoints(winner);
  victoryPointsByPlayer[winner.id] = winnerVictoryPoints;
  for (let i = 1; i < players.length; i++) {
    const player = players[i];
    const playerVictoryPoints = getPlayerVictoryPoints(player);
    victoryPointsByPlayer[player.id] = playerVictoryPoints;
    if (playerVictoryPoints >= winnerVictoryPoints) {
      // in caso di parità, vince il giocatore più lontano dal primo
      winnerVictoryPoints = playerVictoryPoints;
      winner = player;
    }
  }
  return { victoryPointsByPlayer, winnerPlayer: winner.id };
}

function getPlayerVictoryPoints(player: BaronyPlayer) {
  let victoryPoints = player.score;
  for (const resource of BARONY_RESOURCE_TYPES) {
    const n = player.resources[resource];
    victoryPoints += n * getResourceVicotryPoints(resource);
  }
  return victoryPoints;
}

export function isRecruitmentValid(playerId: BaronyColor, game: BaronyGameStore): boolean {
  const player = game.getPlayer(playerId);
  if (!player.pawns.knight) {
    return false;
  }
  const hasValidLandTiles = game.getLands().some(lt => lt.pawns.some(p => p.color === player.id && p.type === "city"));
  return hasValidLandTiles;
}

export function isMovementValid(player: BaronyColor, game: BaronyGameStore): boolean {
  return game.getLands().some(land => isValidFirstMovementSource(land, player, game));
}

export function isSecondMovementValid(
  player: BaronyColor,
  firstMovement: BaronyMovement,
  game: BaronyGameStore
): boolean {
  return game.getLands().some(land => isValidSecondMovementSource(land, player, firstMovement, game));
}

function isValidSecondMovementSource(
  land: BaronyLand,
  player: BaronyColor,
  firstMovement: BaronyMovement,
  game: BaronyGameStore
) {
  return (
    ((land.coordinates !== firstMovement.toLand && hasOneOrMoreOwnKnight(land.coordinates, player, game)) ||
      (land.coordinates === firstMovement.toLand && hasTwoOrMoreOwnKigths(land.coordinates, player, game))) &&
    getNearbyLands(land.coordinates, game).some(nlt => isValidMovementTarget(nlt, player, game))
  );
}

function isValidFirstMovementSource(land: BaronyLand, player: BaronyColor, game: BaronyGameStore) {
  return (
    hasOneOrMoreOwnKnight(land.coordinates, player, game) &&
    getNearbyLands(land.coordinates, game).some(nlt => isValidMovementTarget(nlt, player, game))
  );
}

function isValidMovementTarget(land: BaronyLand, playerId: BaronyColor, game: BaronyGameStore) {
  const player = game.getPlayer(playerId);
  return (
    land.type !== "lake" &&
    !land.pawns.some(p => p.color !== player.id && (p.type === "city" || p.type === "stronghold")) &&
    !hasTwoOrMorePawnsOfSameOpponent(land.coordinates, player.id, game) &&
    !(land.type === "mountain" && hasOneOrMoreOpponentKnight(land.coordinates, player.id, game))
  );
}

export function isConstructionValid(player: BaronyColor, game: BaronyGameStore): boolean {
  return game.getLands().some(land => isValidLandTileForConstruction(land, player, game));
}

function isValidLandTileForConstruction(land: BaronyLand, playerId: BaronyColor, game: BaronyGameStore) {
  const player = game.getPlayer(playerId);
  if (!hasOneOrMoreOwnKnight(land.coordinates, playerId, game)) {
    return false;
  }
  return land.pawns.every(
    p => p.type !== "city" && p.type !== "stronghold" && p.type !== "village" && p.color === player.id
  );
}

export function isNewCityValid(player: BaronyColor, game: BaronyGameStore): boolean {
  return (
    hasPawnInReserve("city", player, game) &&
    game.getLandCoordinates().some(land => isValidLandForNewCity(land, player, game))
  );
}

function isValidLandForNewCity(landCoordinates: BaronyLandCoordinates, playerId: BaronyColor, game: BaronyGameStore) {
  const land = game.getLand(landCoordinates);
  const player = game.getPlayer(playerId);
  return (
    land.pawns.some(p => p.type === "village" && p.color === player.id) &&
    land.type !== "forest" &&
    !hasOneOrMoreOpponentKnight(landCoordinates, playerId, game) &&
    !getNearbyLands(landCoordinates, game).some(nl => nl.pawns.some(p => p.type === "city"))
  );
}

function isValidLandForExpedition(
  landCoordinates: BaronyLandCoordinates,
  playerId: BaronyColor,
  game: BaronyGameStore
) {
  const land = game.getLand(landCoordinates);
  return land.type !== "lake" && !land.pawns.length && getNearbyLands(landCoordinates, game).length < 6;
}

export function isExpeditionValid(player: BaronyColor, game: BaronyGameStore): boolean {
  return (
    hasPawnsInReserve(2, "knight", player, game) &&
    game.getLandCoordinates().some(land => isValidLandForExpedition(land, player, game))
  );
}

export function isNobleTitleValid(playerId: BaronyColor, game: BaronyGameStore): boolean {
  return getPlayerResourcePoints(playerId, game) >= 15;
}

function getPlayerResourcePoints(playerId: BaronyColor, game: BaronyGameStore) {
  const player = game.getPlayer(playerId);
  const sum = BARONY_RESOURCE_TYPES.reduce(
    (pSum, resource) => pSum + player.resources[resource] * getResourcePoints(resource),
    0
  );
  return sum;
}

export function isPlayerWinning(playerId: BaronyColor, game: BaronyGameStore): boolean {
  const player = game.getPlayer(playerId);
  return BARONY_WINNING_POINTS.includes(player.score);
}

export function getResourcePoints(resource: BaronyResourceType) {
  switch (resource) {
    case "fields":
      return 5;
    case "plain":
      return 4;
    case "forest":
      return 3;
    case "mountain":
      return 2;
  }
}

export function getResourceVicotryPoints(resource: BaronyResourceType) {
  switch (resource) {
    case "fields":
      return 3;
    case "plain":
      return 2;
    case "forest":
      return 1;
    case "mountain":
      return 0;
  }
}

export function isConflict(
  landCoordinates: BaronyLandCoordinates,
  playerId: BaronyColor,
  game: BaronyGameStore
): boolean {
  const land = game.getLand(landCoordinates);
  const player = game.getPlayer(playerId);
  return land.pawns.some(p => p.color !== player.id) && land.pawns.some(p => p.color === player.id);
}

export function isVillageBeingDestroyed(
  landCoordinates: BaronyLandCoordinates,
  playerId: BaronyColor,
  game: BaronyGameStore
): boolean {
  const land = game.getLand(landCoordinates);
  const player = game.getPlayer(playerId);
  return land.pawns.some(p => p.type === "village" && p.color !== player.id);
}

export function isLandTileAdiacentToLake(land: BaronyLandCoordinates, game: BaronyGameStore): boolean {
  const offsets = [
    { x: 0, y: -1, z: 1 },
    { x: 1, y: -1, z: 0 },
    { x: 1, y: 0, z: -1 },
    { x: 0, y: 1, z: -1 },
    { x: -1, y: 1, z: 0 },
    { x: -1, y: 0, z: 1 }
  ];
  return offsets.some(o => {
    const adiacentC = { x: land.x + o.x, y: land.y + o.y, z: land.z + o.z };
    const adiacentLand = game.getLand(adiacentC);
    if (adiacentLand) {
      return adiacentLand.type === "lake";
    } else {
      return false;
    }
  });
}

function hasOneOrMoreOpponentKnight(land: BaronyLandCoordinates, playerId: BaronyColor, game: BaronyGameStore) {
  const player = game.getPlayer(playerId);
  return hasPawnsByColor(
    land,
    nPawns => nPawns >= 1,
    null,
    c => c !== player.id,
    game
  );
}

function hasOneOrMoreOwnKnight(land: BaronyLandCoordinates, playerId: BaronyColor, game: BaronyGameStore) {
  const player = game.getPlayer(playerId);
  return hasPawnsByColor(
    land,
    nPawns => nPawns >= 1,
    p => p === "knight",
    c => c === player.id,
    game
  );
}

function hasTwoOrMoreOwnKigths(land: BaronyLandCoordinates, playerId: BaronyColor, game: BaronyGameStore) {
  const player = game.getPlayer(playerId);
  return hasPawnsByColor(
    land,
    nPawns => nPawns >= 2,
    p => p === "knight",
    c => c === player.id,
    game
  );
}

function hasTwoOrMorePawnsOfSameOpponent(land: BaronyLandCoordinates, playerId: BaronyColor, game: BaronyGameStore) {
  const player = game.getPlayer(playerId);
  return hasPawnsByColor(
    land,
    nPawns => nPawns >= 2,
    null,
    c => c !== player.id,
    game
  );
}

function hasPawnsByColor(
  landCoordinates: BaronyLandCoordinates,
  some: (nPawns: number) => boolean,
  pawnFilter: ((p: BaronyPawnType) => boolean) | null,
  colorFilter: ((c: BaronyColor) => boolean) | null,
  game: BaronyGameStore
) {
  const land = game.getLand(landCoordinates);
  const pawns: Record<BaronyColor, number> = {
    yellow: 0,
    red: 0,
    green: 0,
    blue: 0
  };
  const filteredPawns = pawnFilter ? land.pawns.filter(p => pawnFilter(p.type)) : land.pawns;
  filteredPawns.forEach(p => (pawns[p.color] += 1));
  const filteredColors = colorFilter ? BARONY_COLORS.filter(c => colorFilter(c)) : BARONY_COLORS;
  return filteredColors.some(c => some(pawns[c]));
}

function hasPawnInReserve(pawnType: BaronyPawnType, playerId: BaronyColor, game: BaronyGameStore) {
  return hasPawnsInReserve(1, pawnType, playerId, game);
}

function hasPawnsInReserve(quantity: number, pawnType: BaronyPawnType, playerId: BaronyColor, game: BaronyGameStore) {
  const player = game.getPlayer(playerId);
  return player.pawns[pawnType] >= quantity;
}

export function hasResourcesToTakeForVillageDestruction(playerId: BaronyColor, game: BaronyGameStore) {
  const player = game.getPlayer(playerId);
  return BARONY_RESOURCE_TYPES.some(r => player.resources[r]);
}

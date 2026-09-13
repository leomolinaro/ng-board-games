import { Injectable } from '@angular/core';
import type { BgUser } from '@leobg/commons';
import { arrayUtil, immutableUtil } from '@leobg/commons/utils';
import { patchState, signalStore, withState } from '@ngrx/signals';
import type {
  BaronyColor,
  BaronyConstruction,
  BaronyFinalScores,
  BaronyLand,
  BaronyLandCoordinates,
  BaronyLog,
  BaronyMovement,
  BaronyPawn,
  BaronyPawnType,
  BaronyPlayer,
  BaronyResourceType,
} from '../barony-models';
import { landCoordinatesToId } from '../barony-models';

interface BaronyGameBox {
  removedPawns: BaronyPawn[];
}

interface BaronyGameState {
  gameId: string;
  gameOwner: null | BgUser;
  players: {
    map: Partial<Record<BaronyColor, BaronyPlayer>>;
    ids: BaronyColor[];
  };
  lands: {
    map: Record<string, BaronyLand>;
    coordinates: BaronyLandCoordinates[];
  };
  gameBox: BaronyGameBox;
  logs: BaronyLog[];
  endGame: boolean;
  backupState: BaronyGameState | null;
}

@Injectable()
export class BaronyGameStore extends signalStore(
  { protectedState: false },
  withState<BaronyGameState>({
    gameId: '',
    gameOwner: null,
    players: { map: {}, ids: [] },
    lands: { map: {}, coordinates: [] },
    gameBox: { removedPawns: [] },
    logs: [],
    endGame: false,
    backupState: null,
  }),
) {
  setInitialState(
    players: BaronyPlayer[],
    lands: BaronyLand[],
    gameId: string,
    gameOwner: BgUser,
  ): void {
    patchState(
      this,
      () =>
        ({
          gameId,
          gameOwner,
          players: {
            map: arrayUtil.toMap(players, (p) => p.id),
            ids: players.map((p) => p.id),
          },
          lands: {
            map: arrayUtil.toMap(lands, (l) => l.id),
            coordinates: lands.map((l) => l.coordinates),
          },
          gameBox: {
            removedPawns: [],
          },
          logs: [],
          endGame: false,
          backupState: null,
        }) satisfies BaronyGameState,
    );
  }

  isTemporaryState(): boolean {
    return !!this.backupState();
  }
  startTemporaryState(): void {
    patchState(this, (s) => ({ ...s, backupState: s }));
  }
  endTemporaryState(): void {
    if (this.backupState()) {
      patchState(this, (s) => ({ ...s.backupState, backupState: null }));
    } else {
      throw new Error('endTemporaryState without startTemporaryState');
    }
  }

  playerList(): BaronyPlayer[] {
    return this.players.ids().map((id) => this.getPlayer(id));
  }
  getPlayer(id: BaronyColor): BaronyPlayer {
    return this.players.map()[id]!;
  }
  getNumberOfPlayers(): number {
    return this.playerList().length;
  }
  getLand(land: BaronyLandCoordinates): BaronyLand {
    return this.lands.map()[landCoordinatesToId(land)];
  }
  landList(): BaronyLand[] {
    const map = this.lands.map();
    const coordinates = this.lands.coordinates();
    return coordinates.map(
      (coordinate) => map[landCoordinatesToId(coordinate)],
    );
  }
  getLandOrNull(land: BaronyLandCoordinates): BaronyLand | null {
    return this.getLand(land) || null;
  }

  private updatePlayer(
    _actionName: string,
    playerId: BaronyColor,
    updater: (p: BaronyPlayer) => BaronyPlayer,
  ): void {
    patchState(this, (s) => ({
      ...s,
      players: {
        ...s.players,
        map: {
          ...s.players.map,
          [playerId]: updater(s.players.map[playerId]!),
        },
      },
    }));
  }

  private updateGameBox(
    _actionName: string,
    updater: (gameBox: BaronyGameBox) => BaronyGameBox,
  ): void {
    patchState(this, (s) => ({
      ...s,
      gameBox: updater(s.gameBox),
    }));
  }

  private updateLand(
    _actionName: string,
    land: BaronyLandCoordinates,
    updater: (lt: BaronyLand) => BaronyLand,
  ): void {
    const key = landCoordinatesToId(land);
    patchState(this, (s) => ({
      ...s,
      lands: {
        ...s.lands,
        map: {
          ...s.lands.map,
          [key]: updater(s.lands.map[key]),
        },
      },
    }));
  }

  private addPawnToPlayer(
    pawnType: BaronyPawnType,
    playerId: BaronyColor,
  ): void {
    this.updatePlayer('Add pawn to player', playerId, (p) => ({
      ...p,
      pawns: {
        ...p.pawns,
        [pawnType]: p.pawns[pawnType] + 1,
      },
    }));
  }

  private removePawnFromPlayer(
    pawnType: BaronyPawnType,
    playerId: BaronyColor,
  ): void {
    this.updatePlayer('Remove pawn from player', playerId, (p) => ({
      ...p,
      pawns: {
        ...p.pawns,
        [pawnType]: p.pawns[pawnType] - 1,
      },
    }));
  }

  private addPawnToLandTile(
    pawnType: BaronyPawnType,
    pawnColor: BaronyColor,
    land: BaronyLandCoordinates,
  ): void {
    this.updateLand('Add pawn to land tile', land, (lt) => ({
      ...lt,
      pawns: immutableUtil.listPush(
        [{ color: pawnColor, type: pawnType }],
        lt.pawns,
      ),
    }));
  }

  private removePawnFromLandTile(
    pawnType: BaronyPawnType,
    pawnColor: BaronyColor,
    land: BaronyLandCoordinates,
  ): void {
    this.updateLand('Remove pawn from land tile', land, (lt) => ({
      ...lt,
      pawns: immutableUtil.listRemoveFirst(
        (p) => p.type === pawnType && p.color === pawnColor,
        lt.pawns,
      ),
    }));
  }

  private addResourceToPlayer(
    resource: BaronyResourceType,
    playerId: BaronyColor,
  ): void {
    this.updatePlayer('Add resource to player', playerId, (p) => ({
      ...p,
      resources: {
        ...p.resources,
        [resource]: p.resources[resource] + 1,
      },
    }));
  }

  private removeResourceFromPlayer(
    resource: BaronyResourceType,
    playerId: BaronyColor,
  ): void {
    this.updatePlayer('Remove resource from player', playerId, (p) => ({
      ...p,
      resources: {
        ...p.resources,
        [resource]: p.resources[resource] - 1,
      },
    }));
  }

  private getResourceFromLand(
    landCoordinates: BaronyLandCoordinates,
  ): BaronyResourceType {
    const land = this.getLand(landCoordinates);
    return land?.type as BaronyResourceType;
  }

  private addVictoryPoints(victoryPoints: number, playerId: BaronyColor): void {
    this.updatePlayer('Add victory points', playerId, (p) => ({
      ...p,
      score: p.score + victoryPoints,
    }));
  }

  private addPawnToGameBox(
    pawnType: BaronyPawnType,
    pawnColor: BaronyColor,
  ): void {
    this.updateGameBox('Add pawn to gameBox', (gameBox) => ({
      ...gameBox,
      removedPawns: immutableUtil.listPush(
        [{ color: pawnColor, type: pawnType }],
        gameBox.removedPawns,
      ),
    }));
  }

  private addLog(_actionName: string, log: BaronyLog): void {
    patchState(this, (s) => ({
      ...s,
      logs: [...s.logs, log],
    }));
  }

  applySetup(land: BaronyLandCoordinates, player: BaronyColor): void {
    this.removePawnFromPlayer('knight', player);
    this.addPawnToLandTile('knight', player, land);
    this.removePawnFromPlayer('city', player);
    this.addPawnToLandTile('city', player, land);
  }

  applyRecruitment(land: BaronyLandCoordinates, playerId: BaronyColor): void {
    this.removePawnFromPlayer('knight', playerId);
    this.addPawnToLandTile('knight', playerId, land);
  }

  applyMovement(movement: BaronyMovement, playerId: BaronyColor): void {
    this.removePawnFromLandTile('knight', playerId, movement.fromLand);
    this.addPawnToLandTile('knight', playerId, movement.toLand);
    if (movement.conflict) {
      const land = this.getLand(movement.toLand);
      let villagePlayer: BaronyPlayer | null = null;
      const playerPawns = land.pawns.filter((pawn) => pawn.color !== playerId);
      for (const pawn of playerPawns) {
        const pawnPlayer = this.playerList().find((p) => p.id === pawn.color)!;
        this.removePawnFromLandTile(pawn.type, pawn.color, land.coordinates);
        this.addPawnToPlayer(pawn.type, pawnPlayer.id);
        if (pawn.type === 'village') {
          villagePlayer = pawnPlayer;
        }
      }
      if (villagePlayer && movement.gainedResource) {
        this.removeResourceFromPlayer(
          movement.gainedResource,
          villagePlayer.id,
        );
        this.addResourceToPlayer(movement.gainedResource, playerId);
      }
    }
  }

  applyConstruction(
    construction: BaronyConstruction,
    playerId: BaronyColor,
  ): void {
    this.removePawnFromLandTile('knight', playerId, construction.land);
    this.removePawnFromPlayer(construction.building, playerId);
    this.addPawnToLandTile(construction.building, playerId, construction.land);
    this.addPawnToPlayer('knight', playerId);
    const resource = this.getResourceFromLand(construction.land);
    this.addResourceToPlayer(resource, playerId);
  }

  applyNewCity(land: BaronyLandCoordinates, playerId: BaronyColor): void {
    this.removePawnFromLandTile('village', playerId, land);
    this.addPawnToLandTile('city', playerId, land);
    this.addPawnToPlayer('village', playerId);
    this.removePawnFromPlayer('city', playerId);
    this.addVictoryPoints(10, playerId);
  }

  applyExpedition(land: BaronyLandCoordinates, playerId: BaronyColor): void {
    this.removePawnFromPlayer('knight', playerId);
    this.addPawnToLandTile('knight', playerId, land);
    this.removePawnFromPlayer('knight', playerId);
    this.addPawnToGameBox('knight', playerId);
  }

  applyEndGame(finalScores: BaronyFinalScores): void {
    patchState(this, (s) => ({
      ...s,
      players: {
        ...s.players,
        map: arrayUtil.toMap(
          s.players.ids,
          (id) => id,
          (id) => ({
            ...s.players.map[id]!,
            victoryPoints: finalScores.victoryPointsByPlayer[id],
            winner: finalScores.winnerPlayer === id,
          }),
        ),
      },
      endGame: true,
    }));
  }

  discardResource(resource: BaronyResourceType, playerId: BaronyColor): void {
    this.removeResourceFromPlayer(resource, playerId);
  }

  applyNobleTitle(
    resources: BaronyResourceType[],
    playerId: BaronyColor,
  ): void {
    for (const resource of resources) this.discardResource(resource, playerId);
    this.addVictoryPoints(15, playerId);
  }

  logMovement(movement: BaronyMovement, player: BaronyColor): void {
    this.addLog('Log movement', {
      type: 'movement',
      movement: movement,
      player: player,
    });
  }
  logExpedition(land: BaronyLandCoordinates, player: BaronyColor): void {
    this.addLog('Log expedition', {
      type: 'expedition',
      land: land,
      player: player,
    });
  }
  logNobleTitle(resources: BaronyResourceType[], player: BaronyColor): void {
    this.addLog('Log nobleTitle', {
      type: 'nobleTitle',
      resources: resources,
      player: player,
    });
  }
  logNewCity(land: BaronyLandCoordinates, player: BaronyColor): void {
    this.addLog('Log newCity', { type: 'newCity', land: land, player: player });
  }
  logConstruction(construction: BaronyConstruction, player: BaronyColor): void {
    this.addLog('Log construction', {
      type: 'construction',
      construction: construction,
      player: player,
    });
  }
  logRecuitment(land: BaronyLandCoordinates, player: BaronyColor): void {
    this.addLog('Log recuitment', {
      type: 'recruitment',
      land: land,
      player: player,
    });
  }
  logTurn(player: BaronyColor): void {
    this.addLog('Log turn', { type: 'turn', player: player });
  }
  logSetupPlacement(land: BaronyLandCoordinates, player: BaronyColor): void {
    this.addLog('Log setupPlacement', {
      type: 'setupPlacement',
      land: land,
      player: player,
    });
  }
  logSetup(): void {
    this.addLog('Log setup', { type: 'setup' });
  }
}

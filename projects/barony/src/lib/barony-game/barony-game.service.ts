import { inject, Injectable } from '@angular/core';
import type { BgUser } from '@leobg/commons';
import { ABgGameService, BgAuthService } from '@leobg/commons';
import { from, type Observable } from 'rxjs';
import type {
  ABaronyPlayer,
  BaronyColor,
  BaronyConstruction,
  BaronyLandCoordinates,
  BaronyMovement,
  BaronyPlayer,
  BaronyResourceType,
  BaronySetupPlacement,
  BaronyStory,
  BaronyTurn,
} from '../barony-models';
import { landCoordinatesToId } from '../barony-models';
import type { BaronyPlayerDoc, BaronyStoryDoc } from '../barony-remote.service';
import { BaronyRemoteService } from '../barony-remote.service';
import { BaronyGameStore } from './barony-game.store';
import { BaronyPlayerAiService } from './barony-player-ai.service';
import { BaronyPlayerLocalService } from './barony-player-local.service';
import * as baronyRules from './barony-rules';
import { BaronyUiStore } from './barony-ui.store';

interface ABaronyPlayerService {
  setupPlacement(playerId: BaronyColor): Promise<BaronySetupPlacement>;
  turn(playerId: BaronyColor): Promise<BaronyTurn>;
}

interface BaronyRoundOutput {
  endGame: boolean;
  roundNumber: number;
}

interface BaronyTurnOutput {
  lastRound: boolean;
}

@Injectable()
export class BaronyGameService extends ABgGameService<
  BaronyColor,
  BaronyPlayer,
  BaronyStory,
  ABaronyPlayerService
> {
  private gameStore = inject(BaronyGameStore);
  protected aiPlayer = inject(BaronyPlayerAiService);
  protected localPlayer = inject(BaronyPlayerLocalService);
  protected auth = inject(BgAuthService);
  private ui = inject(BaronyUiStore);
  private remote = inject(BaronyRemoteService);

  protected storyDocs: BaronyStoryDoc[] | undefined = undefined;

  async game(stories: BaronyStoryDoc[]): Promise<void> {
    this.storyDocs = stories;
    await this.setup();
    let prevRoundOutput: BaronyRoundOutput = { endGame: false, roundNumber: 0 };
    while (!prevRoundOutput.endGame) {
      const roundNumber = prevRoundOutput.roundNumber + 1;
      prevRoundOutput = await this.round(roundNumber);
    }
    this.ui.updateUi('End game', (s) => ({
      ...s,
      ...this.ui.resetUi(),
      canCancel: false,
    }));
    this.gameEnd();
  }

  private async setup(): Promise<void> {
    this.gameStore.logSetup();
    const playerIds = this.gameStore.players.ids();
    const turns: BaronyColor[] = [...playerIds];
    for (let i = playerIds.length - 1; i >= 0; i--) {
      turns.push(playerIds[i], playerIds[i]);
    }
    await this.setupPlacement(turns.shift()!);
    while (turns.length > 0) {
      await this.setupPlacement(turns.shift()!);
    }
  }

  private async round(roundNumber: number): Promise<BaronyRoundOutput> {
    const playerIds = this.gameStore.players.ids();
    const turns = [...playerIds];
    let turnOutput = await this.turn(turns.shift()!, false);
    while (turns.length > 0) {
      turnOutput = await this.turn(turns.shift()!, turnOutput.lastRound);
    }
    return { endGame: turnOutput.lastRound, roundNumber };
  }

  private async setupPlacement(player: BaronyColor): Promise<void> {
    const result = await this.executeTask(player, (p) =>
      p.setupPlacement(player),
    );
    this.gameStore.applySetup(result.land, player);
    this.gameStore.logSetupPlacement(result.land, player);
  }

  private async turn(
    player: BaronyColor,
    isLastRound: boolean,
  ): Promise<BaronyTurnOutput> {
    this.gameStore.logTurn(player);
    const result = await this.executeTask(player, (p) => p.turn(player));
    switch (result.action) {
      case 'recruitment':
        this.recruitment(result.numberOfKnights, result.land, player);
        break;
      case 'construction':
        this.construction(result.constructions, player);
        break;
      case 'expedition':
        this.expedition(result.land, player);
        break;
      case 'movement':
        this.movement(result.movements, player);
        break;
      case 'newCity':
        this.newCity(result.land, player);
        break;
      case 'nobleTitle':
        this.nobleTitle(result.discardedResources, player);
        break;
    }
    if (!isLastRound) {
      const isPlayerWinning = baronyRules.isPlayerWinning(
        player,
        this.gameStore,
      );
      if (isPlayerWinning) {
        isLastRound = true;
      }
    }
    return { lastRound: isLastRound };
  }

  private recruitment(
    numberOfKnights: number,
    landTileCoordinates: BaronyLandCoordinates,
    player: BaronyColor,
  ): void {
    for (let i = 0; i < numberOfKnights; i++) {
      this.gameStore.applyRecruitment(landTileCoordinates, player);
      this.gameStore.logRecuitment(landTileCoordinates, player);
    }
  }

  private construction(
    constructions: BaronyConstruction[],
    player: BaronyColor,
  ): void {
    for (const construction of constructions) {
      this.gameStore.applyConstruction(construction, player);
      this.gameStore.logConstruction(construction, player);
    }
  }

  private expedition(land: BaronyLandCoordinates, player: BaronyColor): void {
    this.gameStore.applyExpedition(land, player);
    this.gameStore.logExpedition(land, player);
  }

  private movement(movements: BaronyMovement[], player: BaronyColor): void {
    for (const movement of movements) {
      this.gameStore.applyMovement(movement, player);
      this.gameStore.logMovement(movement, player);
    }
  }

  private newCity(land: BaronyLandCoordinates, player: BaronyColor): void {
    this.gameStore.applyNewCity(land, player);
    this.gameStore.logNewCity(land, player);
  }

  private nobleTitle(
    resources: BaronyResourceType[],
    player: BaronyColor,
  ): void {
    this.gameStore.applyNobleTitle(resources, player);
    this.gameStore.logNobleTitle(resources, player);
  }

  private gameEnd(): void {
    const finalScores = baronyRules.getFinalScores(this.gameStore);
    this.gameStore.applyEndGame(finalScores);
  }

  protected getGameId(): string {
    return this.gameStore.gameId();
  }
  protected getPlayer(playerId: BaronyColor): BaronyPlayer {
    return this.gameStore.getPlayer(playerId);
  }
  protected getGameOwner(): BgUser {
    const gameOwner = this.gameStore.gameOwner();
    if (!gameOwner) throw new Error('Game owner is not set');
    return gameOwner;
  }
  protected startTemporaryState(): void {
    this.gameStore.startTemporaryState();
  }
  protected endTemporaryState(): void {
    this.gameStore.endTemporaryState();
  }

  protected insertStoryDoc$(
    storyId: string,
    story: BaronyStoryDoc,
    gameId: string,
  ): Observable<BaronyStoryDoc> {
    return from(this.remote.insertStory(storyId, story, gameId));
  }
  protected selectStoryDoc$(
    storyId: string,
    gameId: string,
  ): Observable<BaronyStoryDoc | undefined> {
    return this.remote.selectStory$(storyId, gameId);
  }

  protected getCurrentPlayerId(): BaronyColor | undefined {
    return this.ui.currentPlayer();
  }
  protected setCurrentPlayer(playerId: BaronyColor): void {
    this.ui.setCurrentPlayer(playerId);
  }
  protected currentPlayerChange$(): Observable<BaronyColor | undefined> {
    return this.ui.currentPlayerChange$();
  }
  protected cancelChange$(): Observable<void> {
    return from(this.ui.cancelSelect.get());
  }

  protected resetUi(player: BaronyColor): void {
    this.ui.updateUi('Reset UI', (s) => ({
      ...s,
      turnPlayer: player,
      ...this.ui.resetUi(),
      canCancel: false,
      message: `${this.gameStore.getPlayer(player).name} is thinking...`,
    }));
  }

  async loadGame(gameId: string): Promise<BaronyStoryDoc[]> {
    const [game, players, baronyMap, stories] = await Promise.all([
      this.remote.getGame(gameId),
      this.remote.getPlayers(gameId, (ref) => ref.orderBy('sort')),
      this.remote.getMap(gameId),
      this.remote.getStories(gameId, (ref) =>
        ref.orderBy('time').orderBy('playerId'),
      ),
    ]);
    if (game && baronyMap) {
      const user = this.auth.getUser();
      this.gameStore.setInitialState(
        players.map((p) =>
          this.playerDocToPlayerInit(p, user, game.owner.id === user.id),
        ),
        baronyMap.lands.map((l) => {
          const x = l.x;
          const y = l.y;
          const z = -(x + y);
          const coordinates: BaronyLandCoordinates = { x, y, z };
          return {
            id: landCoordinatesToId(coordinates),
            coordinates: coordinates,
            type: l.type,
            pawns: [],
          };
        }),
        gameId,
        game.owner,
      );
    }
    return stories;
  }

  private playerDocToPlayerInit(
    playerDoc: BaronyPlayerDoc,
    user: BgUser,
    isOwner: boolean,
  ): BaronyPlayer {
    return playerDoc.isAi
      ? {
          ...this.playerDocToAPlayerInit(playerDoc),
          isAi: true,
          isLocal: isOwner,
          isRemote: !isOwner,
        }
      : {
          ...this.playerDocToAPlayerInit(playerDoc),
          isAi: false,
          controller: playerDoc.controller,
          isLocal: user.id === playerDoc.controller.id,
          isRemote: user.id !== playerDoc.controller.id,
        };
  }

  private playerDocToAPlayerInit(playerDoc: BaronyPlayerDoc): ABaronyPlayer {
    return {
      id: playerDoc.id,
      name: playerDoc.name,
      score: 0,
      pawns: {
        city: 5,
        stronghold: 2,
        knight: 7,
        village: 14,
      },
      resources: {
        forest: 0,
        mountain: 0,
        plain: 0,
        fields: 0,
      },
      victoryPoints: 0,
      winner: false,
    };
  }
}

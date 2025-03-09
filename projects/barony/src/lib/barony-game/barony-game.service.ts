import { Injectable, inject } from "@angular/core";
import { ABgGameService, BgAuthService, BgUser } from "@leobg/commons";
import { Observable, firstValueFrom, forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import {
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
  landCoordinatesToId,
} from "../barony-models";
import {
  BaronyPlayerDoc,
  BaronyRemoteService,
  BaronyStoryDoc,
} from "../barony-remote.service";
import { BaronyGameStore } from "./barony-game.store";
import { BaronyPlayerAiService } from "./barony-player-ai.service";
import { BaronyPlayerLocalService } from "./barony-player-local.service";
import * as baronyRules from "./barony-rules";
import { BaronyUiStore } from "./barony-ui.store";

interface ABaronyPlayerService {
  setupPlacement$(playerId: BaronyColor): Observable<BaronySetupPlacement>;
  turn$(playerId: BaronyColor): Observable<BaronyTurn>;
}

interface BaronyRoundOutput {
  endGame: boolean;
  roundNumber: number;
}

interface BaronyTurnOutput {
  lastRound: boolean;
}

@Injectable ()
export class BaronyGameService extends ABgGameService<BaronyColor, BaronyPlayer, BaronyStory, ABaronyPlayerService> {
  
  private gameStore = inject (BaronyGameStore);
  protected aiPlayer = inject (BaronyPlayerAiService);
  protected localPlayer = inject (BaronyPlayerLocalService);
  protected auth = inject (BgAuthService);
  private ui = inject (BaronyUiStore);
  private remote = inject (BaronyRemoteService);

  protected storyDocs: BaronyStoryDoc[] | null = null;

  async game (stories: BaronyStoryDoc[]) {
    this.storyDocs = stories;
    await this.setup ();
    let prevRoundOutput: BaronyRoundOutput = { endGame: false, roundNumber: 0 };
    while (!prevRoundOutput.endGame) {
      const roundNumber = prevRoundOutput.roundNumber + 1;
      prevRoundOutput = await this.round (roundNumber);
    }
    this.ui.updateUi ("End game", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      canCancel: false,
    }));
    this.gameEnd ();
  }

  private async setup () {
    this.gameStore.logSetup ();
    const playerIds = this.gameStore.getPlayerIds ();
    const turns: BaronyColor[] = [...playerIds];
    for (let i = playerIds.length - 1; i >= 0; i--) {
      turns.push (playerIds[i]);
      turns.push (playerIds[i]);
    }
    await this.setupPlacement (turns.shift ()!);
    while (turns.length) {
      await this.setupPlacement (turns.shift ()!);
    }
  }

  private async round (roundNumber: number): Promise<BaronyRoundOutput> {
    const playerIds = this.gameStore.getPlayerIds ();
    const turns = [...playerIds];
    let turnOutput = await this.turn (turns.shift ()!, false);
    while (turns.length) {
      turnOutput = await this.turn (turns.shift ()!, turnOutput.lastRound);
    }
    return { endGame: turnOutput.lastRound, roundNumber };
  }

  private async setupPlacement (player: BaronyColor) {
    const result = await firstValueFrom (this.executeTask$ (player, (p) => p.setupPlacement$ (player)));
    this.gameStore.applySetup (result.land, player);
    this.gameStore.logSetupPlacement (result.land, player);
  }

  private async turn (
    player: BaronyColor,
    lastRound: boolean
  ): Promise<BaronyTurnOutput> {
    this.gameStore.logTurn (player);
    const result = await firstValueFrom (this.executeTask$ (player, (p) => p.turn$ (player)));
    switch (result.action) {
      case "recruitment": this.recruitment (result.numberOfKnights, result.land, player); break;
      case "construction": this.construction (result.constructions, player); break;
      case "expedition": this.expedition (result.land, player); break;
      case "movement": this.movement (result.movements, player); break;
      case "newCity": this.newCity (result.land, player); break;
      case "nobleTitle": this.nobleTitle (result.discardedResources, player); break;
    }
    if (!lastRound) {
      const playerWinning = baronyRules.isPlayerWinning (player, this.gameStore);
      if (playerWinning) { lastRound = true; }
    }
    return { lastRound: lastRound };
  }

  private recruitment (
    numberOfKnights: number,
    landTileCoordinates: BaronyLandCoordinates,
    player: BaronyColor
  ) {
    for (let i = 0; i < numberOfKnights; i++) {
      this.gameStore.applyRecruitment (landTileCoordinates, player);
      this.gameStore.logRecuitment (landTileCoordinates, player);
    }
  }

  private construction (constructions: BaronyConstruction[], player: BaronyColor) {
    constructions.forEach ((construction) => {
      this.gameStore.applyConstruction (construction, player);
      this.gameStore.logConstruction (construction, player);
    });
  }

  private expedition (land: BaronyLandCoordinates, player: BaronyColor) {
    this.gameStore.applyExpedition (land, player);
    this.gameStore.logExpedition (land, player);
  }

  private movement (movements: BaronyMovement[], player: BaronyColor) {
    movements.forEach ((movement) => {
      this.gameStore.applyMovement (movement, player);
      this.gameStore.logMovement (movement, player);
    });
  }

  private newCity (land: BaronyLandCoordinates, player: BaronyColor) {
    this.gameStore.applyNewCity (land, player);
    this.gameStore.logNewCity (land, player);
  }

  private nobleTitle (resources: BaronyResourceType[], player: BaronyColor) {
    this.gameStore.applyNobleTitle (resources, player);
    this.gameStore.logNobleTitle (resources, player);
  }

  private gameEnd () {
    const finalScores = baronyRules.getFinalScores (this.gameStore);
    this.gameStore.applyEndGame (finalScores);
  }

  protected getGameId () { return this.gameStore.getGameId (); }
  protected getPlayer (playerId: BaronyColor) { return this.gameStore.getPlayer (playerId); }
  protected getGameOwner () { return this.gameStore.getGameOwner (); }
  protected startTemporaryState () { this.gameStore.startTemporaryState (); }
  protected endTemporaryState () { this.gameStore.endTemporaryState (); }

  protected insertStoryDoc$ (storyId: string, story: BaronyStoryDoc, gameId: string) { return this.remote.insertStory$ (storyId, story, gameId); }
  protected selectStoryDoc$ (storyId: string, gameId: string) { return this.remote.selectStory$ (storyId, gameId); }

  protected getCurrentPlayerId () { return this.ui.getCurrentPlayerId (); }
  protected setCurrentPlayer (playerId: BaronyColor) { this.ui.setCurrentPlayer (playerId); }
  protected currentPlayerChange$ () { return this.ui.currentPlayerChange$ (); }
  protected cancelChange$ () { return this.ui.cancelChange$ (); }

  protected resetUi (player: BaronyColor) {
    this.ui.updateUi ("Reset UI", (s) => ({
      ...s,
      turnPlayer: player,
      ...this.ui.resetUi (),
      canCancel: false,
      message: `${this.gameStore.getPlayer (player).name} is thinking...`,
    }));
  }

  loadGame$ (gameId: string) {
    return forkJoin ([
      this.remote.getGame$ (gameId),
      this.remote.getPlayers$ (gameId, (ref) => ref.orderBy ("sort")),
      this.remote.getMap$ (gameId),
      this.remote.getStories$ (gameId, (ref) => ref.orderBy ("time").orderBy ("playerId")),
    ]).pipe (
      map (([game, players, baronyMap, stories]) => {
        if (game && baronyMap) {
          const user = this.auth.getUser ();
          this.gameStore.setInitialState (
            players.map ((p) => this.playerDocToPlayerInit (p, user, game.owner.id === user.id)),
            baronyMap.lands.map ((l) => {
              const x = l.x;
              const y = l.y;
              const z = -1 * (x + y);
              const coordinates: BaronyLandCoordinates = { x, y, z };
              return {
                id: landCoordinatesToId (coordinates),
                coordinates: coordinates,
                type: l.type,
                pawns: [],
              };
            }),
            gameId,
            game.owner
          );
        }
        return stories;
      })
    );
  }

  private playerDocToPlayerInit (
    playerDoc: BaronyPlayerDoc,
    user: BgUser,
    isOwner: boolean
  ): BaronyPlayer {
    if (playerDoc.isAi) {
      return {
        ...this.playerDocToAPlayerInit (playerDoc),
        isAi: true,
        isLocal: isOwner,
        isRemote: !isOwner,
      };
    } else {
      return {
        ...this.playerDocToAPlayerInit (playerDoc),
        isAi: false,
        controller: playerDoc.controller,
        isLocal: user.id === playerDoc.controller.id,
        isRemote: user.id !== playerDoc.controller.id,
      };
    }
  }

  private playerDocToAPlayerInit (playerDoc: BaronyPlayerDoc): ABaronyPlayer {
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

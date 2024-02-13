import { Injectable } from "@angular/core";
import { ABgGameService, BgAuthService, BgUser } from "@leobg/commons";
import { EMPTY, Observable, forkJoin } from "rxjs";
import { expand, last, map, mapTo } from "rxjs/operators";
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
  
  constructor (
    private game: BaronyGameStore,
    protected aiPlayer: BaronyPlayerAiService,
    protected localPlayer: BaronyPlayerLocalService,
    protected auth: BgAuthService,
    private ui: BaronyUiStore,
    private remote: BaronyRemoteService
  ) { super (); }

  protected storyDocs: BaronyStoryDoc[] | null = null;

  game$ (stories: BaronyStoryDoc[]): Observable<void> {
    this.storyDocs = stories;
    return this.setup$ ().pipe (
      mapTo<void, BaronyRoundOutput> ({ endGame: false, roundNumber: 0 }),
      expand ((prevRoundOutput) => {
        if (prevRoundOutput.endGame) {
          this.ui.updateUi ("End game", (s) => ({
            ...s,
            ...this.ui.resetUi (),
            canCancel: false,
          }));
          this.gameEnd ();
          return EMPTY;
        } else {
          const roundNumber = prevRoundOutput.roundNumber + 1;
          return this.round$ (roundNumber);
        }
      }),
      last (),
      mapTo (void 0)
    );
  }

  private setup$ (): Observable<void> {
    this.game.logSetup ();
    const playerIds = this.game.getPlayerIds ();
    const turns: BaronyColor[] = [...playerIds];
    for (let i = playerIds.length - 1; i >= 0; i--) {
      turns.push (playerIds[i]);
      turns.push (playerIds[i]);
    }
    return this.setupPlacement$ (turns.shift ()!).pipe (
      expand (() =>
        turns.length ? this.setupPlacement$ (turns.shift ()!) : EMPTY
      ),
      last ()
    );
  }

  private round$ (roundNumber: number): Observable<BaronyRoundOutput> {
    const playerIds = this.game.getPlayerIds ();
    const turns = [...playerIds];
    return this.turn$ (turns.shift ()!, false).pipe (
      expand ((turnOutput) =>
        turns.length ? this.turn$ (turns.shift ()!, turnOutput.lastRound) : EMPTY
      ),
      last (),
      map ((turnOutput) => ({ endGame: turnOutput.lastRound, roundNumber }))
    );
  }

  setupPlacement$ (player: BaronyColor): Observable<void> {
    return this.executeTask$ (player, (p) => p.setupPlacement$ (player)).pipe (
      map ((result) => {
        this.game.applySetup (result.land, player);
        this.game.logSetupPlacement (result.land, player);
        return void 0;
      })
    );
  }

  private turn$ (
    player: BaronyColor,
    lastRound: boolean
  ): Observable<BaronyTurnOutput> {
    this.game.logTurn (player);
    return this.executeTask$ (player, (p) => p.turn$ (player)).pipe (
      map ((result) => {
        switch (result.action) {
          case "recruitment": this.recruitment (result.numberOfKnights, result.land, player); break;
          case "construction": this.construction (result.constructions, player); break;
          case "expedition": this.expedition (result.land, player); break;
          case "movement": this.movement (result.movements, player); break;
          case "newCity": this.newCity (result.land, player); break;
          case "nobleTitle": this.nobleTitle (result.discardedResources, player); break;
        }
        if (!lastRound) {
          const playerWinning = baronyRules.isPlayerWinning (player, this.game);
          if (playerWinning) { lastRound = true; }
        }
        return { lastRound: lastRound };
      })
    );
  }

  private recruitment (
    numberOfKnights: number,
    landTileCoordinates: BaronyLandCoordinates,
    player: BaronyColor
  ) {
    for (let i = 0; i < numberOfKnights; i++) {
      this.game.applyRecruitment (landTileCoordinates, player);
      this.game.logRecuitment (landTileCoordinates, player);
    }
  }

  private construction (constructions: BaronyConstruction[], player: BaronyColor) {
    constructions.forEach ((construction) => {
      this.game.applyConstruction (construction, player);
      this.game.logConstruction (construction, player);
    });
  }

  private expedition (land: BaronyLandCoordinates, player: BaronyColor) {
    this.game.applyExpedition (land, player);
    this.game.logExpedition (land, player);
  }

  private movement (movements: BaronyMovement[], player: BaronyColor) {
    movements.forEach ((movement) => {
      this.game.applyMovement (movement, player);
      this.game.logMovement (movement, player);
    });
  }

  private newCity (land: BaronyLandCoordinates, player: BaronyColor) {
    this.game.applyNewCity (land, player);
    this.game.logNewCity (land, player);
  }

  private nobleTitle (resources: BaronyResourceType[], player: BaronyColor) {
    this.game.applyNobleTitle (resources, player);
    this.game.logNobleTitle (resources, player);
  }

  private gameEnd () {
    const finalScores = baronyRules.getFinalScores (this.game);
    this.game.applyEndGame (finalScores);
  }

  protected getGameId () { return this.game.getGameId (); }
  protected getPlayer (playerId: BaronyColor) { return this.game.getPlayer (playerId); }
  protected getGameOwner () { return this.game.getGameOwner (); }
  protected startTemporaryState () { this.game.startTemporaryState (); }
  protected endTemporaryState () { this.game.endTemporaryState (); }

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
      message: `${this.game.getPlayer (player).name} is thinking...`,
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
          this.game.setInitialState (
            players.map ((p) => this.playerDocToPlayerInit (p, user)),
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
    user: BgUser
  ): BaronyPlayer {
    if (playerDoc.isAi) {
      return {
        ...this.playerDocToAPlayerInit (playerDoc),
        isAi: true,
        isLocal: false,
        isRemote: false,
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

import { Injectable } from "@angular/core";
import { ABgGameService, BgAuthService, BgUser } from "@bg-services";
import { EMPTY, Observable, forkJoin } from "rxjs";
import { expand, last, map, mapTo } from "rxjs/operators";
import { ABaronyPlayer, BaronyConstruction, BaronyLandCoordinates, BaronyMovement, BaronyPlayer, BaronyResourceType, BaronySetupPlacement, BaronyStory, BaronyTurn, landCoordinatesToId } from "../barony-models";
import { BaronyPlayerDoc, BaronyRemoteService, BaronyStoryDoc } from "../barony-remote.service";
import { BaronyGameStore } from "./barony-game.store";
import { BaronyPlayerAiService } from "./barony-player-ai.service";
import { BaronyPlayerLocalService } from "./barony-player-local.service";
import * as baronyRules from "./barony-rules";
import { BaronyUiStore } from "./barony-ui.store";

interface ABaronyPlayerService {
  setupPlacement$ (playerId: string): Observable<BaronySetupPlacement>;
  turn$ (playerId: string): Observable<BaronyTurn>;
} // ABaronyPlayerService

interface BaronyRoundOutput {
  endGame: boolean;
  roundNumber: number;
} // BaronyRoundOutput

interface BaronyTurnOutput {
  lastRound: boolean;
} // BaronyTurnOutput

@Injectable ()
export class BaronyGameService extends ABgGameService<BaronyPlayer, BaronyStory, ABaronyPlayerService> {

  constructor (
    private game: BaronyGameStore,
    protected aiService: BaronyPlayerAiService,
    protected localService: BaronyPlayerLocalService,
    protected authService: BgAuthService,
    private ui: BaronyUiStore,
    private remoteService: BaronyRemoteService
  ) { super (); }

  protected stories: BaronyStoryDoc[] | null = null;

  game$ (stories: BaronyStoryDoc[]): Observable<void> {
    this.stories = stories;
    return this.setup$ ().pipe (
      mapTo<void, BaronyRoundOutput> ({ endGame: false, roundNumber: 0 }),
      expand (prevRoundOutput => {
        if (prevRoundOutput.endGame) {
          this.ui.updateUi ("End game", s => ({
            ...s,
            ...this.ui.resetUi (),
            canCancel: false
          }));
          this.gameEnd ();
          return EMPTY;
        } else {
          const roundNumber = prevRoundOutput.roundNumber + 1;
          return this.round$ (roundNumber);
        } // if - else
      }),
      last (),
      mapTo (void 0)
    );
  } // game$

  private setup$ (): Observable<void> {
    this.game.logSetup ();
    const playerIds = this.game.getPlayerIds ();
    const turns: string[] = [...playerIds];
    for (let i = playerIds.length - 1; i >= 0; i--) {
      turns.push (playerIds[i]);
      turns.push (playerIds[i]);
    } // for
    return this.setupPlacement$ (turns.shift ()!).pipe (
      expand (() => turns.length ? this.setupPlacement$ (turns.shift ()!) : EMPTY),
      last ()
    );
  } // setup$

  private round$ (roundNumber: number): Observable<BaronyRoundOutput> {
    const playerIds = this.game.getPlayerIds ();
    const turns = [...playerIds];
    return this.turn$ (turns.shift ()!, false).pipe (
      expand (turnOutput => turns.length ? this.turn$ (turns.shift ()!, turnOutput.lastRound) : EMPTY),
      last (),
      map (turnOutput => ({ endGame: turnOutput.lastRound, roundNumber }))
    );
  } // round$

  setupPlacement$ (player: string): Observable<void> {
    return this.executeTask$ (player, p => p.setupPlacement$ (player)).pipe (
      map (result => {
        this.game.applySetup (result.land, player);
        this.game.logSetupPlacement (result.land, player);
        return void 0;
      })
    );
  } // setupPlacement$

  private turn$ (player: string, lastRound: boolean): Observable<BaronyTurnOutput> {
    this.game.logTurn (player);
    return this.executeTask$ (player, p => p.turn$ (player)).pipe (
      map (result => {
        switch (result.action) {
          case "recruitment": this.recruitment (result.numberOfKnights, result.land, player); break;
          case "construction": this.construction (result.constructions, player); break;
          case "expedition": this.expedition (result.land, player); break;
          case "movement": this.movement (result.movements, player); break;
          case "newCity": this.newCity (result.land, player); break;
          case "nobleTitle": this.nobleTitle (result.discardedResources, player); break;
        } // switch
        if (!lastRound) {
          const playerWinning = baronyRules.isPlayerWinning (player, this.game);
          if (playerWinning) { lastRound = true; }
        } // if
        return { lastRound: lastRound };
      })
    );
  } // turn$

  private recruitment (numberOfKnights: number, landTileCoordinates: BaronyLandCoordinates, player: string) {
    for (let i = 0; i < numberOfKnights; i++) {
      this.game.applyRecruitment (landTileCoordinates, player);
      this.game.logRecuitment (landTileCoordinates, player);
    } // for
  } // recruitment

  private construction (constructions: BaronyConstruction[], player: string) {
    constructions.forEach (construction => {
      this.game.applyConstruction (construction, player);
      this.game.logConstruction (construction, player);
    });
  } // construction

  private expedition (land: BaronyLandCoordinates, player: string) {
    this.game.applyExpedition (land, player);
    this.game.logExpedition (land, player);
  } // expedition

  private movement (movements: BaronyMovement[], player: string) {
    movements.forEach ((movement) => {
      this.game.applyMovement (movement, player);
      this.game.logMovement (movement, player);
    });
  } // movement

  private newCity (land: BaronyLandCoordinates, player: string) {
    this.game.applyNewCity (land, player);
    this.game.logNewCity (land, player);
  } // newCity

  private nobleTitle (resources: BaronyResourceType[], player: string) {
    this.game.applyNobleTitle (resources, player);
    this.game.logNobleTitle (resources, player);
  } // nobleTitle

  private gameEnd () {
    const finalScores = baronyRules.getFinalScores (this.game);
    this.game.applyEndGame (finalScores);
  } // gameEnd

  protected getGameId () { return this.game.getGameId (); }
  protected getPlayer (playerId: string) { return this.game.getPlayer (playerId); }
  protected getGameOwner () { return this.game.getGameOwner (); }
  protected startTemporaryState () { this.game.startTemporaryState (); }
  protected endTemporaryState () { this.game.endTemporaryState (); }
  
  protected insertStory$<S extends BaronyStory> (story: S, storyId: number, gameId: string): Observable<S> {
    return this.remoteService.insertStory$ ({
      id: storyId,
      ...(story as BaronyStory)
    }, gameId) as any as Observable<S>;
  } // insertStory$

  protected selectStory$ (storyId: number, gameId: string) { return this.remoteService.selectStory$ (storyId, gameId); }

  protected getCurrentPlayerId () { return this.ui.getCurrentPlayerId (); }
  protected setCurrentPlayer (playerId: string) { this.ui.setCurrentPlayer (playerId); }
  protected currentPlayerChange$ () { return this.ui.currentPlayerChange$ (); }
  protected cancelChange$ () { return this.ui.cancelChange$ (); }

  protected resetUi (player: string) {
    this.ui.updateUi ("Reset UI", s => ({
      ...s,
      turnPlayer: player,
      ...this.ui.resetUi (),
      canCancel: false,
      message: `${this.game.getPlayer (player).name} is thinking...`,
    }));
  } // resetUi

  loadGame$ (gameId: string) {
    return forkJoin ([
      this.remoteService.getGame$ (gameId),
      this.remoteService.getPlayers$ (gameId, ref => ref.orderBy ("sort")),
      this.remoteService.getMap$ (gameId),
      this.remoteService.getStories$ (gameId, ref => ref.orderBy ("id"))
    ]).pipe (
      map (([game, players, baronyMap, stories]) => {
        if (game && baronyMap) {
          const user = this.authService.getUser ();
          this.game.setInitialState (
            players.map (p => this.playerDocToPlayerInit (p, user)),
            baronyMap.lands.map (l => {
              const x = l.x;
              const y = l.y;
              const z = -1 * (x + y);
              const coordinates: BaronyLandCoordinates = { x, y, z };
              return {
                id: landCoordinatesToId (coordinates),
                coordinates: coordinates,
                type: l.type,
                pawns: []
              };
            }),
            gameId,
            game.owner
          );
        } // if
        return stories;
      })
    );
  } // loadGame$

  private playerDocToPlayerInit (playerDoc: BaronyPlayerDoc, user: BgUser): BaronyPlayer {
    if (playerDoc.isAi) {
      return {
        ...this.playerDocToAPlayerInit (playerDoc),
        isAi: true,
        isLocal: false,
        isRemote: false
      };
    } else {
      return {
        ...this.playerDocToAPlayerInit (playerDoc),
        isAi: false,
        controller: playerDoc.controller,
        isLocal: user.id === playerDoc.controller.id,
        isRemote: user.id !== playerDoc.controller.id
      };
    } // if - else
  } // playerDocToPlayerInit

  private playerDocToAPlayerInit (playerDoc: BaronyPlayerDoc): ABaronyPlayer {
    return {
      id: playerDoc.id,
      color: playerDoc.color,
      name: playerDoc.name,
      score: 0,
      pawns: {
        city: 5,
        stronghold: 2,
        knight: 7,
        village: 14
      },
      resources: {
        forest: 0,
        mountain: 0,
        plain: 0,
        fields: 0
      },
      victoryPoints: 0,
      winner: false
    };
  } // playerDocToAPlayerInit

} // BaronyGameService

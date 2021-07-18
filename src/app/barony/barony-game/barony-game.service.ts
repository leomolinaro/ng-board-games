import { Injectable } from "@angular/core";
import { BgAuthService } from "@bg-services";
import { EMPTY, Observable, of, race } from "rxjs";
import { expand, filter, first, last, map, mapTo, switchMap } from "rxjs/operators";
import { BaronyConstruction, BaronyLandCoordinates, BaronyMovement, BaronyResourceType, BaronySetupPlacement, BaronyStory, BaronyTurn } from "../barony-models";
import { BaronyRemoteService, BaronyStoryDoc } from "../barony-remote.service";
import { BaronyGameStore } from "./barony-game.store";
import { BaronyPlayerAiService } from "./barony-player-ai.service";
import { BaronyPlayerLocalService } from "./barony-player-local.service";
import { BaronyUiStore } from "./barony-ui.store";

interface APlayerService {
  setupPlacement$ (playerId: string): Observable<BaronySetupPlacement>;
  turn$ (playerId: string): Observable<BaronyTurn>;
} // APlayerService

@Injectable ()
export class BaronyGameService {

  constructor (
    private game: BaronyGameStore,
    private aiService: BaronyPlayerAiService,
    private localService: BaronyPlayerLocalService,
    private authService: BgAuthService,
    private ui: BaronyUiStore,
    private remoteService: BaronyRemoteService
  ) { }

  private lastStoryId: number = 0;
  private stories: BaronyStoryDoc[] | null = null;

  game$ (stories: BaronyStoryDoc[]): Observable<void> {
    this.stories = stories;
    return this.setup$ ().pipe (
      mapTo (0),
      expand (prevRoundNumber => {
        const roundNumber = prevRoundNumber + 1;
        return this.round$ (roundNumber).pipe (
          mapTo (roundNumber)
        );
      }),
      mapTo (void 0),
      last ()
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

  private round$ (roundNumber: number): Observable<void> {
    const playerIds = this.game.getPlayerIds ();
    const turns = [...playerIds];
    return this.turn$ (turns.shift ()!).pipe (
      expand (() => turns.length ? this.turn$ (turns.shift ()!) : EMPTY),
      last ()
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

  private turn$ (player: string): Observable<void> {
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
        return void 0;
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

  private isLocalPlayer (playerId: string) {
    const user = this.authService.getUser ();
    const player = this.game.getPlayer (playerId);
    return player.isAi ? false : player.controller.id === user.id;
  } // isLocalPlayer

  private isOwnerUser () {
    const user = this.authService.getUser ();
    const gameOwner = this.game.getGameOwner ();
    return user.id === gameOwner.id;
  } // isOwnerUser

  private isCurrentPlayer (playerId: string) {
    const currentPlayerId = this.ui.getCurrentPlayerId ();
    return currentPlayerId === playerId;
  } // isCurrentPlayer

  private isAiPlayer (playerId: string) {
    const player = this.game.getPlayer (playerId);
    return player.isAi;
  } // isAiPlayer

  private autoRefreshCurrentPlayer (player: string) {
    if (this.isLocalPlayer (player)) {
      this.ui.setCurrentPlayer (player);
    } // if - else
  } // autoRefreshCurrentPlayer

  private executeTaskOnFixedPlayer$<R extends BaronyStory> (playerId: string, task$: (playerService: APlayerService) => Observable<R>): Observable<R> {
    if (this.isLocalPlayer (playerId) && this.isCurrentPlayer (playerId)) {
      return task$ (this.localService).pipe (
        switchMap (result => this.insertStory$ (result, ++this.lastStoryId, this.game.getGameId ()))
      );
    } else if (this.isAiPlayer (playerId) && this.isOwnerUser ()) {
      return task$ (this.aiService).pipe (
        switchMap (result => this.insertStory$ (result, ++this.lastStoryId, this.game.getGameId ()))
      );
    } else {
      this.resetUi (playerId);
      return this.remoteService.selectStory$ (++this.lastStoryId, this.game.getGameId ()).pipe (
        filter (story => !!story),
        map (story => story as any as R),
        first<R> ()
      );
    } // if - else
  } // executeTaskOnFixedPlayer$

  private executeTaskOnChangingPlayer$<R extends BaronyStory> (playerId: string, task$: (playerService: APlayerService) => Observable<R>): Observable<R | null> {
    return race (
      this.executeTaskOnFixedPlayer$ (playerId, task$),
      this.ui.currentPlayerChange$ ().pipe (mapTo (null)),
      this.ui.cancelChange$ ().pipe (mapTo (null))
    );
  } // executeTaskOnChangingPlayer$

  private executeTask$<R extends BaronyStory> (playerId: string, task$: (playerService: APlayerService) => Observable<R>): Observable<R> {
    if (this.stories && this.stories.length) {
      const nextStory = this.stories.shift ()!;
      this.lastStoryId = nextStory.id;
      return of (nextStory as BaronyStory as R);
    } else {
      this.autoRefreshCurrentPlayer (playerId);
      this.game.startTemporaryState ();
      return this.executeTaskOnChangingPlayer$ (playerId, task$).pipe (
        expand (result => {
          this.game.endTemporaryState ();
          if (result) {
            return EMPTY;
          } else {
            this.game.startTemporaryState ();
            return this.executeTaskOnChangingPlayer$ (playerId, task$);
          } // if - else
        }),
        last (),
        map (story => story as any as R),
      );
    } // if - else
  } // executeTask$

  private insertStory$<S extends BaronyStory> (story: S, storyId: number, gameId: string): Observable<S> {
    return this.remoteService.insertStory$ ({
      id: storyId,
      ...(story as BaronyStory)
    }, gameId) as any as Observable<S>;
  } // insertAction$

  private resetUi (player: string) {
    this.ui.updateUi ("Reset UI", s => ({
      ...s,
      turnPlayer: player,
      ...this.ui.resetUi (),
      canCancel: false,
      message: `${this.game.getPlayer (player).name} is thinking...`,
    }));
  } // resetUi

} // BaronyGameService

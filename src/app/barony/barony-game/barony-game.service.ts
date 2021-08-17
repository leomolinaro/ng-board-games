import { Injectable } from "@angular/core";
import { BgAuthService } from "@bg-services";
import { EMPTY, Observable } from "rxjs";
import { expand, last, map, mapTo } from "rxjs/operators";
import { ABgGameService } from "src/app/bg-services/a-bg-game.service";
import { BaronyConstruction, BaronyLandCoordinates, BaronyMovement, BaronyPlayer, BaronyResourceType, BaronySetupPlacement, BaronyStory, BaronyTurn } from "../barony-models";
import { BaronyRemoteService, BaronyStoryDoc } from "../barony-remote.service";
import { BaronyGameStore } from "./barony-game.store";
import { BaronyPlayerAiService } from "./barony-player-ai.service";
import { BaronyPlayerLocalService } from "./barony-player-local.service";
import { BaronyUiStore } from "./barony-ui.store";

interface ABaronyPlayerService {
  setupPlacement$ (playerId: string): Observable<BaronySetupPlacement>;
  turn$ (playerId: string): Observable<BaronyTurn>;
} // ABaronyPlayerService

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
      mapTo (0),
      expand (prevRoundNumber => {
        const roundNumber = prevRoundNumber + 1;
        return this.round$ (roundNumber).pipe (
          mapTo (roundNumber)
        );
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

} // BaronyGameService

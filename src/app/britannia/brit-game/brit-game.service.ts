import { Injectable } from "@angular/core";
import { BgAuthService } from "@bg-services";
import { forEach, forN } from "@bg-utils";
import { Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { ABgGameService } from "src/app/bg-services/a-bg-game.service";
import { BritNationId } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritPlayer, BritPlayerId } from "../brit-game-state.models";
import { BritRemoteService, BritStoryDoc } from "../brit-remote.service";
import { BritRulesService } from "../brit-rules/brit-rules.service";
import { BritStory } from "../brit-story.models";
import { BritGameStore } from "./brit-game.store";
import { BritPlayerAiService } from "./brit-player-ai.service";
import { BritPlayerLocalService } from "./brit-player-local.service";
import { BritPlayerService } from "./brit-player.service";
import { BritUiStore } from "./brit-ui.store";

@Injectable ()
export class BritGameService extends ABgGameService<BritPlayer, BritStory, BritPlayerService> {

  constructor (
    private rules: BritRulesService,
    private game: BritGameStore,
    private ui: BritUiStore,
    protected authService: BgAuthService,
    private remoteService: BritRemoteService,
    protected aiService: BritPlayerAiService,
    protected localService: BritPlayerLocalService,
    private components: BritComponentsService
  ) { super (); }

  protected stories: BritStoryDoc[] | null = null;

  protected getGameId () { return this.game.getGameId (); }
  protected getPlayer (playerId: string) { return this.game.getPlayer (playerId); }
  protected getGameOwner () { return this.game.getGameOwner (); }
  protected startTemporaryState () { this.game.startTemporaryState (); }
  protected endTemporaryState () { this.game.endTemporaryState (); }

  protected insertStory$<S extends BritStory> (story: S, storyId: number, gameId: string): Observable<S> {
    return this.remoteService.insertStory$ ({
      id: storyId,
      ...(story as BritStory)
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

  game$ (stories: BritStoryDoc[]): Observable<void> {
    this.stories = stories;
    this.setup ();
    return forN (16, index => this.round$ (index + 1)).pipe (
      tap (() => {
        this.ui.updateUi ("End game", s => ({
          ...s,
          ...this.ui.resetUi ()
        }));
      })
    );
  } // game$

  setup () {
    this.game.logSetup ();
    const gameSetup = this.rules.setup.getGameSetup ();
    this.game.applySetup (gameSetup);
  } // setup

  round$ (roundNumber: number): Observable<void> {
    this.game.logRound (roundNumber);
    return forEach (this.components.NATION_IDS, nationId => this.nationTurn$ (nationId));
  } // round$

  nationTurn$ (nationId: BritNationId): Observable<void> {
    if (this.rules.populationIncrease.isNationActive (nationId, this.game.get ())) {
      this.game.logNationTurn (nationId);
      const player = this.game.getPlayerByNation (nationId)!;
      return this.populationIncreasePhase$ (nationId, player.id).pipe (
        switchMap (() => this.movementPhase$ (nationId, player.id)),
        switchMap (() => this.battlesRetreatsPhase$ (nationId, player.id)),
        switchMap (() => this.raiderWithdrawalPhase$ (nationId, player.id)),
        switchMap (() => this.overpopulationPhase$ (nationId, player.id)),
      );
    } else {
      return of (void 0);
    } // if - else
  } // nationTurn$

  private populationIncreasePhase$ (nationId: BritNationId, playerId: BritPlayerId): Observable<void> {
    this.game.logPhase ("populationIncrease");
    const data = this.rules.populationIncrease.calculatePopulationIncreaseData (nationId, this.game.get ());
    if (data.nInfantries) {
      return this.executeTask$ (playerId, p => p.armiesPlacement$ (data.nInfantries, nationId, playerId)).pipe (
        map (armiesPlacement => {
          this.game.applyPopulationIncrease (data.populationMarker, armiesPlacement, nationId);
          return void 0;
        })
      );
    } else {
      this.game.applyPopulationIncrease (data.populationMarker, { infantriesPlacement: [] }, nationId);
      return of (void 0);
    } // if - else
  } // populationIncreasePhase$

  private movementPhase$ (nationId: BritNationId, playerId: BritPlayerId) {
    this.game.logPhase ("movement");
    return of (void 0);
  } // movement$

  private battlesRetreatsPhase$ (nationId: BritNationId, playerId: BritPlayerId) {
    this.game.logPhase ("battlesRetreats");
    return of (void 0);
  } // battlesRetreats$

  private raiderWithdrawalPhase$ (nationId: BritNationId, playerId: BritPlayerId) {
    this.game.logPhase ("raiderWithdrawal");
    return of (void 0);
  } // raiderWithdrawal$

  private overpopulationPhase$ (nationId: BritNationId, playerId: BritPlayerId) {
    this.game.logPhase ("overpopulation");
    return of (void 0);
  } // overpopulation$

} // BritGameService

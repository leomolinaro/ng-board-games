import { Injectable } from "@angular/core";
import { BgAuthService } from "@bg-services";
import { EMPTY, Observable, of } from "rxjs";
import { expand, last, mapTo } from "rxjs/operators";
import { ABgGameService } from "src/app/bg-services/a-bg-game.service";
import { BritPlayer, BritStory } from "../brit-models";
import { BritRemoteService, BritStoryDoc } from "../brit-remote.service";
import { BritGameStore } from "./brit-game.store";
import { BritPlayerAiService } from "./brit-player-ai.service";
import { BritPlayerLocalService } from "./brit-player-local.service";
import * as britRules from "./brit-rules";
import { BritUiStore } from "./brit-ui.store";

interface ABritPlayerService {
  // setupPlacement$ (playerId: string): Observable<BaronySetupPlacement>;
  // turn$ (playerId: string): Observable<BaronyTurn>;
} // ABritPlayerService

@Injectable ()
export class BritGameService extends ABgGameService<BritPlayer, BritStory, ABritPlayerService> {

  constructor (
    private game: BritGameStore,
    private ui: BritUiStore,
    protected authService: BgAuthService,
    private remoteService: BritRemoteService,
    protected aiService: BritPlayerAiService,
    protected localService: BritPlayerLocalService
  ) { super (); }

  protected stories: BritStoryDoc[] | null = null;

  game$ (stories: BritStoryDoc[]): Observable<void> {
    this.stories = stories;
    this.setup ();
    return this.round$ (1).pipe (
      expand (prevRoundNumber => {
        const roundNumber = prevRoundNumber + 1;
        if (roundNumber <= 16) {
          return this.round$ (roundNumber);
        } else {
          return EMPTY;
        } // if - else
      }),
      last (),
      mapTo (void 0)
    );
  } // game$

  setup () {
    const gameSetup = britRules.getGameSetup ();
    this.game.applySetup (gameSetup);
  } // setup

  round$ (roundNumber: number): Observable<number> {
    return of (roundNumber);
  } // round$

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

} // BritGameService

import { Injectable, Injector, Type, inject } from "@angular/core";
import { concatJoin } from "@leobg/commons/utils";
import { EMPTY, Observable, defer, delay, expand, from, last, map, of, switchMap, tap } from "rxjs";
import { WotrActionDie, WotrActionToken } from "../wotr-elements/wotr-dice.models";
import { WotrFrontId, oppositeFront } from "../wotr-elements/wotr-front.models";
import { WotrGameStore } from "../wotr-elements/wotr-game.store";
import { WotrRulesService } from "../wotr-rules/wotr-rules.service";
import { WotrAction, WotrStory } from "../wotr-story.models";
import { WotrStoryService } from "./wotr-story.service";

@Injectable ()
export class WotrFlowService {

  private store = inject (WotrGameStore);
  private rules = inject (WotrRulesService);
  private story = inject (WotrStoryService);
  private injector = inject (Injector);

  game$ (): Observable<unknown> {
    this.setup ();
    let roundNumber = 0;
    return this.round$ (++roundNumber).pipe (
      expand (continueGame => {
        if (continueGame) { return this.round$ (++roundNumber); }
        this.store.logEndGame ();
        return EMPTY;
      }),
      last (),
    );
  }

  setup () {
    const gameSetup = this.rules.setup.getGameSetup ();
    this.store.logSetup ();
    this.store.applySetup (gameSetup);
  }

  round$ (roundNumber: number): Observable<boolean> {
    this.store.logRound (roundNumber);
    return this.firstPhase$ ().pipe (
      switchMap (gameContinue => gameContinue ? this.fellowshipPhase$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.huntAllocation$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.actionRoll$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.actionResolution$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.victoryCheck$ (roundNumber) : of (false))
    );
  }

  private firstPhase$ () {
    this.store.logPhase (1);
    return this.story.executeTasks$ (this.store.getFrontIds ().map (
      front => ({ playerId: front, task$: p => p.firstPhaseDrawCards$ (front) })
    )).pipe (
      tap (stories => {
        this.store.getFrontIds ().forEach ((frontId, index) => {
          this.flowStory (stories[index], frontId);
        });
      })
    );
  }

  private fellowshipPhase$ () {
    this.store.logPhase (2);
    return of (true);
  }

  private huntAllocation$ () {
    this.store.logPhase (3);
    return this.story.executeTask$ ("shadow", p => p.huntAllocation$! ()).pipe (
      tap (story => {
        this.flowStory (story, "shadow");
      })
    );
  }

  private actionRoll$ () {
    this.store.logPhase (4);
    return this.story.executeTasks$ (this.store.getFrontIds ().map (
      front => ({ playerId: front, task$: p => p.rollActionDice$! (front) })
    )).pipe (
      tap (stories => {
        this.store.getFrontIds ().forEach ((frontId, index) => {
          const story = stories[index];
          this.flowStory (story, frontId);
        });
      })
    );
  }

  private actionResolution$ () {
    this.store.logPhase (5);
    return this.frontActionResolution$ ("free-peoples").pipe (
      map<unknown, WotrFrontId> (() => "free-peoples"),
      expand (lastFrontId => {
        const otherFrontId = oppositeFront (lastFrontId);
        if (this.store.hasActionDice (otherFrontId)) {
          return this.frontActionResolution$ (otherFrontId).pipe (map (() => otherFrontId));
        } else if (this.store.hasActionDice (lastFrontId)) {
          return this.frontActionResolution$ (lastFrontId).pipe (map (() => lastFrontId));
        } else {
          return EMPTY;
        }
      }),
      last ()
    );
  }

  private frontActionResolution$ (frontId: WotrFrontId) {
    return this.story.executeTask$ (frontId, p => p.actionResolution$! (frontId)).pipe (
      delay (400),
      switchMap (story => {
        console.log ("story", story)
        if (story.die) {
          return this.dieStory$ (story.die, story, frontId);
        } else if (story.token) {
          return this.tokenStory$ (story.token, story, frontId);
        } else if (story.pass) {
          this.store.logActionPass (frontId);
          return of (void 0);
        } else {
          throw new Error (`Action resolution story not expected ${story.actions[0].type}`);
        }
      })
    );
  }

  private flowStory (story: WotrStory, frontId: WotrFrontId) {
    story.actions.forEach (action => {
      this.store.logAction (action, frontId);
      this.store.applyAction (action, frontId);
    });
  }

  private dieStory$ (die: WotrActionDie, story: WotrStory, frontId: WotrFrontId) {
    story.actions.forEach (action => {
      this.store.logDieAction (action, die, frontId);
      this.store.applyAction (action, frontId);
    });
    this.store.removeActionDie (die, frontId);
    return this.actionResolutionSubFlows$ (story);
  }

  private tokenStory$ (token: WotrActionToken, story: WotrStory, frontId: WotrFrontId) {
    story.actions.forEach (action => {
      this.store.logTokenAction (action, token, frontId);
      this.store.applyAction (action, frontId);
    });
    this.store.removeActionToken (token, frontId);
    return this.actionResolutionSubFlows$ (story);
  }

  private actionResolutionSubFlows$ (story: WotrStory): Observable<unknown> {
    return concatJoin (story.actions.map (action => this.actionResolutionSubFlow$ (action, story)));
  }

  private actionResolutionSubFlow$ (action: WotrAction, story: WotrStory): Observable<unknown> {
    switch (action.type) {
      case "fellowship-progress": return from (
        import ("./wotr-subflows/wotr-fellowship-progress-flow.service")
        .then ((m) => new m.WotrFellowshipProgressFlow (this.store, this.rules, this.story))
      ).pipe (switchMap (subFlow => subFlow.execute$ (action, story)));
    }
    return of (void 0);
  }

  private lazyService<T> (loader: () => Promise<Type<T>>): Observable<T> {
    return defer (() => loader ().then ((service) => this.injector.get (service, undefined, {  })));
  }

  private victoryCheck$ (roundNumber: number) {
    this.store.logPhase (6);
    return of (roundNumber < 6);
  }

}

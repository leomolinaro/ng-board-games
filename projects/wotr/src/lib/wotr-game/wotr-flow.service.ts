import { Injectable, Injector, Type, inject } from "@angular/core";
import { concatJoin } from "@leobg/commons/utils";
import { EMPTY, Observable, defer, delay, expand, from, last, map, of, switchMap, tap } from "rxjs";
import { WotrGameActionsService } from "../wotr-actions/wotr-game-actions.service";
import { WotrCompanionStore } from "../wotr-elements/wotr-companion.store";
import { WotrActionDie, WotrActionToken } from "../wotr-elements/wotr-dice.models";
import { WotrFellowshipStore } from "../wotr-elements/wotr-fellowship.store";
import { WotrFrontId, oppositeFront } from "../wotr-elements/wotr-front.models";
import { WotrFrontStore } from "../wotr-elements/wotr-front.store";
import { WotrHuntStore } from "../wotr-elements/wotr-hunt.store";
import { WotrLogStore } from "../wotr-elements/wotr-log.store";
import { WotrMinionStore } from "../wotr-elements/wotr-minion.store";
import { WotrNationStore } from "../wotr-elements/wotr-nation.store";
import { WotrRegionStore } from "../wotr-elements/wotr-region.store";
import { WotrRulesService } from "../wotr-rules/wotr-rules.service";
import { WotrSetup } from "../wotr-rules/wotr-setup-rules.service";
import { WotrAction, WotrStory } from "../wotr-story.models";
import { WotrStoryService } from "./wotr-story.service";

@Injectable ()
export class WotrFlowService {

  private frontStore = inject (WotrFrontStore);
  private logStore = inject (WotrLogStore);
  private regionStore = inject (WotrRegionStore);
  private nationStore = inject (WotrNationStore);
  private companionStore = inject (WotrCompanionStore);
  private minionStore = inject (WotrMinionStore);
  private fellowshipStore = inject (WotrFellowshipStore);
  private huntStore = inject (WotrHuntStore);

  private gameActions = inject (WotrGameActionsService);
  private rules = inject (WotrRulesService);
  private story = inject (WotrStoryService);
  private injector = inject (Injector);

  game$ (): Observable<unknown> {
    this.setup ();
    let roundNumber = 0;
    return this.round$ (++roundNumber).pipe (
      expand (continueGame => {
        if (continueGame) { return this.round$ (++roundNumber); }
        this.logStore.logEndGame ();
        return EMPTY;
      }),
      last (),
    );
  }

  setup () {
    const gameSetup = this.rules.setup.getGameSetup ();
    this.logStore.logSetup ();
    this.applySetup (gameSetup);
  }

  private applySetup (setup: WotrSetup) {
    for (const d of setup.decks) {
      this.frontStore.setCharacterDeck (d.characterDeck, d.front);
      this.frontStore.setStrategyDeck (d.strategyDeck, d.front);
    }
    for (const r of setup.regions) {
      const frontId = this.nationStore.nation (r.nation).front;
      if (r.nRegulars) {
        this.nationStore.removeRegularsFromReinforcements (r.nRegulars, r.nation);
        this.regionStore.addRegularsToRegion (r.nation, frontId, r.nRegulars, r.region);
      }
      if (r.nElites) {
        this.nationStore.removeElitesFromReinforcements (r.nElites, r.nation);
        this.regionStore.addElitesToRegion (r.nation, frontId, r.nElites, r.region);
      }
      if (r.nLeaders) {
        this.nationStore.removeLeadersFromReinforcements (r.nLeaders, r.nation);
        this.regionStore.addLeadersToRegion (r.nation, r.nLeaders, r.region);
      }
      if (r.nNazgul) {
        this.nationStore.removeNazgulFromReinforcements (r.nNazgul);
        this.regionStore.addNazgulToRegion (r.nNazgul, r.region);
      }
    }
    for (const nationSetup of setup.nations) {
      this.nationStore.setActive (nationSetup.active, nationSetup.nation);
      this.nationStore.setPoliticalStep (nationSetup.politicalStep, nationSetup.nation);
    }
    this.frontStore.setActionTokens (setup.freePeopleTokens, "free-peoples");
    this.frontStore.setActionTokens (setup.shadowTokens, "shadow");
    this.fellowshipStore.setCompanions (setup.fellowship.companions);
    this.fellowshipStore.setGuide (setup.fellowship.guide);
    this.regionStore.addFellowshipToRegion (setup.fellowship.region);
  }

  round$ (roundNumber: number): Observable<boolean> {
    this.logStore.logRound (roundNumber);
    return this.firstPhase$ ().pipe (
      switchMap (gameContinue => gameContinue ? this.fellowshipPhase$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.huntAllocation$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.actionRoll$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.actionResolution$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.victoryCheck$ (roundNumber) : of (false))
    );
  }

  private firstPhase$ () {
    this.logStore.logPhase (1);
    return this.story.executeTasks$ (this.frontStore.frontIds ().map (
      front => ({ playerId: front, task$: p => p.firstPhaseDrawCards$ (front) })
    )).pipe (
      tap (stories => {
        this.frontStore.frontIds ().forEach ((frontId, index) => {
          this.flowStory (stories[index], frontId);
        });
      })
    );
  }

  private fellowshipPhase$ () {
    this.logStore.logPhase (2);
    return of (true);
  }

  private huntAllocation$ () {
    this.logStore.logPhase (3);
    return this.story.executeTask$ ("shadow", p => p.huntAllocation$! ()).pipe (
      tap (story => {
        this.flowStory (story, "shadow");
      })
    );
  }

  private actionRoll$ () {
    this.logStore.logPhase (4);
    return this.story.executeTasks$ (this.frontStore.frontIds ().map (
      front => ({ playerId: front, task$: p => p.rollActionDice$! (front) })
    )).pipe (
      tap (stories => {
        this.frontStore.frontIds ().forEach ((frontId, index) => {
          const story = stories[index];
          const action = story.actions[0];
          if (action?.type !== "action-roll") { throw new Error ("Unexpected story"); }
          this.flowStory (story, frontId);
          if (frontId === "shadow") {
            this.eyeResultsToHuntBox ();
          }
        });
      })
    );
  }

  private eyeResultsToHuntBox () {
    const nEyeResults = this.frontStore.shadowFront ().actionDice.reduce ((counter, die) => {
      if (die === "eye") { counter++; }
      return counter;
    }, 0);
    this.frontStore.removeAllEyeResults ("shadow");
    this.huntStore.setHuntDice (nEyeResults);
  }

  private actionResolution$ () {
    this.logStore.logPhase (5);
    return this.frontActionResolution$ ("free-peoples").pipe (
      map<unknown, WotrFrontId> (() => "free-peoples"),
      expand (lastFrontId => {
        const otherFrontId = oppositeFront (lastFrontId);
        if (this.frontStore.hasActionDice (otherFrontId) || this.frontStore.hasActionTokens (otherFrontId)) {
          return this.frontActionResolution$ (otherFrontId).pipe (map (() => otherFrontId));
        } else if (this.frontStore.hasActionDice (lastFrontId) || this.frontStore.hasActionTokens (lastFrontId)) {
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
          this.logStore.logActionPass (frontId);
          return of (void 0);
        } else {
          throw new Error (`Action resolution story not expected ${story.actions[0].type}`);
        }
      })
    );
  }

  private flowStory (story: WotrStory, frontId: WotrFrontId) {
    story.actions.forEach (action => {
      this.logStore.logAction (action, frontId);
      this.gameActions.applyAction (action, frontId);
    });
  }

  private dieStory$ (die: WotrActionDie, story: WotrStory, frontId: WotrFrontId) {
    story.actions.forEach (action => {
      this.logStore.logDieAction (action, die, frontId);
      this.gameActions.applyAction (action, frontId);
    });
    this.frontStore.removeActionDie (die, frontId);
    return this.actionResolutionSubFlows$ (story);
  }

  private tokenStory$ (token: WotrActionToken, story: WotrStory, frontId: WotrFrontId) {
    story.actions.forEach (action => {
      this.logStore.logTokenAction (action, token, frontId);
      this.gameActions.applyAction (action, frontId);
    });
    this.frontStore.removeActionToken (token, frontId);
    return this.actionResolutionSubFlows$ (story);
  }

  private actionResolutionSubFlows$ (story: WotrStory): Observable<unknown> {
    return concatJoin (story.actions.map (action => this.actionResolutionSubFlow$ (action, story)));
  }

  private actionResolutionSubFlow$ (action: WotrAction, story: WotrStory): Observable<unknown> {
    switch (action.type) {
      case "fellowship-progress": return from (
        import ("./wotr-subflows/wotr-fellowship-progress-flow.service")
        .then ((m) => new m.WotrFellowshipProgressFlow (this.huntStore, this.logStore, this.gameActions, this.rules, this.story))
      ).pipe (switchMap (subFlow => subFlow.execute$ (action, story)));
    }
    return of (void 0);
  }

  private lazyService<T> (loader: () => Promise<Type<T>>): Observable<T> {
    return defer (() => loader ().then ((service) => this.injector.get (service, undefined, {  })));
  }

  private victoryCheck$ (roundNumber: number) {
    this.logStore.logPhase (6);
    return of (roundNumber < 6);
  }

}

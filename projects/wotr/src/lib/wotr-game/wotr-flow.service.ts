import { Injectable, Injector, inject } from "@angular/core";
import { concatJoin } from "@leobg/commons/utils";
import { EMPTY, Observable, expand, from, last, map, of, switchMap, tap } from "rxjs";
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
import { WotrUnexpectedStory } from "./wotr-unexpected-story";

type WotrActionResolution = "die" | "token" | "pass" | "skipTokens";

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
    for (const companion of setup.fellowship.companions) {
      this.companionStore.setInFellowship (companion);
    }
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
    this.huntStore.resetHuntBox ();
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
        console.log ("story", story);
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
        console.log ("stories", stories);
        this.frontStore.frontIds ().forEach ((frontId, index) => {
          const story = stories[index];
          const action = story.actions[0];
          if (action?.type !== "action-roll") { throw new WotrUnexpectedStory (story); }
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
    this.huntStore.addHuntDice (nEyeResults);
  }

  private actionResolution$ (): Observable<boolean> {
    this.logStore.logPhase (5);
    let frontId: WotrFrontId | null = "free-peoples";
    return this.frontActionResolution$ (frontId).pipe (
      expand (resolution => {
        frontId = this.getNextResolutionFrontId (frontId!, resolution);
        if (!frontId) { return EMPTY; }
        return this.frontActionResolution$ (frontId);
      }),
      last (),
      map (() => true)
    );
  }

  private getNextResolutionFrontId (frontId: WotrFrontId, resolution: WotrActionResolution): WotrFrontId | null {
    const otherFrontId = oppositeFront (frontId);
    if (this.frontStore.hasActionDice (otherFrontId)) { return otherFrontId; }
    if (this.frontStore.hasActionTokens (otherFrontId) && resolution !== "skipTokens") { return otherFrontId; }
    if (this.frontStore.hasActionDice (frontId)) { return frontId; }
    if (this.frontStore.hasActionTokens (frontId) && resolution !== "skipTokens") { return frontId; }
    return null;
  }

  private frontActionResolution$ (frontId: WotrFrontId): Observable<WotrActionResolution> {
    return this.story.executeTask$ (frontId, p => p.actionResolution$! (frontId)).pipe (
      switchMap (story => {
        if (story.die) {
          return this.dieStory$ (story.die, story, frontId).pipe (map<unknown, "die"> (() => "die"));
        } else if (story.token) {
          return this.tokenStory$ (story.token, story, frontId).pipe (map<unknown, "token"> (() => "token"));
        } else if (story.pass) {
          this.logStore.logActionPass (frontId);
          return of<"pass"> ("pass");
        } else if (story.skipTokens) {
          this.logStore.logSkipTokens (frontId);
          return of<"skipTokens"> ("skipTokens");
        } else {
          throw new WotrUnexpectedStory (story);
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
        .then ((m) => new m.WotrFellowshipProgressFlow (this.huntStore, this.companionStore, this.frontStore, this.logStore, this.gameActions, this.rules, this.story))
      ).pipe (switchMap (subFlow => subFlow.execute$ (action, story)));
    }
    return of (void 0);
  }

  private victoryCheck$ (roundNumber: number) {
    this.logStore.logPhase (6);
    return of (roundNumber < 6);
  }

}

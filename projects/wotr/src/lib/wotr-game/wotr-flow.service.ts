import { Injectable, inject } from "@angular/core";
import { WotrGameActionsService } from "../wotr-actions/wotr-game-actions.service";
import { WotrCompanionStore } from "../wotr-elements/companion/wotr-companion.store";
import { WotrFellowshipStore } from "../wotr-elements/fellowship/wotr-fellowship.store";
import { WotrFrontId, oppositeFront } from "../wotr-elements/front/wotr-front.models";
import { WotrFrontStore } from "../wotr-elements/front/wotr-front.store";
import { WotrHuntStore } from "../wotr-elements/hunt/wotr-hunt.store";
import { WotrLogStore } from "../wotr-elements/log/wotr-log.store";
import { WotrMinionStore } from "../wotr-elements/minion/wotr-minion.store";
import { WotrNationStore } from "../wotr-elements/nation/wotr-nation.store";
import { WotrRegionStore } from "../wotr-elements/region/wotr-region.store";
import { WotrRulesService } from "../wotr-rules/wotr-rules.service";
import { WotrSetup } from "../wotr-rules/wotr-setup-rules.service";
import { WotrStoryService } from "./wotr-story.service";
import { WotrUnexpectedStory } from "./wotr-unexpected-story";

type WotrActionResolution = "die" | "dieCard" | "token" | "pass" | "skipTokens";

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

  async game () {
    this.setup ();
    let roundNumber = 0;
    let continueGame = await this.round (++roundNumber);
    while (continueGame) {
      continueGame = await this.round (++roundNumber);
    }
    this.logStore.logEndGame ();
  }

  private setup () {
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

  private async round (roundNumber: number) {
    this.logStore.logRound (roundNumber);
    let continueGame = await this.firstPhase ();
    if (!continueGame) { return false; }
    continueGame = await this.fellowshipPhase ();
    if (!continueGame) { return false; }
    continueGame = await this.huntAllocation ();
    if (!continueGame) { return false; }
    continueGame = await this.actionRoll ();
    if (!continueGame) { return false; }
    continueGame = await this.actionResolution ();
    if (!continueGame) { return false; }
    continueGame = await this.victoryCheck (roundNumber);
    if (!continueGame) { return false; }
    return true;
  }

  private async firstPhase () {
    this.logStore.logPhase (1);
    this.huntStore.resetHuntBox ();
    const stories = await this.story.executeTasks (this.frontStore.frontIds ().map (
      front => ({ playerId: front, task: p => p.firstPhaseDrawCards! (front) })
    ));
    let index = 0;
    for (const frontId of this.frontStore.frontIds ()) {
      await this.gameActions.applyStory (stories[index++], frontId);
    }
    return true;
  }

  private async fellowshipPhase () {
    this.logStore.logPhase (2);
    const story = await this.story.executeTask ("free-peoples", p => p.fellowshipDeclaration! ());
    await this.gameActions.applyStory (story, "shadow");
    return true;
  }

  private async huntAllocation () {
    this.logStore.logPhase (3);
    const story = await this.story.executeTask ("shadow", p => p.huntAllocation! ());
    await this.gameActions.applyStory (story, "shadow");
    return true;
  }

  private async actionRoll () {
    this.logStore.logPhase (4);
    const stories = await this.story.executeTasks (this.frontStore.frontIds ().map (
      front => ({ playerId: front, task: p => p.rollActionDice! (front) })
    ));
    let index = 0;
    for (const frontId of this.frontStore.frontIds ()) {
      const story = stories[index++];
      const action = story.actions[0];
      if (action?.type !== "action-roll") { throw new WotrUnexpectedStory (story); }
      await this.gameActions.applyStory (story, frontId);
      if (frontId === "shadow") {
        this.eyeResultsToHuntBox ();
      }
    }
    return true;
  }

  private eyeResultsToHuntBox () {
    const nEyeResults = this.frontStore.shadowFront ().actionDice.reduce ((counter, die) => {
      if (die === "eye") { counter++; }
      return counter;
    }, 0);
    this.frontStore.removeAllEyeResults ("shadow");
    this.huntStore.addHuntDice (nEyeResults);
  }

  private async actionResolution () {
    this.logStore.logPhase (5);
    let frontId: WotrFrontId | null = "free-peoples";
    do {
      const resolution = await this.frontActionResolution (frontId);
      frontId = this.getNextResolutionFrontId (frontId, resolution);
    } while (frontId);
    return true;
  }

  private getNextResolutionFrontId (frontId: WotrFrontId, resolution: WotrActionResolution): WotrFrontId | null {
    const otherFrontId = oppositeFront (frontId);
    if (this.frontStore.hasActionDice (otherFrontId)) { return otherFrontId; }
    if (this.frontStore.hasActionTokens (otherFrontId) && resolution !== "skipTokens") { return otherFrontId; }
    if (this.frontStore.hasActionDice (frontId)) { return frontId; }
    if (this.frontStore.hasActionTokens (frontId) && resolution !== "skipTokens") { return frontId; }
    return null;
  }

  private async frontActionResolution (frontId: WotrFrontId): Promise<WotrActionResolution> {
    const story = await this.story.executeTask (frontId, p => p.actionResolution! (frontId));
    if (story.die) {
      if (story.card) {
        await this.gameActions.applyDieCardStory (story.die, story.card, story, frontId);
        return "dieCard";
      } else {
        await this.gameActions.applyDieStory (story.die, story, frontId);
        return "die";
      }
    } else if (story.token) {
      await this.gameActions.applyTokenStory (story.token, story, frontId);
      return "token";
    } else if (story.pass) {
      this.logStore.logActionPass (frontId);
      return "pass";
    } else if (story.skipTokens) {
      this.logStore.logSkipTokens (frontId);
      return "skipTokens";
    } else {
      throw new WotrUnexpectedStory (story);
    }
  }

  private async victoryCheck (roundNumber: number) {
    this.logStore.logPhase (6);
    return roundNumber < 6;
  }

}

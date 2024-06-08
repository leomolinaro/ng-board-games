import { Injectable, inject } from "@angular/core";
import { WotrCharacterStore } from "../companion/wotr-character.store";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrFrontId, oppositeFront } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrSetup, WotrSetupRulesService } from "../setup/wotr-setup-rules.service";
import { WotrStory } from "./wotr-story.models";
import { WotrStoryService } from "./wotr-story.service";

@Injectable ()
export class WotrGameFlowService {

  private frontStore = inject (WotrFrontStore);
  private logStore = inject (WotrLogStore);
  private regionStore = inject (WotrRegionStore);
  private nationStore = inject (WotrNationStore);
  private companionStore = inject (WotrCharacterStore);
  private fellowshipStore = inject (WotrFellowshipStore);
  private huntStore = inject (WotrHuntStore);

  private story = inject (WotrStoryService);
  private setupService = inject (WotrSetupRulesService);

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
    const gameSetup = this.setupService.getGameSetup ();
    this.logStore.logSetup ();
    this.applySetup (gameSetup);
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
    await this.story.firstPhaseDrawCards ();
    return true;
  }

  private async fellowshipPhase () {
    this.logStore.logPhase (2);
    if (!this.fellowshipStore.isRevealed ()) {
      await this.story.wantDeclareFellowship ("free-peoples");
    }
    return true;
  }

  private async huntAllocation () {
    this.logStore.logPhase (3);
    await this.story.huntAllocation ("shadow");
    return true;
  }

  private async actionRoll () {
    this.logStore.logPhase (4);
    await this.story.rollActionDice ();
    this.eyeResultsToHuntBox ();
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
    let front: WotrFrontId | null = "free-peoples";
    do {
      const story = await this.story.actionResolution (front);
      front = this.getNextResolutionFrontId (front, story);
    } while (front);
    return true;
  }

  private async victoryCheck (roundNumber: number) {
    this.logStore.logPhase (6);
    return true;
  }

  private getNextResolutionFrontId (frontId: WotrFrontId, story: WotrStory): WotrFrontId | null {
    const otherFrontId = oppositeFront (frontId);
    if (this.frontStore.hasActionDice (otherFrontId)) { return otherFrontId; }
    if (this.frontStore.hasActionTokens (otherFrontId) && story.type !== "token-skip") { return otherFrontId; }
    if (this.frontStore.hasActionDice (frontId)) { return frontId; }
    if (this.frontStore.hasActionTokens (frontId) && story.type !== "token-skip") { return frontId; }
    return null;
  }

  private applySetup (setup: WotrSetup) {
    for (const d of setup.decks) {
      this.frontStore.setCharacterDeck (d.characterDeck, d.front);
      this.frontStore.setStrategyDeck (d.strategyDeck, d.front);
    }
    for (const r of setup.regions) {
      if (r.nRegulars) {
        this.nationStore.removeRegularsFromReinforcements (r.nRegulars, r.nation);
        this.regionStore.addRegularsToArmy (r.nRegulars, r.nation, r.region);
      }
      if (r.nElites) {
        this.nationStore.removeElitesFromReinforcements (r.nElites, r.nation);
        this.regionStore.addElitesToArmy (r.nElites, r.nation, r.region);
      }
      if (r.nLeaders) {
        this.nationStore.removeLeadersFromReinforcements (r.nLeaders, r.nation);
        this.regionStore.addLeadersToArmy (r.nLeaders, r.nation, r.region);
      }
      if (r.nNazgul) {
        this.nationStore.removeNazgulFromReinforcements (r.nNazgul);
        this.regionStore.addNazgulToArmy (r.nNazgul, r.region);
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

}

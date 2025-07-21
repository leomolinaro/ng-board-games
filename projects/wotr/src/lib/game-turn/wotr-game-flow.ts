import { Injectable, inject } from "@angular/core";
import { unexpectedStory } from "@leobg/commons";
import { WotrCharacterStore } from "../character/wotr-character-store";
import { WotrStoryApplier } from "../commons/wotr-action-models";
import { WotrActionService } from "../commons/wotr-action-service";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { oppositeFront } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";
import {
  WotrDieCardStory,
  WotrDieStory,
  WotrGameStory,
  WotrPassStory,
  WotrPhaseStory,
  WotrSkipTokensStory,
  WotrTokenStory
} from "../game/wotr-story-models";
import { WotrHuntStore } from "../hunt/wotr-hunt-store";
import { WotrLogStore } from "../log/wotr-log-store";
import { WotrNationStore } from "../nation/wotr-nation-store";
import { WotrAllPlayers } from "../player/wotr-all-players";
import { WotrFreePeoplesPlayer } from "../player/wotr-free-peoples-player";
import { WotrPlayer } from "../player/wotr-player";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrSetup, WotrSetupRules } from "../setup/wotr-setup-rules";

@Injectable({ providedIn: "root" })
export class WotrGameTurn {
  private frontStore = inject(WotrFrontStore);
  private logStore = inject(WotrLogStore);
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);
  private companionStore = inject(WotrCharacterStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private huntStore = inject(WotrHuntStore);
  private actionService = inject(WotrActionService);

  private allPlayers = inject(WotrAllPlayers);
  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);

  private setupService = inject(WotrSetupRules);

  init() {
    this.actionService.registerStory("phase", this.phaseStory);
  }

  private phaseStory: WotrStoryApplier<WotrPhaseStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logStore.logAction(action, story, front, "battle");
      await this.actionService.applyAction(action, front);
    }
  };

  async game() {
    this.setup();
    let roundNumber = 0;
    let continueGame = await this.round(++roundNumber);
    while (continueGame) {
      continueGame = await this.round(++roundNumber);
    }
    this.logStore.logEndGame();
  }

  private setup() {
    const gameSetup = this.setupService.getGameSetup();
    this.logStore.logSetup();
    this.applySetup(gameSetup);
  }

  private async round(roundNumber: number) {
    this.logStore.logRound(roundNumber);
    let continueGame = await this.firstPhase();
    if (!continueGame) {
      return false;
    }
    continueGame = await this.fellowshipPhase();
    if (!continueGame) {
      return false;
    }
    continueGame = await this.huntAllocation();
    if (!continueGame) {
      return false;
    }
    continueGame = await this.actionRoll();
    if (!continueGame) {
      return false;
    }
    continueGame = await this.actionResolution();
    if (!continueGame) {
      return false;
    }
    continueGame = await this.victoryCheck(roundNumber);
    if (!continueGame) {
      return false;
    }
    return true;
  }

  private async firstPhase() {
    this.logStore.logPhase(1);
    this.huntStore.resetHuntBox();
    await this.allPlayers.firstPhase();
    return true;
  }

  private async fellowshipPhase() {
    this.logStore.logPhase(2);
    if (!this.fellowshipStore.isRevealed()) {
      await this.freePeoples.fellowshipPhase();
    }
    this.checkMoveToMordorTrack();
    return true;
  }

  private checkMoveToMordorTrack() {
    const fellowshipRegion = this.regionStore.fellowshipRegion();
    if (fellowshipRegion === "morannon" || fellowshipRegion === "minas-morgul") {
      this.regionStore.removeFellowshipFromRegion();
      this.fellowshipStore.moveOnMordorTrack();
      this.huntStore.moveDrawnEyeTilesToAvailable();
      this.huntStore.moveReadyTilesToAvailable();
    }
  }

  private async huntAllocation() {
    this.logStore.logPhase(3);
    await this.shadow.huntAllocationPhase();
    return true;
  }

  private async actionRoll() {
    this.logStore.logPhase(4);
    await this.rollActionDice();
    this.eyeResultsToHuntBox();
    return true;
  }

  private eyeResultsToHuntBox() {
    const nEyeResults = this.frontStore.shadowFront().actionDice.reduce((counter, die) => {
      if (die === "eye") {
        counter++;
      }
      return counter;
    }, 0);
    this.frontStore.removeAllEyeResults("shadow");
    this.huntStore.addHuntDice(nEyeResults);
  }

  private async actionResolution() {
    this.logStore.logPhase(5);
    let player: WotrPlayer | null = this.freePeoples;
    do {
      const story = await this.chooseAction(player);
      player = this.getNextResolutionFrontId(player, story);
    } while (player);
    return true;
  }

  async chooseAction(
    player: WotrPlayer
  ): Promise<
    WotrDieStory | WotrTokenStory | WotrDieCardStory | WotrPassStory | WotrSkipTokensStory
  > {
    const story = await player.actionResolution();
    switch (story.type) {
      case "die":
      case "die-card":
      case "die-pass":
      case "token":
      case "token-skip":
        return story;
      default:
        throw unexpectedStory(story, "die or token");
    }
  }

  private async victoryCheck(roundNumber: number) {
    this.logStore.logPhase(6);
    const shadow = this.frontStore.shadowFront();
    if (shadow.victoryPoints >= 10) {
      return false;
    }
    const freePeoples = this.frontStore.freePeoplesFront();
    if (freePeoples.victoryPoints >= 4) {
      return false;
    }
    return true;
  }

  private getNextResolutionFrontId(player: WotrPlayer, story: WotrGameStory): WotrPlayer | null {
    const otherPlayer =
      oppositeFront(player.frontId) === "free-peoples" ? this.freePeoples : this.shadow;
    if (this.frontStore.hasActionDice(otherPlayer.frontId)) {
      return otherPlayer;
    }
    if (this.frontStore.hasActionTokens(otherPlayer.frontId) && story.type !== "token-skip") {
      return otherPlayer;
    }
    if (this.frontStore.hasActionDice(player.frontId)) {
      return player;
    }
    if (this.frontStore.hasActionTokens(player.frontId) && story.type !== "token-skip") {
      return player;
    }
    return null;
  }

  async rollActionDice(): Promise<void> {
    await this.allPlayers.rollActionDice();
  }

  private applySetup(setup: WotrSetup) {
    for (const d of setup.decks) {
      this.frontStore.setCharacterDeck(d.characterDeck, d.front);
      this.frontStore.setStrategyDeck(d.strategyDeck, d.front);
    }
    for (const r of setup.regions) {
      if (r.nRegulars) {
        this.nationStore.removeRegularsFromReinforcements(r.nRegulars, r.nation);
        this.regionStore.addRegularsToArmy(r.nRegulars, r.nation, r.region);
      }
      if (r.nElites) {
        this.nationStore.removeElitesFromReinforcements(r.nElites, r.nation);
        this.regionStore.addElitesToArmy(r.nElites, r.nation, r.region);
      }
      if (r.nLeaders) {
        this.nationStore.removeLeadersFromReinforcements(r.nLeaders, r.nation);
        this.regionStore.addLeadersToArmy(r.nLeaders, r.nation, r.region);
      }
      if (r.nNazgul) {
        this.nationStore.removeNazgulFromReinforcements(r.nNazgul);
        this.regionStore.addNazgulToArmy(r.nNazgul, r.region);
      }
    }
    this.frontStore.setActionTokens(setup.freePeopleTokens, "free-peoples");
    this.frontStore.setActionTokens(setup.shadowTokens, "shadow");
    this.fellowshipStore.setCompanions(setup.fellowship.companions);
    for (const companion of setup.fellowship.companions) {
      this.companionStore.setInFellowship(companion);
    }
    this.fellowshipStore.setGuide(setup.fellowship.guide);
    this.regionStore.addFellowshipToRegion(setup.fellowship.region);
  }
}

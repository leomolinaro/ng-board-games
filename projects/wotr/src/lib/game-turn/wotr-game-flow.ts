import { Injectable, inject } from "@angular/core";
import { unexpectedStory } from "@leobg/commons";
import { WotrActionDieModifiers } from "../action-die/wotr-action-die-modifiers";
import { WotrCharacterAbilities } from "../character/wotr-characters";
import { WotrStoryApplier } from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFellowshipHandler } from "../fellowship/wotr-fellowship-handler";
import { WotrRingDestroyed } from "../fellowship/wotr-fellowship-models";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { oppositeFront } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";
import { WotrGameConfig } from "../game/wotr-game-config";
import { WotrGameQuery } from "../game/wotr-game-query";
import {
  WotrBaseStory,
  WotrDieCardStory,
  WotrDieStory,
  WotrPassStory,
  WotrSkipTokensStory,
  WotrStory,
  WotrTokenStory
} from "../game/wotr-story-models";
import { WotrRingBearerCorrupted } from "../hunt/wotr-hunt-models";
import { WotrHuntStore } from "../hunt/wotr-hunt-store";
import { WotrLogWriter } from "../log/wotr-log-writer";
import { WotrNationStore } from "../nation/wotr-nation-store";
import { WotrAllPlayers } from "../player/wotr-all-players";
import { WotrFreePeoplesPlayer } from "../player/wotr-free-peoples-player";
import { WotrPlayer } from "../player/wotr-player";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrSetup, WotrSetupRules } from "../setup/wotr-setup-rules";

@Injectable()
export class WotrGameFlow {
  private frontStore = inject(WotrFrontStore);
  private logger = inject(WotrLogWriter);
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private huntStore = inject(WotrHuntStore);
  private actionRegistry = inject(WotrActionRegistry);
  private characterAbilities = inject(WotrCharacterAbilities);
  private q = inject(WotrGameQuery);
  private fellowshipHandler = inject(WotrFellowshipHandler);

  private allPlayers = inject(WotrAllPlayers);
  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);

  private actionDieModifiers = inject(WotrActionDieModifiers);

  private setupService = inject(WotrSetupRules);

  init() {
    this.actionRegistry.registerStory("base", this.baseStory);
  }

  private baseStory: WotrStoryApplier<WotrBaseStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logger.logAction(action, story, front);
      await this.actionRegistry.applyAction(action, front);
    }
  };

  async game(config: WotrGameConfig) {
    this.setup(config);
    try {
      let roundNumber = 0;
      let continueGame = await this.round(++roundNumber);
      while (continueGame) {
        continueGame = await this.round(++roundNumber);
      }
    } catch (error) {
      if (error instanceof WotrRingDestroyed) {
      } else if (error instanceof WotrRingBearerCorrupted) {
      } else {
        throw error;
      }
    }
    this.logger.logEndGame();
  }

  private setup(config: WotrGameConfig) {
    const gameSetup = this.setupService.getGameSetup(config);
    this.logger.logSetup();
    this.applySetup(gameSetup);
    this.characterAbilities.activateAbilities(this.fellowshipStore.companions());
  }

  private async round(roundNumber: number) {
    this.logger.logRound(roundNumber);
    let continueGame = await this.firstPhase();
    if (!continueGame) return false;
    continueGame = await this.fellowshipPhase();
    if (!continueGame) return false;
    continueGame = await this.huntAllocation();
    if (!continueGame) return false;
    continueGame = await this.actionRoll();
    if (!continueGame) return false;
    continueGame = await this.actionResolution();
    if (!continueGame) return false;
    continueGame = await this.victoryCheck(roundNumber);
    if (!continueGame) return false;
    return true;
  }

  private async firstPhase() {
    this.logger.logPhase(1);
    this.huntStore.resetHuntBox();
    this.frontStore.resetElvenRingUsed("free-peoples");
    this.frontStore.resetElvenRingUsed("shadow");
    this.q.resetMessengerOfTheDarkTower();
    this.fellowshipStore.resetMoveOrHideAttempt();
    this.frontStore.skipDiscardExcessCards(true);
    await this.allPlayers.firstPhaseDraw();
    await this.checkFirstPhaseDiscard();
    this.frontStore.skipDiscardExcessCards(false);
    return true;
  }

  private async checkFirstPhaseDiscard() {
    const players: WotrPlayer[] = [];
    if (this.q.freePeoples.hasExcessCards()) {
      players.push(this.freePeoples);
    }
    if (this.q.shadow.hasExcessCards()) {
      players.push(this.shadow);
    }
    if (players.length === 1) {
      await players[0].firstPhaseDiscard();
    } else if (players.length === 2) {
      await this.allPlayers.firstPhaseDiscard();
    }
  }

  private async fellowshipPhase() {
    this.logger.logPhase(2);
    await this.freePeoples.fellowshipPhase();
    this.checkMoveToMordorTrack();
    return true;
  }

  private checkMoveToMordorTrack() {
    const fellowshipRegion = this.regionStore.fellowshipRegion();
    if (fellowshipRegion === "morannon" || fellowshipRegion === "minas-morgul") {
      this.regionStore.removeFellowshipFromRegion();
      this.fellowshipStore.moveOnMordorTrack();
      this.huntStore.moveDrawnEyeTilesToAvailable();
      this.huntStore.moveReadyTilesToPool();
    }
  }

  private async huntAllocation() {
    this.logger.logPhase(3);
    await this.shadow.huntAllocationPhase();
    return true;
  }

  private async actionRoll() {
    this.logger.logPhase(4);
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
    this.logger.logPhase(5);
    let player: WotrPlayer | null = this.freePeoples;
    do {
      const story = await this.chooseAction(player);
      player = this.getNextResolutionFrontId(player, story);
    } while (player);
    this.fellowshipHandler.checkFellowshipMovingInMordor();
    return true;
  }

  private async chooseAction(
    player: WotrPlayer
  ): Promise<
    WotrDieStory | WotrTokenStory | WotrDieCardStory | WotrPassStory | WotrSkipTokensStory
  > {
    const story = await player.actionResolution();
    switch (story.type) {
      case "die":
        await this.actionDieModifiers.onAfterActionDieResolution(story, player.frontId);
        return story;
      case "die-card":
        await this.actionDieModifiers.onAfterActionDieCardResolution(story, player.frontId);
        return story;
      case "die-pass":
      case "token":
      case "token-skip":
        return story;
      default:
        throw unexpectedStory(story, "die or token");
    }
  }

  private async victoryCheck(roundNumber: number) {
    this.logger.logPhase(6);
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

  private getNextResolutionFrontId(player: WotrPlayer, story: WotrStory): WotrPlayer | null {
    const otherPlayer =
      oppositeFront(player.frontId) === "free-peoples" ? this.freePeoples : this.shadow;
    const otherFrontQ = this.q.front(otherPlayer.frontId);
    if (otherFrontQ.hasActionDice()) return otherPlayer;
    if (otherFrontQ.hasActionTokens() && story.type !== "token-skip") return otherPlayer;
    const frontQ = this.q.front(player.frontId);
    if (frontQ.hasActionDice()) return player;
    if (frontQ.hasActionTokens() && story.type !== "token-skip") return player;
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
    this.huntStore.setHuntPool(setup.huntPool);
    this.frontStore.setActionTokens(setup.freePeopleTokens, "free-peoples");
    this.frontStore.setActionTokens(setup.shadowTokens, "shadow");
    this.fellowshipStore.setCompanions(setup.fellowship.companions);
    for (const companion of setup.fellowship.companions) {
      this.q.character(companion).setInFellowship();
    }
    this.fellowshipStore.setGuide(setup.fellowship.guide);
    this.fellowshipStore.setProgress(setup.fellowship.progress);
    this.regionStore.addFellowshipToRegion(setup.fellowship.region);
  }
}

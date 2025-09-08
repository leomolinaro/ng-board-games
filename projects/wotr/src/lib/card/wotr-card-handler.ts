import { Injectable, inject } from "@angular/core";
import {
  WotrActionApplierMap,
  WotrActionLoggerMap,
  WotrStoryApplier
} from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFrontId, oppositeFront } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";
import {
  WotrCardReactionStory,
  WotrDieCardStory,
  WotrSkipCardReactionStory
} from "../game/wotr-story-models";
import { WotrLogWriter } from "../log/wotr-log-writer";
import { WotrFreePeoplesPlayer } from "../player/wotr-free-peoples-player";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrCards } from "./cards/wotr-cards";
import { WotrCardAction } from "./wotr-card-actions";
import { WotrCardId, cardToLabel } from "./wotr-card-models";
import { WotrFrontHandler } from "../front/wotr-front-handler";

@Injectable({ providedIn: "root" })
export class WotrCardHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private frontStore = inject(WotrFrontStore);
  private logger = inject(WotrLogWriter);
  private frontHandler = inject(WotrFrontHandler);

  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);
  private cards = inject(WotrCards);

  init() {
    this.actionRegistry.registerActions(this.getActionAppliers() as any);
    this.actionRegistry.registerActionLoggers(this.getActionLoggers() as any);
    this.actionRegistry.registerStory("die-card", this.dieCard);
    this.actionRegistry.registerStory("reaction-card", this.reactionCard);
    this.actionRegistry.registerStory("reaction-card-skip", this.reactionCardSkip);
  }

  private dieCard: WotrStoryApplier<WotrDieCardStory> = async (story, front) => {
    if (story.elvenRing) {
      this.frontHandler.useElvenRing(story.elvenRing, front);
    }
    this.frontStore.setCurrentCard(story.card);
    if (story.actions?.length) {
      for (const action of story.actions) {
        this.logger.logAction(action, story, front);
        await this.actionRegistry.applyAction(action, front);
      }
    } else {
      this.logger.logNoActions(story, front);
    }
    const card = this.cards.getCard(story.card);
    if (card.effect) {
      await card.effect({ front, story });
    }
    this.frontStore.discardCards([story.card], front);
    this.frontStore.removeActionDie(story.die, front);
    this.frontStore.clearCurrentCard();
  };

  private reactionCard: WotrStoryApplier<WotrCardReactionStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logger.logAction(action, story, front);
      await this.actionRegistry.applyAction(action, front);
    }
  };

  private reactionCardSkip: WotrStoryApplier<WotrSkipCardReactionStory> = async (story, front) => {
    this.logger.logStory(story, front);
  };

  getActionAppliers(): WotrActionApplierMap<WotrCardAction> {
    return {
      "card-discard": (action, front) => this.frontStore.discardCards(action.cards, front),
      "card-discard-from-table": (action, front) =>
        this.frontStore.discardCardFromTable(action.card, front),
      "card-draw": (action, front) => this.drawCards(action.cards, front),
      "card-play-on-table": (action, front) => this.frontStore.playCardOnTable(action.card, front),
      "card-random-discard": (action, front) =>
        this.frontStore.discardCards([action.card], oppositeFront(front))
    };
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrCardAction> {
    return {
      "card-discard": (action, front, f) => [
        f.player(front),
        ` discards ${this.nCards(action.cards)}`
      ],
      "card-discard-from-table": (action, front, f) => [
        f.player(front),
        ` discards "${cardToLabel(action.card)}" from table`
      ],
      "card-draw": (action, front, f) => [f.player(front), ` draws ${this.nCards(action.cards)}`],
      "card-play-on-table": (action, front, f) => [
        f.player(front),
        ` plays "${cardToLabel(action.card)}" on table`
      ],
      "card-random-discard": (action, front, f) => [
        f.player(front),
        " random discards 1 card from ",
        f.player(oppositeFront(front)),
        " hand"
      ]
    };
  }

  private nCards(cards: WotrCardId[]) {
    return `${cards.length} ${cards.length === 1 ? "card" : "cards"}`;
  }

  private async drawCards(cards: WotrCardId[], frontId: WotrFrontId) {
    this.frontStore.drawCards(cards, frontId);
    if (this.frontStore.hasExcessCards(frontId)) {
      if (this.frontStore.shouldSkipDiscardExcessCards()) return;
      if (frontId === "free-peoples") {
        await this.freePeoples.discardExcessCards();
      } else {
        await this.shadow.discardExcessCards();
      }
    }
  }
}

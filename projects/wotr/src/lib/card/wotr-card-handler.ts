import { Injectable, inject } from "@angular/core";
import {
  WotrActionApplierMap,
  WotrActionLoggerMap,
  WotrStoryApplier
} from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { oppositeFront } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";
import {
  WotrCardReactionStory,
  WotrDieCardStory,
  WotrSkipCardReactionStory
} from "../game/wotr-story-models";
import { WotrLogStore } from "../log/wotr-log-store";
import { WotrCardAction } from "./wotr-card-actions";
import { WotrCardParams } from "./wotr-card-effects-service";
import { WotrCardId, cardToLabel } from "./wotr-card-models";

@Injectable({ providedIn: "root" })
export class WotrCardHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private frontStore = inject(WotrFrontStore);
  private logStore = inject(WotrLogStore);

  init() {
    this.actionRegistry.registerActions(this.getActionAppliers() as any);
    this.actionRegistry.registerActionLoggers(this.getActionLoggers() as any);
    this.actionRegistry.registerStory("die-card", this.dieCard);
    this.actionRegistry.registerStory("reaction-card", this.reactionCard);
    this.actionRegistry.registerStory("reaction-card-skip", this.reactionCardSkip);
  }

  private cardEffects!: Partial<Record<WotrCardId, (params: WotrCardParams) => Promise<void>>>;
  registerCardEffects(
    cardEffects: Partial<Record<WotrCardId, (params: WotrCardParams) => Promise<void>>>
  ) {
    this.cardEffects = cardEffects;
  }

  private dieCard: WotrStoryApplier<WotrDieCardStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logStore.logAction(action, story, front);
      await this.actionRegistry.applyAction(action, front);
    }
    const cardEffect = this.cardEffects[story.card];
    if (cardEffect) {
      await cardEffect({ front, story });
    }
    this.frontStore.discardCards([story.card], front);
    this.frontStore.removeActionDie(story.die, front);
  };

  private reactionCard: WotrStoryApplier<WotrCardReactionStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logStore.logAction(action, story, front);
      await this.actionRegistry.applyAction(action, front);
    }
  };

  private reactionCardSkip: WotrStoryApplier<WotrSkipCardReactionStory> = async (story, front) => {
    this.logStore.logStory(story, front);
  };

  getActionAppliers(): WotrActionApplierMap<WotrCardAction> {
    return {
      "card-discard": (action, front) => this.frontStore.discardCards(action.cards, front),
      "card-discard-from-table": (action, front) =>
        this.frontStore.discardCardFromTable(action.card, front),
      "card-draw": (action, front) => this.frontStore.drawCards(action.cards, front),
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
}

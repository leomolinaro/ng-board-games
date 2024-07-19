import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap, WotrActionLoggerMap, WotrStoryApplier } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { oppositeFront } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrCardReactionStory, WotrDieCardStory, WotrSkipCardReactionStory } from "../game/wotr-story.models";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrCardAction } from "./wotr-card-actions";
import { WotrCardParams } from "./wotr-card-effects.service";
import { WotrCardId, cardToLabel } from "./wotr-card.models";

@Injectable ()
export class WotrCardService {
  
  private actionService = inject (WotrActionService);
  private frontStore = inject (WotrFrontStore);
  private logStore = inject (WotrLogStore);

  init () {
    this.actionService.registerActions (this.getActionAppliers () as any);
    this.actionService.registerActionLoggers (this.getActionLoggers () as any);
    this.actionService.registerStory ("die-card", this.dieCard);
    this.actionService.registerStory ("reaction-card", this.reactionCard);
    this.actionService.registerStory ("reaction-card-skip", this.reactionCardSkip);
  }

  private cardEffects!: Partial<Record<WotrCardId, (params: WotrCardParams) => Promise<void>>>;
  registerCardEffects (cardEffects: Partial<Record<WotrCardId, (params: WotrCardParams) => Promise<void>>>) {
    this.cardEffects = cardEffects;
  }

  private dieCard: WotrStoryApplier<WotrDieCardStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logStore.logAction (action, story, front);
      await this.actionService.applyAction (action, front);
    }
    const cardEffect = this.cardEffects[story.card];
    if (cardEffect) { await cardEffect ({ front, story }); }
    this.frontStore.discardCards ([story.card], front);
    this.frontStore.removeActionDie (story.die, front);
  };

  private reactionCard: WotrStoryApplier<WotrCardReactionStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logStore.logAction (action, story, front);
      await this.actionService.applyAction (action, front);
    }
  };

  private reactionCardSkip: WotrStoryApplier<WotrSkipCardReactionStory> = async (story, front) => { this.logStore.logStory (story, front); };

  getActionAppliers (): WotrActionApplierMap<WotrCardAction> {
    return {
      "card-discard": async (action, front) => this.frontStore.discardCards (action.cards, front),
      "card-discard-from-table": async (action, front) => this.frontStore.discardCardFromTable (action.card, front),
      "card-draw": async (action, front) => this.frontStore.drawCards (action.cards, front),
      "card-play-on-table": async (action, front) => this.frontStore.playCardOnTable (action.card, front),
      "card-random-discard": async (action, front) => this.frontStore.discardCards ([action.card], oppositeFront (front)),
    };
  }

  private getActionLoggers (): WotrActionLoggerMap<WotrCardAction> {
    return {
      "card-discard": (action, front, f) => [f.player (front), ` discards ${this.nCards (action.cards)}`],
      "card-discard-from-table": (action, front, f) => [f.player (front), ` discards "${cardToLabel (action.card)}" from table`],
      "card-draw": (action, front, f) => [f.player (front), ` draws ${this.nCards (action.cards)}`],
      "card-play-on-table": (action, front, f) => [f.player (front), ` plays "${cardToLabel (action.card)}" on table`],
      "card-random-discard": (action, front, f) => [f.player (front), " random discards 1 card from ", f.player (oppositeFront (front)), " hand"],
    };
  }

  private nCards (cards: WotrCardId[]) {
    return `${cards.length} ${cards.length === 1 ? "card" : "cards"}`;
  }

}

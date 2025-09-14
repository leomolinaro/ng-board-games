import { Injectable, inject } from "@angular/core";
import { WotrStoryApplier } from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFrontHandler } from "../front/wotr-front-handler";
import { WotrFrontStore } from "../front/wotr-front-store";
import {
  WotrCardReactionStory,
  WotrDieCardStory,
  WotrSkipCardReactionStory
} from "../game/wotr-story-models";
import { WotrLogWriter } from "../log/wotr-log-writer";
import { WotrCards } from "./cards/wotr-cards";

@Injectable({ providedIn: "root" })
export class WotrCardStoryHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private frontStore = inject(WotrFrontStore);
  private logger = inject(WotrLogWriter);
  private frontHandler = inject(WotrFrontHandler);

  private cards = inject(WotrCards);

  init() {
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
}

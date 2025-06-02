import { Injectable, inject } from "@angular/core";
import { WotrStoryApplier } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrSkipTokensStory, WotrTokenStory } from "../game/wotr-story.models";
import { WotrLogStore } from "../log/wotr-log.store";

@Injectable()
export class WotrActionTokenService {
  private actionService = inject(WotrActionService);
  private frontStore = inject(WotrFrontStore);
  private logStore = inject(WotrLogStore);

  init() {
    this.actionService.registerStory("token", this.token);
    this.actionService.registerStory("token-skip", this.tokenSkip);
  }

  private token: WotrStoryApplier<WotrTokenStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logStore.logAction(action, story, front);
      await this.actionService.applyAction(action, front);
    }
    this.frontStore.removeActionToken(story.token, front);
  };

  private tokenSkip: WotrStoryApplier<WotrSkipTokensStory> = async (story, front) =>
    this.logStore.logStory(story, front);
}

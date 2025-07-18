import { inject, Injectable } from "@angular/core";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameStory } from "../game/wotr-story.models";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrFreePeoplesPlayer } from "./wotr-free-peoples-player";
import { WotrShadowPlayer } from "./wotr-shadow-player";

@Injectable({ providedIn: "root" })
export class WotrAllPlayers {
  protected storyService = inject(WotrStoryService);
  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);

  firstPhase(): Promise<Record<WotrFrontId, WotrGameStory>> {
    return this.storyService.parallelStories(frontId => p => p.firstPhase(this.player(frontId)));
  }
  rollActionDice(): Promise<Record<WotrFrontId, WotrGameStory>> {
    return this.storyService.parallelStories(
      frontId => p => p.rollActionDice(this.player(frontId))
    );
  }
  chooseCombatCard(): Promise<Record<WotrFrontId, WotrGameStory>> {
    return this.storyService.parallelStories(frontId => p => p.chooseCombatCard(frontId));
  }
  rollCombatDice(nDice: Record<WotrFrontId, number>): Promise<Record<WotrFrontId, WotrGameStory>> {
    return this.storyService.parallelStories(
      frontId => p => p.rollCombatDice(nDice[frontId], frontId)
    );
  }
  reRollCombatDice(
    nDice: Record<WotrFrontId, number>
  ): Promise<Record<WotrFrontId, WotrGameStory>> {
    return this.storyService.parallelStories(
      frontId => p => p.reRollCombatDice(nDice[frontId], frontId)
    );
  }

  private player(frontId: WotrFrontId) {
    switch (frontId) {
      case "free-peoples":
        return this.freePeoples;
      case "shadow":
        return this.shadow;
    }
  }
}

import { inject, Injectable } from "@angular/core";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrStory } from "../game/wotr-story-models";
import { WotrStoryService } from "../game/wotr-story-service";

@Injectable({ providedIn: "root" })
export class WotrAllPlayers {
  protected storyService = inject(WotrStoryService);

  firstPhaseDraw(): Promise<Record<WotrFrontId, WotrStory>> {
    return this.storyService.parallelStories(frontId => p => p.firstPhaseDraw(frontId));
  }
  firstPhaseDiscard(): Promise<Record<WotrFrontId, WotrStory>> {
    return this.storyService.parallelStories(frontId => p => p.firstPhaseDiscard(frontId));
  }
  rollActionDice(): Promise<Record<WotrFrontId, WotrStory>> {
    return this.storyService.parallelStories(frontId => p => p.rollActionDice(frontId));
  }
  chooseCombatCard(): Promise<Record<WotrFrontId, WotrStory>> {
    return this.storyService.parallelStories(frontId => p => p.chooseCombatCard(frontId));
  }
  rollCombatDice(nDice: Record<WotrFrontId, number>): Promise<Record<WotrFrontId, WotrStory>> {
    return this.storyService.parallelStories(
      frontId => p => p.rollCombatDice(nDice[frontId], frontId)
    );
  }
  reRollCombatDice(nDice: Record<WotrFrontId, number>): Promise<Record<WotrFrontId, WotrStory>> {
    return this.storyService.parallelStories(
      frontId => p => p.reRollCombatDice(nDice[frontId], frontId)
    );
  }
}

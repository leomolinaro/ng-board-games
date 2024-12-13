import { inject } from "@angular/core";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameStory } from "../game/wotr-story.models";
import { WotrStoryService } from "../game/wotr-story.service";

export class WotrAllPlayers {

  protected storyService = inject (WotrStoryService);

  firstPhase (): Promise<Record<WotrFrontId, WotrGameStory>> { return this.storyService.parallelStories (frontId => p => p.firstPhase! (frontId)); }
  rollActionDice (): Promise<Record<WotrFrontId, WotrGameStory>> { return this.storyService.parallelStories (frontId => p => p.rollActionDice! ()); }
  chooseCombatCard (): Promise<Record<WotrFrontId, WotrGameStory>> { return this.storyService.parallelStories (frontId => p => p.chooseCombatCard! ()); }
  rollCombatDice (): Promise<Record<WotrFrontId, WotrGameStory>> { return this.storyService.parallelStories (frontId => p => p.rollCombatDice! ()); }
  reRollCombatDice (): Promise<Record<WotrFrontId, WotrGameStory>> { return this.storyService.parallelStories (frontId => p => p.reRollCombatDice! ()); }

}

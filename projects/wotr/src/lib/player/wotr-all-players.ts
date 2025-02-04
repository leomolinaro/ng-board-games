import { inject } from "@angular/core";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameStory } from "../game/wotr-story.models";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrFreePeoplesPlayer } from "./wotr-free-peoples-player";
import { WotrShadowPlayer } from "./wotr-shadow-player";

export class WotrAllPlayers {

  protected storyService = inject (WotrStoryService);
  private freePeoples = inject (WotrFreePeoplesPlayer);
  private shadow = inject (WotrShadowPlayer);

  firstPhase (): Promise<Record<WotrFrontId, WotrGameStory>> { return this.storyService.parallelStories (frontId => p => p.firstPhase! (frontId === "free-peoples" ? this.freePeoples : this.shadow)); }
  rollActionDice (): Promise<Record<WotrFrontId, WotrGameStory>> { return this.storyService.parallelStories (frontId => p => p.rollActionDice! ()); }
  chooseCombatCard (): Promise<Record<WotrFrontId, WotrGameStory>> { return this.storyService.parallelStories (frontId => p => p.chooseCombatCard! ()); }
  rollCombatDice (): Promise<Record<WotrFrontId, WotrGameStory>> { return this.storyService.parallelStories (frontId => p => p.rollCombatDice! ()); }
  reRollCombatDice (): Promise<Record<WotrFrontId, WotrGameStory>> { return this.storyService.parallelStories (frontId => p => p.reRollCombatDice! ()); }

}

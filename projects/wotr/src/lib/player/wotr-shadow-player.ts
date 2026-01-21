import { inject, Injectable } from "@angular/core";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrStory } from "../game/wotr-story-models";
import { WotrStoryService } from "../game/wotr-story-service";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrPlayer } from "./wotr-player";

@Injectable()
export class WotrShadowPlayer extends WotrPlayer {
  protected override storyService = inject(WotrStoryService);
  override frontId: WotrFrontId = "shadow";

  theEaglesAreComingEffect(
    nHits: number,
    region: WotrRegionId,
    cardId: WotrCardId
  ): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p =>
      p.theEaglesAreComingEffect(nHits, region, cardId)
    );
  }

  rollHuntDice(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.rollHuntDice());
  }

  reRollHuntDice(nReRolls: number): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.reRollHuntDice(nReRolls));
  }
}

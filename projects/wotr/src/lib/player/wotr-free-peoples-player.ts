import { inject, Injectable } from "@angular/core";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCompanionId } from "../character/wotr-character-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrStory } from "../game/wotr-story-models";
import { WotrStoryService } from "../game/wotr-story-service";
import { WotrHuntEffectParams } from "../hunt/wotr-hunt-models";
import { WotrPlayer } from "./wotr-player";

@Injectable()
export class WotrFreePeoplesPlayer extends WotrPlayer {
  protected override storyService = inject(WotrStoryService);
  override frontId: WotrFrontId = "free-peoples";

  lureOfTheRingEffect(character: WotrCompanionId): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.lureOfTheRingEffect(character));
  }

  huntEffect(params: WotrHuntEffectParams): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.huntEffect(params));
  }

  faramirsRangesRecruit(cardId: WotrCardId): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.faramirsRangesRecruit(cardId));
  }
}

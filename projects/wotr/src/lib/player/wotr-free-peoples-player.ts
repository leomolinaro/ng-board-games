import { inject, Injectable } from '@angular/core';
import type { WotrCardId } from '../card/wotr-card-models';
import type { WotrCompanionId } from '../character/wotr-character-models';
import type { WotrFrontId } from '../front/wotr-front-models';
import type { WotrStory } from '../game/wotr-story-models';
import { WotrStoryService } from '../game/wotr-story-service';
import type { WotrHuntEffectParams } from '../hunt/wotr-hunt-models';
import type { WotrRegionId } from '../region/wotr-region-models';
import { WotrPlayer } from './wotr-player';

@Injectable()
export class WotrFreePeoplesPlayer extends WotrPlayer {
  protected override storyService = inject(WotrStoryService);
  override frontId: WotrFrontId = 'free-peoples';

  lureOfTheRingEffect(character: WotrCompanionId): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.lureOfTheRingEffect(character),
    );
  }

  huntEffect(params: WotrHuntEffectParams): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) => p.huntEffect(params));
  }

  faramirsRangersRecruit(cardId: WotrCardId): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.faramirsRangersRecruit(cardId),
    );
  }

  deadMenOfDunharrowRecruit(
    regionId: WotrRegionId,
    cardId: WotrCardId,
  ): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.deadMenOfDunharrowRecruit(regionId, cardId),
    );
  }
}

import { inject, Injectable } from '@angular/core';
import { findAction } from '../commons/wotr-action-models';
import { WotrShadowPlayer } from '../player/wotr-shadow-player';
import type {
  KomeCorruptionContinueAttempt,
  KomeCorruptionStopAttempt,
} from './wotr-hunt-actions';
import type { WotrHuntTileId } from './wotr-hunt-models';

@Injectable()
export class KomeCorruptionFlow {
  private shadow = inject(WotrShadowPlayer);

  async corruptionAttempt(): Promise<void> {
    let choosenTile: WotrHuntTileId | null = null;
    while (!choosenTile) {
      const story = await this.shadow.chooseCorruptionTile();
      if (!('actions' in story))
        throw new Error('Invalid story: no actions found');
      const continueAttempt = findAction<KomeCorruptionContinueAttempt>(
        story.actions,
        'corruption-continue-attempt',
      );
      if (!continueAttempt) {
        const stopAttempt = findAction<KomeCorruptionStopAttempt>(
          story.actions,
          'corruption-stop-attempt',
        );
        if (stopAttempt) {
          choosenTile = stopAttempt.tile;
        } else {
          throw new Error('Invalid story: no continue or stop attempt found');
        }
      }
    }
  }
}

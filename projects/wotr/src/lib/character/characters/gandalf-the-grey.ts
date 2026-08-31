import type { WotrUiAbility } from '../../ability/wotr-ability';
import type {
  WotrActionDieModifiers,
  WotrAfterActionDieCardResolution,
} from '../../action-die/wotr-action-die-modifiers';
import type {
  WotrCardId} from '../../card/wotr-card-models';
import {
  isFreePeopleCharacterCard
} from '../../card/wotr-card-models';
import type { WotrAction } from '../../commons/wotr-action-models';
import type { WotrGameQuery } from '../../game/wotr-game-query';
import type { WotrGameUiContext } from '../../game/wotr-game-ui-context';
import type { WotrFreePeoplesPlayer } from '../../player/wotr-free-peoples-player';
import { activateCharacterAbility } from './wotr-playable-character-card';

// Gandalf the Grey - The Grey Wanderer (Level 3, Leadership 1)
// Guide. After you use an Event Action Die to play an Event card, you may immediately draw an Event card from the deck matching the type of that card.
// Captain of the West. If Gandalf is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).
// Emissary from the West. If Gandalf is not in the Fellowship, he can be replaced by Gandalf the White (instructions are provided on the Gandalf the White Character
// card).
// https://boardgamegeek.com/thread/2697060/gandalf-guide-separate
export class GandalfGuideAbility implements WotrUiAbility<WotrAfterActionDieCardResolution> {
  constructor(
    private actionDieModifiers: WotrActionDieModifiers,
    private freePeoples: WotrFreePeoplesPlayer,
    private q: WotrGameQuery,
    private ui: WotrGameUiContext,
  ) {}

  modifier = this.actionDieModifiers.afterActionDieCardResolution;

  private playedCard: WotrCardId | null = null;

  handler: WotrAfterActionDieCardResolution = async (story, frontId) => {
    if (frontId !== 'free-peoples') return;
    if (!this.q.fellowship.guideIs('gandalf-the-grey')) return;
    if (story.die === 'event' || story.die === 'will-of-the-west') {
      this.playedCard = story.card;
      await activateCharacterAbility(
        this,
        'gandalf-the-grey',
        this.freePeoples,
      );
    }
  };

  play: () => Promise<WotrAction[]> = async () => {
    if (!this.playedCard) throw new Error('Unexpected state');
    const action = isFreePeopleCharacterCard(this.playedCard)
      ? await this.ui.cardDrawUi.drawCards(1, 'character', 'free-peoples')
      : await this.ui.cardDrawUi.drawCards(1, 'strategy', 'free-peoples');
    return [action];
  };
}

// export class EmissaryFromTheWestAbility implements WotrAbility<unknown> {
//   public handler = null;
// }

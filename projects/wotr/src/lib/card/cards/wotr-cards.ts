import { inject, Injectable } from '@angular/core';
import { unexpectedStory } from '../../../../../commons/src';
import { WotrAbility, WotrUiAbility } from '../../ability/wotr-ability';
import { WotrAction } from '../../commons/wotr-action-models';
import { WotrFrontId } from '../../front/wotr-front-models';
import { WotrFrontStore } from '../../front/wotr-front-store';
import { WotrGameStore } from '../../game/wotr-game-store';
import { WotrGameUiContext } from '../../game/wotr-game-ui-context';
import { WotrDieCardStory, WotrStory } from '../../game/wotr-story-models';
import { WotrPlayer } from '../../player/wotr-player';
import {
  getCard,
  isFreePeopleCharacterCard,
  isFreePeopleStrategyCard,
  isShadowCharacterCard,
  WotrCardId,
  WotrCardType,
} from '../wotr-card-models';
import { WotrFreePeoplesCharacterCards } from './free-peoples-character-cards/wotr-free-peoples-character-cards';
import { WotrFreePeoplesStrategyCards } from './free-peoples-strategy-cards/wotr-free-peoples-strategy-cards';
import { WotrShadowCharacterCards } from './shadow-character-cards/wotr-shadow-character-cards';
import { WotrShadowStrategyCards } from './shadow-strategy-cards/wotr-shadow-strategy-cards';

export interface WotrEventCard {
  canBePlayed?: () => boolean;
  play: (ui: WotrGameUiContext) => Promise<WotrAction[]>;
  effect?: (params: WotrCardParams) => Promise<void>;
  onTableAbilities?: () => WotrAbility[];
  onBattleAbilities?: () => WotrAbility[];
}

export interface WotrCardParams {
  front: WotrFrontId;
  story: WotrStory & { actions: WotrAction[] };
  // shadow: WotrCombatFront;
  // freePeoples: WotrCombatFront;
  // combatRound: WotrCombatRound;
  cardId: WotrCardId;
  // isAttacker: boolean;
}

// https://boardgamegeek.com/thread/3574029/article/46589098#46589098

@Injectable()
export class WotrCards {
  private cards: Partial<Record<WotrCardId, WotrEventCard>> = {};
  private tableAbilities: Partial<Record<WotrCardId, WotrAbility[]>> = {};
  private battleAbilities: Partial<Record<WotrCardId, WotrAbility[]>> = {};

  private freePeopleCharacterCards = inject(WotrFreePeoplesCharacterCards);
  private freePeopleStrategyCards = inject(WotrFreePeoplesStrategyCards);
  private shadowCharacterCards = inject(WotrShadowCharacterCards);
  private shadowStrategyCards = inject(WotrShadowStrategyCards);
  private gameStore = inject(WotrGameStore);
  private frontStore = inject(WotrFrontStore);

  private getCard(cardId: WotrCardId): WotrEventCard {
    if (!this.cards[cardId]) this.cards[cardId] = this.createCard(cardId);
    return this.cards[cardId];
  }

  activateTableAbilities(card: WotrCardId) {
    if (this.gameStore.isTemporaryState()) return;
    const abilities = this.getTableAbilities(card);
    for (const ability of abilities) {
      if (!ability.modifier)
        console.error('Modifier is not defined for this ability', this);
      ability.modifier.register(ability.handler);
    }
  }

  deactivateTableAbilities(cardId: WotrCardId) {
    if (this.gameStore.isTemporaryState()) return;
    const abilities = this.getTableAbilities(cardId);
    for (const ability of abilities) {
      ability.modifier.unregister(ability.handler);
    }
  }

  private getTableAbilities(cardId: WotrCardId): WotrAbility[] {
    if (!this.tableAbilities[cardId]) {
      const abilities = this.createTableAbilities(cardId);
      this.tableAbilities[cardId] = abilities;
    }
    return this.tableAbilities[cardId];
  }

  private createTableAbilities(cardId: WotrCardId): WotrAbility[] {
    const card = this.getCard(cardId);
    if (!card.onTableAbilities)
      throw new Error(`Card ${cardId} has no on-table abilities`);
    const abilities = card.onTableAbilities();
    return abilities;
  }

  activateBattleAbilities(cardId: WotrCardId) {
    if (this.gameStore.isTemporaryState()) return;
    const abilities = this.getBattleAbilities(cardId);
    for (const ability of abilities) {
      if (!ability.modifier)
        console.error('Modifier is not defined for this ability', this);
      ability.modifier.register(ability.handler);
    }
  }

  deactivateBattleAbilities(cardId: WotrCardId) {
    if (this.gameStore.isTemporaryState()) return;
    const abilities = this.getBattleAbilities(cardId);
    for (const ability of abilities) {
      ability.modifier.unregister(ability.handler);
    }
  }

  private getBattleAbilities(cardId: WotrCardId): WotrAbility[] {
    if (!this.battleAbilities[cardId]) {
      const abilities = this.createBattleAbilities(cardId);
      this.battleAbilities[cardId] = abilities;
    }
    return this.battleAbilities[cardId];
  }

  private createBattleAbilities(cardId: WotrCardId): WotrAbility[] {
    const card = this.getCard(cardId);
    if (!card.onBattleAbilities) return [];
    const abilities = card.onBattleAbilities();
    return abilities;
  }

  private createCard(cardId: WotrCardId): WotrEventCard {
    if (isFreePeopleCharacterCard(cardId)) {
      return this.freePeopleCharacterCards.createCard(cardId);
    } else if (isFreePeopleStrategyCard(cardId)) {
      return this.freePeopleStrategyCards.createCard(cardId);
    } else if (isShadowCharacterCard(cardId)) {
      return this.shadowCharacterCards.createCard(cardId);
    } else {
      return this.shadowStrategyCards.createCard(cardId);
    }
  }

  isPlayableCard(cardId: WotrCardId, frontId: WotrFrontId) {
    const card = this.getCard(cardId);
    return card.canBePlayed ? card.canBePlayed() : true;
  }

  playCard(cardId: WotrCardId, ui: WotrGameUiContext): Promise<WotrAction[]> {
    const card = this.getCard(cardId);
    return card.play(ui);
  }

  playableCards(
    cardTypes: WotrCardType[] | 'any',
    frontId: WotrFrontId,
  ): WotrCardId[] {
    return this.frontStore
      .front(frontId)
      .handCards.filter((cardId) =>
        cardTypes === 'any' ? true : cardTypes.includes(getCard(cardId).type),
      )
      .filter((cardId) => this.isPlayableCard(cardId, frontId));
  }

  async triggerCardEffect(story: WotrDieCardStory, front: WotrFrontId) {
    const card = this.getCard(story.card);
    if (card.effect) await card.effect({ front, story, cardId: story.card });
  }
}

export async function activateTableCard(
  ability: WotrUiAbility,
  cardId: WotrCardId,
  player: WotrPlayer,
): Promise<false | WotrAction[]> {
  const story = await player.activateTableCard(ability, cardId);
  switch (story.type) {
    case 'card-effect':
      return story.actions;
    case 'card-effect-skip':
      return false;
    default:
      throw unexpectedStory(story, 'card activation or not');
  }
}

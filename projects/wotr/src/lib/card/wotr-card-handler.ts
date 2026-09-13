import { Injectable, inject } from '@angular/core';
import { lazyInject } from '../../../../commons/utils/src';
import type {
  WotrActionApplierMap,
  WotrActionLoggerMap,
} from '../commons/wotr-action-models';
import { WotrActionRegistry } from '../commons/wotr-action-registry';
import type { WotrFrontId } from '../front/wotr-front-models';
import { oppositeFront } from '../front/wotr-front-models';
import { WotrFrontStore } from '../front/wotr-front-store';
import { WotrGameQuery } from '../game/wotr-game-query';
import { WotrLogWriter } from '../log/wotr-log-writer';
import { WotrFreePeoplesPlayer } from '../player/wotr-free-peoples-player';
import { WotrShadowPlayer } from '../player/wotr-shadow-player';
import { WotrCards } from './cards/wotr-cards';
import type {
  WotrCardAction,
  WotrCardDiscardFromTable,
} from './wotr-card-actions';
import { discardCardFromTableById, drawCardIds } from './wotr-card-actions';
import type { WotrCardId } from './wotr-card-models';
import { cardToLabel, isFreePeoplesCard } from './wotr-card-models';

@Injectable()
export class WotrCardHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private frontStore = inject(WotrFrontStore);
  private logger = inject(WotrLogWriter);
  private q = inject(WotrGameQuery);
  private cards = lazyInject(WotrCards);

  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);

  init(): void {
    this.actionRegistry.registerActions(this.getActionAppliers());
    this.actionRegistry.registerActionLoggers(this.getActionLoggers());
    this.actionRegistry.registerEffectLogger<WotrCardDiscardFromTable>(
      'card-discard-from-table',
      (effect) => [`"${cardToLabel(effect.card)}" is discarded from table`],
    );
  }

  getActionAppliers(): WotrActionApplierMap<WotrCardAction> {
    return {
      'card-discard': (action, front) => this.discardCards(action.cards, front),
      'card-discard-from-table': (action) =>
        this.discardCardFromTable(action.card),
      'card-draw': (action, front) => this.drawCards(action.cards, front),
      'card-play-on-table': (action, front) =>
        this.playCardOnTable(action.card, front),
      'card-play': (action, front) =>
        this.frontStore.discardCards([action.card], front),
      'card-random-discard': (action, front) =>
        this.frontStore.discardCards([action.card], oppositeFront(front)),
    };
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrCardAction> {
    return {
      'card-discard': (action, front, f) => [
        f.player(front),
        ` discards ${this.nCards(action.cards)}`,
      ],
      'card-discard-from-table': (action, front, f) => [
        f.player(front),
        ` discards "${cardToLabel(action.card)}" from table`,
      ],
      'card-draw': (action, front, f) => [
        f.player(front),
        ` draws ${this.nCards(action.cards)}`,
      ],
      'card-play-on-table': (action, front, f) => [
        f.player(front),
        ` plays "${cardToLabel(action.card)}" on table`,
      ],
      'card-play': (action, front, f) => [
        f.player(front),
        ` plays "${cardToLabel(action.card)}"`,
      ],
      'card-random-discard': (_action, front, f) => [
        f.player(front),
        ' random discards 1 card from ',
        f.player(oppositeFront(front)),
        ' hand',
      ],
    };
  }

  private nCards(cards: WotrCardId[]): string {
    return `${cards.length} ${cards.length === 1 ? 'card' : 'cards'}`;
  }

  private async drawCards(
    cards: WotrCardId[],
    frontId: WotrFrontId,
  ): Promise<void> {
    this.frontStore.drawCards(cards, frontId);
    if (this.q.front(frontId).hasExcessCards()) {
      if (this.frontStore.shouldSkipDiscardExcessCards()) return;
      if (frontId === 'free-peoples') {
        await this.freePeoples.discardExcessCards();
      } else {
        await this.shadow.discardExcessCards();
      }
    }
  }

  discardCards(cards: WotrCardId[], frontId: WotrFrontId): void {
    this.frontStore.discardCards(cards, frontId);
  }

  discardCardFromTable(cardId: WotrCardId): void {
    this.frontStore.discardCardFromTable(
      cardId,
      isFreePeoplesCard(cardId) ? 'free-peoples' : 'shadow',
    );
    this.cards.deactivateTableAbilities(cardId);
  }

  discardCardFromTableEffect(cardId: WotrCardId): void {
    this.discardCardFromTable(cardId);
    this.logger.logEffect(discardCardFromTableById(cardId));
  }

  async drawCard(cardId: WotrCardId, frontId: WotrFrontId): Promise<void> {
    await this.drawCards([cardId], frontId);
    this.logger.logEffect(drawCardIds(cardId));
  }

  playCardOnTable(card: WotrCardId, front: WotrFrontId): void {
    this.frontStore.playCardOnTable(card, front);
    this.cards.activateTableAbilities(card);
  }
}

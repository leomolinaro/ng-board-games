import {
  type WotrActionDie,
  type WotrActionToken,
} from '../action-die/wotr-action-die-models';
import type {
  WotrCardId,
  WotrCardType,
  WotrCharacterCardId,
  WotrStrategyCardId,
} from '../card/wotr-card-models';
import {
  getCard,
  isCharacterCard,
  isStrategyCard,
} from '../card/wotr-card-models';
import type { WotrCharacterStore } from '../character/wotr-character-store';
import type {
  WotrElvenRing,
  WotrFront,
  WotrFrontId,
} from './wotr-front-models';
import type { WotrFrontStore } from './wotr-front-store';

export class WotrFrontQuery {
  constructor(
    private frontId: WotrFrontId,
    private frontStore: WotrFrontStore,
    private characterStore: WotrCharacterStore,
  ) {}

  id(): WotrFrontId {
    return this.frontId;
  }

  private data(): WotrFront {
    return this.frontStore.front(this.frontId);
  }

  actionDice(): WotrActionDie[] {
    return this.data().actionDice;
  }

  hasActionDice(): boolean {
    return this.data().actionDice.length > 0;
  }

  hasRulerDie(): boolean {
    return this.data().actionDice.some(
      (die) => typeof die !== 'string' && die.type === 'ruler',
    );
  }

  canSkipTokens(): boolean {
    return !this.hasActionDice();
  }

  nActionDice(): number {
    return this.data().actionDice.length;
  }

  hasUnusedCharacterActionDice(): boolean {
    return this.data().actionDice.includes('character');
  }

  actionDiceBonus(): number {
    let actionDiceBonus = 0;
    for (const character of this.characterStore.characters()) {
      if (character.front !== this.frontId) continue;
      if (character.dieBonus !== 'actionDie') continue;
      if (character.status !== 'inPlay') continue;
      actionDiceBonus += 1;
    }
    return actionDiceBonus;
  }

  hasActionTokens(): boolean {
    return this.data().actionTokens.length > 0;
  }

  actionTokens(): WotrActionToken[] {
    return this.data().actionTokens;
  }

  characterDeck(): WotrCharacterCardId[] {
    return this.data().characterDeck;
  }

  strategyDeck(): WotrStrategyCardId[] {
    return this.data().strategyDeck;
  }

  handCards(): WotrCardId[] {
    return this.data().handCards;
  }

  tableCards(): WotrCardId[] {
    return this.data().tableCards;
  }

  hasCharacterHandCards(): boolean {
    return this.handCards().some((cardId) => isCharacterCard(cardId));
  }

  hasStrategyHandCards(): boolean {
    return this.handCards().some((cardId) => isStrategyCard(cardId));
  }

  characterHandCards(): WotrCharacterCardId[] {
    return this.handCards().filter((cardId) => isCharacterCard(cardId));
  }

  strategyHandCards(): WotrStrategyCardId[] {
    return this.handCards().filter((cardId) => isStrategyCard(cardId));
  }

  hasExcessCards(): boolean {
    const handCards = this.handCards();
    return handCards.length > 6;
  }

  nExcessCards(): number {
    const handCards = this.handCards();
    return Math.max(0, handCards.length - 6);
  }

  nCardsInStrategyDeck(): number {
    return this.data().strategyDeck.length;
  }

  canDrawCard(): boolean {
    return this.canDrawStrategyCard() || this.canDrawCharacterCard();
  }

  canDrawStrategyCard(): boolean {
    return this.data().strategyDeck.length > 0;
  }

  canDrawCharacterCard(): boolean {
    return this.data().characterDeck.length > 0;
  }

  hasTableCard(cardId: WotrCardId): boolean {
    return !!this.data().tableCards.includes(cardId);
  }

  hasCharacterTableCards(): boolean {
    return this.data().tableCards.some((cardId) => isCharacterCard(cardId));
  }

  hasStrategyTableCards(): boolean {
    return this.data().tableCards.some((cardId) => isStrategyCard(cardId));
  }

  characterTableCards(): WotrCharacterCardId[] {
    return this.data().tableCards.filter((cardId) => isCharacterCard(cardId));
  }

  strategyTableCards(): WotrStrategyCardId[] {
    return this.data().tableCards.filter((cardId) => isStrategyCard(cardId));
  }

  hasCardsOnTable(): boolean {
    return this.data().tableCards.length > 0;
  }

  handCardsOfType(cardType: WotrCardType): WotrCardId[] {
    return this.handCards().filter(
      (cardId) => getCard(cardId).type === cardType,
    );
  }

  hasHandCardOfType(cardType: WotrCardType): boolean {
    return this.handCards().some((cardId) => getCard(cardId).type === cardType);
  }

  elvenRings(): WotrElvenRing[] {
    return this.data().elvenRings;
  }

  playableElvenRings(): WotrElvenRing[] {
    return this.elvenRingUsed() ? [] : this.elvenRings();
  }

  hasElvenRings(): boolean {
    return this.elvenRings().length > 0;
  }

  canUseElvenRings(): boolean {
    return this.hasElvenRings() && !this.elvenRingUsed();
  }

  elvenRingUsed(): boolean {
    return this.data().elvenRingUsed;
  }

  victoryPoints(): number {
    return this.data().victoryPoints;
  }
}

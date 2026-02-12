import { getCard, WotrCardId, WotrCardType } from "../card/wotr-card-models";
import { WotrCharacterStore } from "../character/wotr-character-store";
import { WotrElvenRing, WotrFrontId } from "./wotr-front-models";
import { WotrFrontStore } from "./wotr-front-store";

export class WotrFrontQuery {
  constructor(
    private frontId: WotrFrontId,
    private frontStore: WotrFrontStore,
    private characterStore: WotrCharacterStore
  ) {}

  id() {
    return this.frontId;
  }

  private data() {
    return this.frontStore.front(this.frontId);
  }

  actionDice() {
    return this.data().actionDice;
  }

  hasActionDice() {
    return !!this.data().actionDice.length;
  }

  canSkipTokens() {
    return !this.hasActionDice();
  }

  nActionDice() {
    return this.data().actionDice.length;
  }

  hasUnusedCharacterActionDice(): boolean {
    return this.data().actionDice.includes("character");
  }

  actionDiceBonus(): number {
    let actionDiceBonus = 0;
    for (const character of this.characterStore.characters()) {
      if (character.front !== this.frontId) continue;
      if (character.dieBonus !== "actionDie") continue;
      if (character.status !== "inPlay") continue;
      actionDiceBonus += 1;
    }
    return actionDiceBonus;
  }

  hasActionTokens() {
    return !!this.data().actionTokens.length;
  }

  actionTokens() {
    return this.data().actionTokens;
  }

  characterDeck() {
    return this.data().characterDeck;
  }

  strategyDeck() {
    return this.data().strategyDeck;
  }

  handCards() {
    return this.data().handCards;
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

  hasTableCard(cardId: WotrCardId) {
    return !!this.data().tableCards.includes(cardId);
  }

  hasCardsOnTable() {
    return this.data().tableCards.length > 0;
  }

  handCardsOfType(cardType: WotrCardType) {
    return this.handCards().filter(cardId => getCard(cardId).type === cardType);
  }

  hasHandCardOfType(cardType: WotrCardType): boolean {
    return this.handCards().some(cardId => getCard(cardId).type === cardType);
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

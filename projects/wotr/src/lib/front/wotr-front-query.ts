import { WotrCardId } from "../card/wotr-card-models";
import { WotrElvenRing, WotrFrontId } from "./wotr-front-models";
import { WotrFrontStore } from "./wotr-front-store";

export class WotrFrontQuery {
  constructor(
    private frontId: WotrFrontId,
    private frontStore: WotrFrontStore
  ) {}

  private front() {
    return this.frontStore.front(this.frontId);
  }

  actionDice() {
    return this.front().actionDice;
  }

  hasActionDice() {
    return !!this.front().actionDice.length;
  }

  canSkipTokens() {
    return !this.hasActionDice();
  }

  nActionDice() {
    return this.front().actionDice.length;
  }

  hasUnusedCharacterActionDice(): boolean {
    return this.front().actionDice.includes("character");
  }

  hasActionTokens() {
    return !!this.front().actionTokens.length;
  }

  actionTokens() {
    return this.front().actionTokens;
  }

  characterDeck() {
    return this.front().characterDeck;
  }

  strategyDeck() {
    return this.front().strategyDeck;
  }

  handCards() {
    return this.front().handCards;
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
    return this.front().strategyDeck.length;
  }

  canDrawCard(): boolean {
    return this.canDrawStrategyCard() || this.canDrawCharacterCard();
  }

  canDrawStrategyCard(): boolean {
    return this.front().strategyDeck.length > 0;
  }

  canDrawCharacterCard(): boolean {
    return this.front().characterDeck.length > 0;
  }

  hasTableCard(cardId: WotrCardId) {
    return !!this.front().tableCards.includes(cardId);
  }

  hasCardsOnTable() {
    return this.front().tableCards.length > 0;
  }

  elvenRings(): WotrElvenRing[] {
    return this.front().elvenRings;
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
    return this.front().elvenRingUsed;
  }

  victoryPoints(): number {
    return this.front().victoryPoints;
  }
}

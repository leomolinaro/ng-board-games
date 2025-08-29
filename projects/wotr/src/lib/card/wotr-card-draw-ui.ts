import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";
import { WotrGameUi, WotrUiChoice } from "../game/wotr-game-ui";
import { discardCardIds, drawCardIds } from "./wotr-card-actions";
import { WotrCardId } from "./wotr-card-models";
import { WotrCardRules } from "./wotr-card-rules";

@Injectable({ providedIn: "root" })
export class WotrCardDrawUi {
  private ui = inject(WotrGameUi);
  private cardRules = inject(WotrCardRules);
  private frontStore = inject(WotrFrontStore);

  async firstPhaseDrawCards(frontId: WotrFrontId): Promise<WotrAction[]> {
    // TODO separate in different stories: introduce the draw flow
    await this.ui.askContinue("Draw cards");
    const characterDeck = this.frontStore.characterDeck(frontId);
    const strategyDeck = this.frontStore.strategyDeck(frontId);
    const drawnCards: WotrCardId[] = [];
    const actions: WotrAction[] = [];
    if (characterDeck.length) {
      drawnCards.push(characterDeck[0]);
    }
    if (strategyDeck.length) {
      drawnCards.push(strategyDeck[0]);
    }
    this.frontStore.drawCards(drawnCards, frontId);
    actions.push(drawCardIds(...drawnCards));
    const discardAction = await this.checkMaximumCards(frontId);
    if (discardAction) actions.push(discardAction);
    return actions;
  }

  async drawCards(
    nCards: number,
    deckType: "character" | "strategy",
    frontId: WotrFrontId
  ): Promise<WotrAction[]> {
    await this.ui.askContinue("Draw cards");
    const deck =
      deckType === "character"
        ? this.frontStore.characterDeck(frontId)
        : this.frontStore.strategyDeck(frontId);
    const drawnCards: WotrCardId[] = [];
    const actions: WotrAction[] = [];
    for (let i = 0; i < nCards; i++) {
      if (deck.length > i) {
        drawnCards.push(deck[i]);
      }
    }
    this.frontStore.drawCards(drawnCards, frontId);
    actions.push(drawCardIds(...drawnCards));
    const discardAction = await this.checkMaximumCards(frontId);
    if (discardAction) actions.push(discardAction);
    return actions;
  }

  private async checkMaximumCards(frontId: WotrFrontId): Promise<WotrAction | null> {
    const handCards = this.frontStore.handCards(frontId);
    if (handCards.length <= 6) return null;
    const excessCards = handCards.length - 6;
    const cards = await this.ui.askCards(`Discard ${excessCards} card(s).`, {
      nCards: excessCards,
      frontId,
      message: "Discard cards"
    });
    this.frontStore.discardCards(cards, frontId);
    return discardCardIds(...cards);
  }

  async drawCard(frontId: WotrFrontId): Promise<WotrAction[]> {
    const characterDeck = this.frontStore.characterDeck(frontId);
    const strategyDeck = this.frontStore.strategyDeck(frontId);
    if (characterDeck.length === 0 && strategyDeck.length === 0) {
      throw new Error("No cards left to draw");
    }
    if (characterDeck.length === 0) {
      return this.drawCardFromDeck(strategyDeck, frontId);
    }
    if (strategyDeck.length === 0) {
      return this.drawCardFromDeck(characterDeck, frontId);
    }
    const deck = await this.ui.askOption<"character" | "strategy">("Choose the deck to draw from", [
      { value: "character", label: "Character Deck" },
      { value: "strategy", label: "Strategy Deck" }
    ]);
    switch (deck) {
      case "character":
        return this.drawCardFromDeck(characterDeck, frontId);
      case "strategy":
        return this.drawCardFromDeck(strategyDeck, frontId);
    }
  }

  private async drawCardFromDeck(deck: WotrCardId[], frontId: WotrFrontId): Promise<WotrAction[]> {
    const actions: WotrAction[] = [];
    const drawnCard = deck[0];
    this.frontStore.drawCards([drawnCard], frontId);
    actions.push(drawCardIds(drawnCard));
    const discardAction = await this.checkMaximumCards(frontId);
    if (discardAction) actions.push(discardAction);
    return actions;
  }

  drawEventCardChoice: WotrUiChoice = {
    label: () => "Draw a card",
    isAvailable: frontId => this.cardRules.canDrawCard(frontId),
    actions: frontId => this.drawCard(frontId)
  };
}

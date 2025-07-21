import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrGameUi } from "../game/wotr-game-ui.store";
import { WotrGameStory } from "../game/wotr-story.models";
import { WotrPlayer } from "../player/wotr-player";
import { discardCardIds, drawCardIds } from "./wotr-card-actions";
import { WotrCardId } from "./wotr-card.models";

@Injectable({ providedIn: "root" })
export class WotrCardUi {
  private ui = inject(WotrGameUi);
  private frontStore = inject(WotrFrontStore);

  async firstPhaseDrawCards(player: WotrPlayer): Promise<WotrGameStory> {
    await this.ui.askContinue("Draw cards");
    const characterDeck = this.frontStore.characterDeck(player.frontId);
    const strategyDeck = this.frontStore.strategyDeck(player.frontId);
    const drawnCards: WotrCardId[] = [];
    const actions: WotrAction[] = [];
    if (characterDeck.length) {
      drawnCards.push(characterDeck[0]);
    }
    if (strategyDeck.length) {
      drawnCards.push(strategyDeck[0]);
    }
    this.frontStore.drawCards(drawnCards, player.frontId);
    actions.push(drawCardIds(...drawnCards));
    const discardAction = await this.checkMaximumCards(player.frontId);
    if (discardAction) actions.push(discardAction);
    return { type: "phase", actions };
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

  async playCard(cardId: WotrCardId, frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

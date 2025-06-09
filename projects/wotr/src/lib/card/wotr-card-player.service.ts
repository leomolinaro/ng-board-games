import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrGameUiStore } from "../game/wotr-game-ui.store";
import { WotrCardId } from "./wotr-card.models";

@Injectable()
export class WotrCardPlayerService {
  private ui = inject(WotrGameUiStore);
  private front = inject(WotrFrontStore);

  async drawCard(frontId: WotrFrontId): Promise<WotrCardId> {
    const characterDeck = this.front.characterDeck(frontId);
    const strategyDeck = this.front.strategyDeck(frontId);
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

  private async drawCardFromDeck(deck: WotrCardId[], frontId: WotrFrontId): Promise<WotrCardId> {
    const drawnCard = deck[0];
    this.front.drawCards([drawnCard], frontId);
    return drawnCard;
  }

  async playCard(cardId: WotrCardId, frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

import { inject, Injectable } from "@angular/core";
import { WotrUiAbility } from "../ability/wotr-ability";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";
import { WotrGameUi, WotrUiChoice } from "../game/wotr-game-ui";
import { WotrStory } from "../game/wotr-story-models";
import { WotrCards } from "./cards/wotr-cards";
import { playCardId } from "./wotr-card-actions";
import { getCard, WotrCardId, WotrCardType } from "./wotr-card-models";

@Injectable({ providedIn: "root" })
export class WotrCardPlayUi {
  private frontStore = inject(WotrFrontStore);
  private cards = inject(WotrCards);
  private ui = inject(WotrGameUi);

  async playCard(cardId: WotrCardId, frontId: WotrFrontId): Promise<WotrAction[]> {
    const card = this.cards.getCard(cardId);
    this.frontStore.discardCards([cardId], frontId);
    return card.play();
  }

  playEventCardChoice(cartTypes: WotrCardType[] | "any"): WotrUiChoice {
    let chosenCardId: WotrCardId | null = null;
    return {
      label: () => "Play an event card",
      isAvailable: frontId => this.hasPlayableCards(cartTypes, frontId),
      actions: async frontId => {
        const playableCards = this.playableCards(cartTypes, frontId);
        const cardId = await this.ui.askHandCard("Select an event card to play", {
          nCards: 1,
          cards: playableCards,
          frontId,
          message: "Confirm"
        });
        chosenCardId = cardId;
        return this.playCard(cardId, frontId);
      },
      card: () => chosenCardId!
    };
  }

  private hasPlayableCards(cartTypes: WotrCardType[] | "any", frontId: WotrFrontId) {
    return this.frontStore
      .front(frontId)
      .handCards.some(cardId => this.isPlayableCard(cardId, frontId));
  }

  playableCards(cardTypes: WotrCardType[] | "any", frontId: WotrFrontId): WotrCardId[] {
    return this.frontStore
      .front(frontId)
      .handCards.filter(cardId =>
        cardTypes === "any" ? true : cardTypes.includes(getCard(cardId).type)
      )
      .filter(cardId => this.isPlayableCard(cardId, frontId));
  }

  private isPlayableCard(cardId: WotrCardId, frontId: WotrFrontId) {
    const card = this.cards.getCard(cardId);
    return card.canBePlayed ? card.canBePlayed() : true;
  }

  async playCharacterCardFromHand(frontId: WotrFrontId): Promise<WotrAction[]> {
    const doPlay = await this.ui.askConfirm(
      "Do you want to play a character card?",
      "Play",
      "Skip"
    );
    if (!doPlay) return [];
    const playableCards = this.playableCards(["character"], frontId);
    const actions: WotrAction[] = [];
    const cardId = await this.ui.askHandCard("Choose a character card to play", {
      nCards: 1,
      frontId,
      message: "Play character card",
      cards: playableCards
    });
    actions.push(playCardId(cardId));
    actions.push(...(await this.playCard(cardId, frontId)));
    return actions;
  }

  async activateTableCard(ability: WotrUiAbility, cardId: WotrCardId): Promise<WotrStory> {
    const card = getCard(cardId);
    const confirm = await this.ui.askConfirm(
      `Do you want to activate ${card.label} ability?`,
      "Activate",
      "Skip"
    );
    if (confirm) {
      return {
        type: "card-effect",
        card: cardId,
        actions: await ability.play()
      };
    } else {
      return { type: "card-effect-skip", card: cardId };
    }
  }
}

import { inject, Injectable } from "@angular/core";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrCardId, WotrCardType } from "./wotr-card.models";

@Injectable({ providedIn: "root" })
export class WotrCardRules {
  private frontStore = inject(WotrFrontStore);

  hasPlayableCards(cartTypes: WotrCardType[] | "any", frontId: WotrFrontId) {
    return this.frontStore
      .front(frontId)
      .handCards.some(cardId => this.isPlayableCard(cardId, frontId));
  }

  playableCards(cartTypes: WotrCardType[] | "any", frontId: WotrFrontId): WotrCardId[] {
    return this.frontStore
      .front(frontId)
      .handCards.filter(cardId => this.isPlayableCard(cardId, frontId));
  }

  isPlayableCard(cardId: WotrCardId, frontId: WotrFrontId) {
    return false;
  }

  canDrawCard(frontId: WotrFrontId): boolean {
    const front = this.frontStore.front(frontId);
    return front.characterDeck.length > 0 || front.strategyDeck.length > 0;
  }
}

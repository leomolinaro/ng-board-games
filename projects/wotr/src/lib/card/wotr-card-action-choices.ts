import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameUi, WotrPlayerChoice } from "../game/wotr-game-ui.store";
import { WotrCardRules } from "./wotr-card-rules";
import { WotrCardUi } from "./wotr-card-ui";
import { WotrCardType } from "./wotr-card.models";

@Injectable({ providedIn: "root" })
export class WotrDrawEventCardChoice implements WotrPlayerChoice {
  private cardRules = inject(WotrCardRules);
  private cardUi = inject(WotrCardUi);

  label(): string {
    return "Draw a card";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.cardRules.canDrawCard(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.cardUi.drawCard(frontId);
  }
}

export class WotrPlayEventCardChoice implements WotrPlayerChoice {
  constructor(
    private cartTypes: WotrCardType[] | "any",
    private frontId: WotrFrontId,
    private cardRules: WotrCardRules,
    private ui: WotrGameUi,
    private cardPlayer: WotrCardUi
  ) {}

  label(): string {
    return "Play an event card";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.cardRules.hasPlayableCards(this.cartTypes, frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    const playableCards = this.cardRules.playableCards(this.cartTypes, frontId);
    const cardId = await this.ui.askCard(
      "Select an event card to play",
      playableCards,
      this.frontId
    );
    return this.cardPlayer.playCard(cardId, this.frontId);
  }
}

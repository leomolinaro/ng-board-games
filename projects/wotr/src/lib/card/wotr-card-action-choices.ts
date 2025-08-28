import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameUi, WotrUiChoice } from "../game/wotr-game-ui";
import { WotrCardType } from "./wotr-card-models";
import { WotrCardRules } from "./wotr-card-rules";
import { WotrCardUi } from "./wotr-card-ui";

@Injectable({ providedIn: "root" })
export class WotrDrawEventCardChoice implements WotrUiChoice {
  private cardRules = inject(WotrCardRules);
  private cardUi = inject(WotrCardUi);

  label(): string {
    return "Draw a card";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.cardRules.canDrawCard(frontId);
  }

  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.cardUi.drawCard(frontId);
  }
}

export class WotrPlayEventCardChoice implements WotrUiChoice {
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

  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    const playableCards = this.cardRules.playableCards(this.cartTypes, frontId);
    const cardId = await this.ui.askCard(
      "Select an event card to play",
      playableCards,
      this.frontId
    );
    return this.cardPlayer.playCard(cardId, this.frontId);
  }
}

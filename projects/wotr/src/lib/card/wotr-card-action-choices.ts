import { inject, Injectable } from "@angular/core";
import { WotrActionPlayerChoice } from "../action-die/wotr-action-die-choices";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameUiStore } from "../game/wotr-game-ui.store";
import { drawCardIds } from "./wotr-card-actions";
import { WotrCardPlayerService } from "./wotr-card-player.service";
import { WotrCardType } from "./wotr-card.models";
import { WotrCardService } from "./wotr-card.service";

@Injectable({ providedIn: "root" })
export class WotrDrawEventCardChoice implements WotrActionPlayerChoice {
  private cardService = inject(WotrCardService);
  private cardPlayer = inject(WotrCardPlayerService);

  label(): string {
    return "Draw a card";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.cardService.canDrawCard(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    const cardId = await this.cardPlayer.drawCard(frontId);
    return [drawCardIds(cardId)];
  }
}

export class WotrPlayEventCardChoice implements WotrActionPlayerChoice {
  constructor(
    private cartTypes: WotrCardType[] | "any",
    private frontId: WotrFrontId,
    private cardService: WotrCardService,
    private ui: WotrGameUiStore,
    private cardPlayer: WotrCardPlayerService
  ) {}

  label(): string {
    return "Play an event card";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.cardService.hasPlayableCards(this.cartTypes, frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    const playableCards = this.cardService.getPlayableCards(this.cartTypes, frontId);
    const cardId = await this.ui.askCard(
      "Select an event card to play",
      playableCards,
      this.frontId
    );
    return this.cardPlayer.playCard(cardId, this.frontId);
  }
}

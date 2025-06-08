import { WotrActionPlayerChoice } from "../action/wotr-action-choices";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrGameUiStore } from "../game/wotr-game-ui.store";
import { drawCardIds } from "./wotr-card-actions";
import { WotrCardPlayerService } from "./wotr-card-player.service";
import { WotrCardType } from "./wotr-card.models";

export class WotrDrawEventCardChoice implements WotrActionPlayerChoice {
  constructor(
    private frontId: WotrFrontId,
    private cardPlayer: WotrCardPlayerService
  ) {}

  label(): string {
    return "Draw a card";
  }

  isAvailable(): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(): Promise<WotrAction[]> {
    const cardId = await this.cardPlayer.drawCard(this.frontId);
    return [drawCardIds(cardId)];
  }
}

export class WotrPlayEventCardChoice implements WotrActionPlayerChoice {
  constructor(
    private cartTypes: WotrCardType[] | "any",
    private frontId: WotrFrontId,
    private frontStore: WotrFrontStore,
    private ui: WotrGameUiStore,
    private cardPlayer: WotrCardPlayerService
  ) {}

  label(): string {
    return "Play an event card";
  }

  isAvailable(): boolean {
    return this.frontStore.hasPlayableCards(this.cartTypes, this.frontId);
  }

  async resolve(): Promise<WotrAction[]> {
    const playableCards = this.frontStore.getPlayableCards(this.cartTypes, this.frontId);
    const cardId = await this.ui.askCard("Select an event card to play", playableCards, this.frontId);
    return this.cardPlayer.playCard(cardId, this.frontId);
  }
}

import { WotrFrontId } from "./wotr-front-models";
import { WotrFrontStore } from "./wotr-front-store";

export class WotrFrontQuery {
  constructor(
    private frontId: WotrFrontId,
    private frontStore: WotrFrontStore
  ) {}

  nCardsInStrategyDeck(): number {
    return this.frontStore.strategyDeck(this.frontId).length;
  }

  hasUnusedCharacterActionDice(): boolean {
    return this.frontStore.actionDice(this.frontId).includes("character");
  }
}

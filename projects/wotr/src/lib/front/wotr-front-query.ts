import { WotrElvenRing, WotrFrontId } from "./wotr-front-models";
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

  elvenRings(): WotrElvenRing[] {
    return this.frontStore.elvenRings(this.frontId);
  }

  playableElvenRings(): WotrElvenRing[] {
    return this.frontStore.elvenRingUsed(this.frontId) ? [] : this.elvenRings();
  }

  hasElvenRings(): boolean {
    return this.elvenRings().length > 0;
  }

  canUseElvenRings(): boolean {
    return this.hasElvenRings() && !this.frontStore.elvenRingUsed(this.frontId);
  }
}

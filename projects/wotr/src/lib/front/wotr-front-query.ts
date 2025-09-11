import { WotrElvenRing, WotrFrontId } from "./wotr-front-models";
import { WotrFrontStore } from "./wotr-front-store";

export class WotrFrontQuery {
  constructor(
    private frontId: WotrFrontId,
    private frontStore: WotrFrontStore
  ) {}

  private front() {
    return this.frontStore.front(this.frontId);
  }

  nCardsInStrategyDeck(): number {
    return this.front().strategyDeck.length;
  }

  hasUnusedCharacterActionDice(): boolean {
    return this.front().actionDice.includes("character");
  }

  elvenRings(): WotrElvenRing[] {
    return this.front().elvenRings;
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

  canDrawCard(): boolean {
    return this.canDrawStrategyCard() || this.canDrawCharacterCard();
  }

  canDrawStrategyCard(): boolean {
    return this.front().strategyDeck.length > 0;
  }

  canDrawCharacterCard(): boolean {
    return this.front().characterDeck.length > 0;
  }
}

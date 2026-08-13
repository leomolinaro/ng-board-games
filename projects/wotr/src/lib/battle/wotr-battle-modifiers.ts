import { Injectable } from "@angular/core";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrCombatFront, WotrCombatRound } from "./wotr-battle-models";

export type WotrBeforeCombatRound = (combatRound: WotrCombatRound) => Promise<void>;
export type WotrBeforeCombatCardRevealing = (combatRound: WotrCombatRound) => Promise<void>;
export type WotrAfterCombatCardRevealing = (combatRound: WotrCombatRound) => Promise<void>;
export type WotrAfterCombatRound = (combatRound: WotrCombatRound) => Promise<void>;
export type WotrCanUseCombatCardModifier = (
  combatFront: WotrCombatFront,
  combatRound: WotrCombatRound
) => boolean;
export type WotrTableCombatCardGetter = (
  combatFront: WotrCombatFront,
  combatRound: WotrCombatRound
) => WotrCardId[];
export type WotrNSiegeRoundsModifier = () => number;
export type WotrCanCeaseModifier = (combatRound: WotrCombatRound) => boolean;
export type WotrCardLessCombatDice = (
  combatFront: WotrCombatFront,
  combatRound: WotrCombatRound
) => number;

@Injectable()
export class WotrBattleModifiers {
  public readonly beforeCombatRound = new WotrModifier<WotrBeforeCombatRound>();
  async onBeforeCombatRound(combatRound: WotrCombatRound): Promise<void> {
    await Promise.all(this.beforeCombatRound.get().map(handler => handler(combatRound)));
  }

  public readonly beforeCombatCardRevealing = new WotrModifier<WotrBeforeCombatCardRevealing>();
  async onBeforeCombatCardRevealing(combatRound: WotrCombatRound): Promise<void> {
    await Promise.all(this.beforeCombatCardRevealing.get().map(handler => handler(combatRound)));
  }

  public readonly afterCombatCardRevealing = new WotrModifier<WotrAfterCombatCardRevealing>();
  async onAfterCombatCardRevealing(combatRound: WotrCombatRound): Promise<void> {
    await Promise.all(this.afterCombatCardRevealing.get().map(handler => handler(combatRound)));
  }

  public readonly afterCombatRound = new WotrModifier<WotrAfterCombatRound>();
  async onAfterCombatRound(combatRound: WotrCombatRound): Promise<void> {
    await Promise.all(this.afterCombatRound.get().map(handler => handler(combatRound)));
  }

  public readonly canUseCombatCardModifier = new WotrModifier<WotrCanUseCombatCardModifier>();
  canUseCombatCard(combatFront: WotrCombatFront, combatRound: WotrCombatRound): boolean {
    for (const handler of this.canUseCombatCardModifier.get()) {
      const result = handler(combatFront, combatRound);
      if (!result) return false;
    }
    return true;
  }

  public readonly tableCombatCardGetter = new WotrModifier<WotrTableCombatCardGetter>();
  getTableCombatCards(combatFront: WotrCombatFront, combatRound: WotrCombatRound): WotrCardId[] {
    return this.tableCombatCardGetter
      .get()
      .reduce<WotrCardId[]>((cards, getter) => cards.concat(getter(combatFront, combatRound)), []);
  }

  public readonly nSiegeRoundsModifier = new WotrModifier<WotrNSiegeRoundsModifier>();
  getNSiegeRounds(): number | undefined {
    const results = this.nSiegeRoundsModifier.get().map(handler => handler());
    if (results.length === 0) return undefined;
    return Math.max(...results);
  }

  public readonly canCeaseModifier = new WotrModifier<WotrCanCeaseModifier>();
  canCease(combatRound: WotrCombatRound): boolean {
    const handlers = this.canCeaseModifier.get();
    for (const handler of handlers) {
      if (!handler(combatRound)) return false;
    }
    return true;
  }

  public readonly cardLessCombatDiceModifier = new WotrModifier<WotrCardLessCombatDice>();
  getCardLessCombatDice(combatFront: WotrCombatFront, combatRound: WotrCombatRound): number {
    const results = this.cardLessCombatDiceModifier
      .get()
      .map(handler => handler(combatFront, combatRound));
    if (results.length === 0) return 0;
    return Math.max(...results);
  }

  clear() {
    this.beforeCombatRound.clear();
    this.beforeCombatCardRevealing.clear();
    this.afterCombatCardRevealing.clear();
    this.afterCombatRound.clear();
    this.canUseCombatCardModifier.clear();
    this.tableCombatCardGetter.clear();
    this.nSiegeRoundsModifier.clear();
    this.canCeaseModifier.clear();
    this.cardLessCombatDiceModifier.clear();
  }
}

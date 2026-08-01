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
  async canUseCombatCard(
    combatFront: WotrCombatFront,
    combatRound: WotrCombatRound
  ): Promise<boolean> {
    const results = await Promise.all(
      this.canUseCombatCardModifier.get().map(handler => handler(combatFront, combatRound))
    );
    return results.every(result => result);
  }

  public readonly tableCombatCardGetter = new WotrModifier<WotrTableCombatCardGetter>();
  getTableCombatCards(combatFront: WotrCombatFront, combatRound: WotrCombatRound): WotrCardId[] {
    return this.tableCombatCardGetter
      .get()
      .reduce<WotrCardId[]>((cards, getter) => cards.concat(getter(combatFront, combatRound)), []);
  }

  clear() {
    this.beforeCombatRound.clear();
    this.beforeCombatCardRevealing.clear();
    this.afterCombatCardRevealing.clear();
    this.afterCombatRound.clear();
    this.canUseCombatCardModifier.clear();
    this.tableCombatCardGetter.clear();
  }
}

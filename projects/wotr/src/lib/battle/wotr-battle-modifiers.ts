import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrCombatFront, WotrCombatRound } from "./wotr-battle-models";

export type WotrAfterCombatRound = (combatRound: WotrCombatRound) => Promise<void>;
export type WotrBeforeCombatRound = (combatRound: WotrCombatRound) => Promise<void>;
export type WotrCanUseCombatCardModifier = (
  combatFront: WotrCombatFront,
  combatRound: WotrCombatRound
) => boolean;

@Injectable({ providedIn: "root" })
export class WotrBattleModifiers {
  public readonly beforeCombatRound = new WotrModifier<WotrBeforeCombatRound>();
  async onBeforeCombatRound(combatRound: WotrCombatRound): Promise<void> {
    await Promise.all(this.beforeCombatRound.get().map(handler => handler(combatRound)));
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

  clear() {
    this.beforeCombatRound.clear();
    this.afterCombatRound.clear();
    this.canUseCombatCardModifier.clear();
  }
}

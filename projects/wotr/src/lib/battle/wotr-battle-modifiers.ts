import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrCombatRound } from "./wotr-battle-models";

export type WotrAfterCombatRound = (combatRound: WotrCombatRound) => Promise<void>;
export type WotrBeforeCombatRound = (combatRound: WotrCombatRound) => Promise<void>;

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

  clear() {
    this.beforeCombatRound.clear();
    this.afterCombatRound.clear();
  }
}

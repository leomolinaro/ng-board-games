import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrCombatRound } from "./wotr-battle-models";

export type WotrBattleOnCombatRoundEnd = (combatRound: WotrCombatRound) => Promise<void>;
export type WotrBattleOnCombatRoundStart = (combatRound: WotrCombatRound) => Promise<void>;

@Injectable({ providedIn: "root" })
export class WotrBattleModifiers {
  public readonly combatRoundEndHandlers = new WotrModifier<WotrBattleOnCombatRoundEnd>();
  async onCombatRoundEnd(combatRound: WotrCombatRound): Promise<void> {
    await Promise.all(this.combatRoundEndHandlers.get().map(handler => handler(combatRound)));
  }

  public readonly combatRoundStartHandlers = new WotrModifier<WotrBattleOnCombatRoundStart>();
  async onCombatRoundStart(combatRound: WotrCombatRound): Promise<void> {
    await Promise.all(this.combatRoundStartHandlers.get().map(handler => handler(combatRound)));
  }

  clear() {
    this.combatRoundEndHandlers.clear();
    this.combatRoundStartHandlers.clear();
  }
}

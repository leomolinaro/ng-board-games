import { Injectable } from "@angular/core";
import { WotrCombatRound } from "./wotr-battle-models";

export type WotrBattleOnCombatRoundEnd = (combatRound: WotrCombatRound) => Promise<void>;

@Injectable({ providedIn: "root" })
export class WotrBattleModifiers {
  private combatRoundEndHandlers: WotrBattleOnCombatRoundEnd[] = [];

  registerCombatRoundEndHandler(handler: WotrBattleOnCombatRoundEnd): void {
    this.combatRoundEndHandlers.push(handler);
  }

  unregisterCombatRoundEndHandler(handler: WotrBattleOnCombatRoundEnd): void {
    this.combatRoundEndHandlers = this.combatRoundEndHandlers.filter(h => h !== handler);
  }

  async onCombatRoundEnd(combatRound: WotrCombatRound): Promise<void> {
    await Promise.all(this.combatRoundEndHandlers.map(handler => handler(combatRound)));
  }

  clear() {
    this.combatRoundEndHandlers = [];
  }
}

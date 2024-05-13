import { Injectable, Signal, computed } from "@angular/core";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrBattle } from "./wotr-battle.models";

export type WotrBattleState = WotrBattle | null;

@Injectable ({
  providedIn: "root"
})
export class WotrBattleStore {

  update!: (actionName: string, updater: (a: WotrBattleState) => WotrBattleState) => void;
  state!: Signal<WotrBattleState | null>;

  battleInProgress = computed (() => !!this.state ());

  init (): WotrBattleState {
    return null;
  }

  startBattle (region: WotrRegionId) { this.update ("startBattle", s => ({ region })); }
  addAttackerCombatCard (card: WotrCardId) { this.update ("addAttackerCombatCard", s => ({ ...s!, attackerCombatCard: card })); }
  addDefenderCombatCard (card: WotrCardId) { this.update ("addDefenderCombatCard", s => ({ ...s!, defenderCombatCard: card })); }
  endBattle () { this.update ("endBattle", s => (null)); }

}

import { Injectable, Signal, computed } from "@angular/core";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrBattle } from "./wotr-battle.models";

export type WotrBattleState = WotrBattle | null;

export function initialeState (): WotrBattleState {
  return null;
}

@Injectable ()
export class WotrBattleStore {

  update!: (actionName: string, updater: (a: WotrBattleState) => WotrBattleState) => void;
  state!: Signal<WotrBattleState | null>;

  battle = computed (() => this.state ());
  battleInProgress = computed (() => !!this.state ());
  isCharacterInRetroguard (character: WotrCharacterId) { return this.state ()?.retroguard?.characters?.includes (character); }

  startBattle (battle: WotrBattle) { this.update ("startBattle", s => battle); }
  addAttackerCombatCard (card: WotrCardId) { this.update ("addAttackerCombatCard", s => ({ ...s!, attackerCombatCard: card })); }
  addDefenderCombatCard (card: WotrCardId) { this.update ("addDefenderCombatCard", s => ({ ...s!, defenderCombatCard: card })); }
  endBattle () { this.update ("endBattle", s => (null)); }

}

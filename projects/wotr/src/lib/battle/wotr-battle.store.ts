import { Injectable, Signal, computed } from "@angular/core";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrCharacterId } from "../companion/wotr-character.models";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrUnits } from "../unit/wotr-unit-actions";
import { WotrBattle } from "./wotr-battle.models";

export type WotrBattleState = WotrBattle | null;

@Injectable ({
  providedIn: "root"
})
export class WotrBattleStore {

  update!: (actionName: string, updater: (a: WotrBattleState) => WotrBattleState) => void;
  state!: Signal<WotrBattleState | null>;

  battle = computed (() => this.state ());
  battleInProgress = computed (() => !!this.state ());
  isCharacterInRetroguard (character: WotrCharacterId) { return this.state ()?.retroguard?.characters?.includes (character); }

  init (): WotrBattleState {
    return null;
  }

  startBattle (region: WotrRegionId, retroguard: WotrUnits | null) { this.update ("startBattle", s => ({ region, retroguard })); }
  addAttackerCombatCard (card: WotrCardId) { this.update ("addAttackerCombatCard", s => ({ ...s!, attackerCombatCard: card })); }
  addDefenderCombatCard (card: WotrCardId) { this.update ("addDefenderCombatCard", s => ({ ...s!, defenderCombatCard: card })); }
  endBattle () { this.update ("endBattle", s => (null)); }

}

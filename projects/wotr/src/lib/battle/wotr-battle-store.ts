import type { Signal } from '@angular/core';
import { Injectable, computed } from '@angular/core';
import type { WotrCardId } from '../card/wotr-card-models';
import type { WotrCharacterId } from '../character/wotr-character-models';
import type { WotrBattle } from './wotr-battle-models';

export type WotrBattleState = WotrBattle | undefined;

export function initialeState(): WotrBattleState {
  return undefined;
}

@Injectable()
export class WotrBattleStore {
  update!: (
    actionName: string,
    updater: (a: WotrBattleState) => WotrBattleState,
  ) => void;
  state!: Signal<WotrBattleState | undefined>;

  battle = computed(() => this.state());
  battleInProgress = computed(() => !!this.state());
  isCharacterInRetroguard(character: WotrCharacterId): boolean {
    return this.state()?.retroguard?.characters?.includes(character) ?? false;
  }

  startBattle(battle: WotrBattle): void {
    this.update('startBattle', () => battle);
  }
  addAttackerCombatCard(card: WotrCardId): void {
    this.update('addAttackerCombatCard', (s) => ({
      ...s!,
      attackerCombatCard: card,
    }));
  }
  addDefenderCombatCard(card: WotrCardId): void {
    this.update('addDefenderCombatCard', (s) => ({
      ...s!,
      defenderCombatCard: card,
    }));
  }
  endBattle(): void {
    this.update('endBattle', () => undefined);
  }
  addNRegularCasualtiesToContinueSiege(n: number): void {
    this.update('addNRegularCasualtiesToContinueSiege', (s) => {
      if (!s) throw new Error('No battle in progress');
      return {
        ...s,
        nRegularCasualtiesToContinueSiege:
          (s.nRegularCasualtiesToContinueSiege ?? 0) + n,
      };
    });
  }
}

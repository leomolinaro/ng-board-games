import { inject, Injectable } from '@angular/core';
import { WotrBattleStore } from '../battle/wotr-battle-store';
import type { WotrCardId } from '../card/wotr-card-models';
import type { WotrAction } from '../commons/wotr-action-models';
import type { WotrFrontId } from '../front/wotr-front-models';
import type { WotrPhase } from '../game-turn/wotr-phase-models';
import type { WotrElvenRingAction, WotrStory } from '../game/wotr-story-models';
import { WotrHuntStore } from '../hunt/wotr-hunt-store';
import type { WotrLog, WotrLogFragment } from './wotr-log-models';
import { WotrLogStore } from './wotr-log-store';

@Injectable()
export class WotrLogWriter {
  private logStore = inject(WotrLogStore);
  private battleStore = inject(WotrBattleStore);
  private huntStore = inject(WotrHuntStore);

  private addLog(actionName: string, log: WotrLog): void {
    return this.logStore.update(actionName, (s) => [...s, log]);
  }

  logSetup(): void {
    this.addLog('logSetup', { type: 'setup' });
  }

  logRound(roundNumber: number): void {
    this.addLog('logRound', { type: 'round', roundNumber });
  }

  logPhase(phase: WotrPhase): void {
    this.addLog('logPhase', { type: 'phase', phase: phase });
  }

  logBattleResolution(): void {
    this.addLog('logBattleResolution', { type: 'battle-resolution' });
  }

  logHuntResolution(): void {
    this.addLog('logHuntResolution', { type: 'hunt-resolution' });
  }

  logRevealInMordor(): void {
    this.addLog('logRevealInMordor', { type: 'reveal-in-mordor' });
  }

  logMoveInMordor(): void {
    this.addLog('logMoveInMordor', { type: 'move-in-mordor' });
  }

  logCombatCard(card: WotrCardId, front: WotrFrontId): void {
    this.addLog('logCombatCard', {
      type: 'combat-card',
      card,
      front,
      during: 'battle',
    });
  }

  logAction(action: WotrAction, story: WotrStory, front: WotrFrontId): void {
    this.addLog(`logAction [${action.type}]`, {
      type: 'action',
      action,
      story,
      front,
      during: this.during(),
    });
  }

  logNoActions(story: WotrStory, front: WotrFrontId): void {
    this.addLog('logNoActions', {
      type: 'no-actions',
      story,
      front,
      during: this.during(),
    });
  }

  logElvenRingUse(elvenRing: WotrElvenRingAction, front: WotrFrontId): void {
    this.addLog('logElvenRingUse', {
      type: 'elven-ring',
      ...elvenRing,
      front,
      during: this.during(),
    });
  }

  logEffect(effect: WotrAction): void {
    // TODO WOTR make log effect direct; maybe remove action logs and add them to each action resolution
    this.addLog(`logEffect [${effect.type}]`, {
      type: 'effect',
      effect,
      during: this.during(),
    });
  }

  logStory(story: WotrStory, front: WotrFrontId): void {
    this.addLog('logStory', {
      type: 'story',
      story,
      front,
      during: this.during(),
    });
  }

  logV2(...fragments: (string | WotrLogFragment)[]): void {
    this.addLog('logV2', { type: 'v2', fragments });
  }

  logEndGame(): void {
    this.addLog('logEndGame', { type: 'endGame' });
  }

  private during(): 'battle' | 'hunt' | undefined {
    let during: 'battle' | 'hunt' | undefined;
    if (this.battleStore.battleInProgress()) during = 'battle';
    if (this.huntStore.inProgress()) during = 'hunt';
    return during;
  }

  // logAction(action: WotrAction, story: WotrGameStory, front: WotrFrontId) {
  //   let during: "battle" | "hunt" | undefined;
  //   if (this.battleStore.battleInProgress()) during = "battle";
  //   this.logStore.logAction(action, story, front, during);
  // }
}

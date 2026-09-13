import type { Signal } from '@angular/core';
import { Injectable } from '@angular/core';
import { immutableUtil } from '@leobg/commons/utils';
import type {
  WotrCharacterId,
  WotrCompanionId,
} from '../character/wotr-character-models';
import type { WotrFellowship, WotrMordorTrack } from './wotr-fellowship-models';

export function initialState(): WotrFellowship {
  return {
    status: 'hidden',
    companions: [],
    progress: 0,
    corruption: 0,
    guide: 'gandalf-the-grey',
    moveOrHideAttempt: false,
  };
}

@Injectable()
export class WotrFellowshipStore {
  update!: (
    actionName: string,
    updater: (a: WotrFellowship) => WotrFellowship,
  ) => void;
  state!: Signal<WotrFellowship>;

  corruption(): number {
    return this.state().corruption;
  }
  isRevealed(): boolean {
    return this.state().status === 'revealed';
  }
  isHidden(): boolean {
    return this.state().status === 'hidden';
  }
  guide(): WotrCompanionId {
    return this.state().guide;
  }
  isOnMordorTrack(): boolean {
    return this.state().mordorTrack != null;
  }
  mordorTrack(): WotrMordorTrack | undefined {
    return this.state().mordorTrack;
  }
  hasMovedOrHid(): boolean {
    return this.state().moveOrHideAttempt;
  }
  progress(): number {
    return this.state().progress;
  }
  numberOfCompanions(): number {
    return this.state().companions.length;
  }
  companions(): WotrCompanionId[] {
    return this.state().companions;
  }

  setCompanions(companions: WotrCompanionId[]): void {
    this.update('setCompanions', (state) => ({ ...state, companions }));
  }
  setGuide(guide: WotrCompanionId): void {
    this.update('setGuide', (state) => ({ ...state, guide }));
  }
  setProgress(progress: number): void {
    this.update('setProgress', (state) => ({ ...state, progress }));
  }
  increaseProgress(): void {
    this.update('increaseProgress', (state) => ({
      ...state,
      progress: state.progress + 1,
    }));
  }
  corrupt(delta: number): void {
    this.update('changeCorruption', (state) => ({
      ...state,
      corruption: state.corruption + delta,
    }));
  }
  hide(): void {
    this.update('hide', (state) => ({ ...state, status: 'hidden' }));
  }
  reveal(): void {
    this.update('reveal', (state) => ({
      ...state,
      status: 'revealed',
      progress: 0,
    }));
  }
  removeCompanion(companionId: WotrCharacterId): void {
    this.update('removeCompanion', (state) => ({
      ...state,
      companions: immutableUtil.listRemoveFirst(
        (c) => c === companionId,
        state.companions,
      ),
    }));
  }

  moveOnMordorTrack(): void {
    this.update('moveOnMordorTrack', (state) => ({
      ...state,
      mordorTrack:
        state.mordorTrack == null
          ? 0
          : ((state.mordorTrack + 1) as WotrMordorTrack),
    }));
  }

  setMoveAttempt(): void {
    this.update('setMoveAttempt', (state) => ({
      ...state,
      moveOrHideAttempt: true,
    }));
  }
  setHideAttempt(): void {
    this.update('setHideAttempt', (state) => ({
      ...state,
      moveOrHideAttempt: true,
    }));
  }
  resetMoveOrHideAttempt(): void {
    this.update('resetMoveOrHideAttempt', (state) => ({
      ...state,
      moveOrHideAttempt: false,
    }));
  }
}

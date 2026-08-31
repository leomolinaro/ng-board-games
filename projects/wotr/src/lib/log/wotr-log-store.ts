import type { Signal } from '@angular/core';
import { Injectable } from '@angular/core';
import type { WotrLog } from './wotr-log-models';

export type WotrLogState = WotrLog[];

export function initialeState(): WotrLogState {
  return [];
}

@Injectable()
export class WotrLogStore {
  update!: (
    actionName: string,
    updater: (a: WotrLogState) => WotrLogState,
  ) => void;
  state!: Signal<WotrLogState>;
}

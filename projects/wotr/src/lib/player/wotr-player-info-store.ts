import type { Signal } from '@angular/core';
import { Injectable, computed } from '@angular/core';
import type { WotrFrontId } from '../front/wotr-front-models';
import type { WotrPlayerInfo } from './wotr-player-info-models';

export interface WotrPlayerInfoState {
  map: Record<WotrFrontId, WotrPlayerInfo>;
  ids: WotrFrontId[];
}

export function initialState(): WotrPlayerInfoState {
  return {
    map: {} as unknown as Record<WotrFrontId, WotrPlayerInfo>,
    ids: [],
  };
}

@Injectable()
export class WotrPlayerInfoStore {
  update!: (
    actionName: string,
    updater: (a: WotrPlayerInfoState) => WotrPlayerInfoState,
  ) => void;
  state!: Signal<WotrPlayerInfoState>;

  playerMap = computed(() => this.state().map);
  playerIds = computed(() => this.state().ids);
  players = computed(() => this.state().ids.map((id) => this.state().map[id]));
  player(id: WotrFrontId): WotrPlayerInfo {
    return this.state().map[id];
  }
}

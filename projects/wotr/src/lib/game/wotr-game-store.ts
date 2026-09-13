// import { withDevtools } from "@angular-architects/ngrx-toolkit";
import { computed, inject, Injectable } from '@angular/core';
import type { BgUser } from '@leobg/commons';
import { arrayUtil } from '@leobg/commons/utils';
import { patchState, signalStore, withState } from '@ngrx/signals';
import type { WotrBattleState } from '../battle/wotr-battle-store';
import {
  initialeState as battleInitialeState,
  WotrBattleStore,
} from '../battle/wotr-battle-store';
import type { WotrCharacterState } from '../character/wotr-character-store';
import {
  initialeState as characterInitialeState,
  WotrCharacterStore,
} from '../character/wotr-character-store';
import type { WotrFellowship } from '../fellowship/wotr-fellowship-models';
import {
  initialState as fellowshipInitialeState,
  WotrFellowshipStore,
} from '../fellowship/wotr-fellowship-store';
import type { WotrFrontId } from '../front/wotr-front-models';
import type { WotrFrontState } from '../front/wotr-front-store';
import {
  initialState as frontInitialState,
  WotrFrontStore,
} from '../front/wotr-front-store';
import type { WotrHuntState } from '../hunt/wotr-hunt-store';
import {
  initialeState as huntInitialeState,
  WotrHuntStore,
} from '../hunt/wotr-hunt-store';
import type { WotrLog } from '../log/wotr-log-models';
import {
  initialeState as lognitialeState,
  WotrLogStore,
} from '../log/wotr-log-store';
import type { WotrNationState } from '../nation/wotr-nation-store';
import {
  initialeState as nationInitialeState,
  WotrNationStore,
} from '../nation/wotr-nation-store';
import type { WotrPlayerInfo } from '../player/wotr-player-info-models';
import type { WotrPlayerInfoState } from '../player/wotr-player-info-store';
import {
  initialState as playerInitialStore,
  WotrPlayerInfoStore,
} from '../player/wotr-player-info-store';
import type { WotrRegionState } from '../region/wotr-region-store';
import {
  initialeState as regionInitialeState,
  WotrRegionStore,
} from '../region/wotr-region-store';
import type { WotrGameOptions } from './options/wotr-game-options';

export interface WotrGameState {
  gameId: string;
  gameOwner: BgUser | undefined;
  gameOptions: WotrGameOptions;
  players: WotrPlayerInfoState;
  frontState: WotrFrontState;
  regionState: WotrRegionState;
  nationState: WotrNationState;
  characterState: WotrCharacterState;
  fellowship: WotrFellowship;
  hunt: WotrHuntState;
  logs: WotrLog[];
  battle: WotrBattleState;
  backupState: WotrGameState | undefined;
}

function initialState(): WotrGameState {
  return {
    gameId: '',
    gameOwner: undefined,
    gameOptions: {
      expansions: [],
      variants: [],
      tokens: [],
    },
    players: playerInitialStore(),
    frontState: frontInitialState(),
    regionState: regionInitialeState(),
    nationState: nationInitialeState(),
    characterState: characterInitialeState(),
    fellowship: fellowshipInitialeState(),
    hunt: huntInitialeState(),
    logs: lognitialeState(),
    battle: battleInitialeState(),
    backupState: undefined,
  };
}

@Injectable()
export class WotrGameStore extends signalStore(
  { protectedState: false },
  // withDevtools("WotrGameStore"),
  withState<WotrGameState>(initialState()),
) {
  constructor() {
    const frontStore = inject(WotrFrontStore);
    const regionStore = inject(WotrRegionStore);
    const nationStore = inject(WotrNationStore);
    const characterStore = inject(WotrCharacterStore);
    const fellowshipStore = inject(WotrFellowshipStore);
    const huntStore = inject(WotrHuntStore);
    const logStore = inject(WotrLogStore);
    const playerInfoStore = inject(WotrPlayerInfoStore);
    const battleStore = inject(WotrBattleStore);

    super();
    playerInfoStore.update = (_actionName, updater) =>
      patchState(this, (s) => ({ ...s, players: updater(s.players) }));
    playerInfoStore.state = this.players;
    frontStore.update = (_actionName, updater) =>
      patchState(this, (s) => ({ ...s, frontState: updater(s.frontState) }));
    frontStore.state = this.frontState;
    regionStore.update = (_actionName, updater) =>
      patchState(this, (s) => ({ ...s, regionState: updater(s.regionState) }));
    regionStore.state = this.regionState;
    nationStore.update = (_actionName, updater) =>
      patchState(this, (s) => ({ ...s, nationState: updater(s.nationState) }));
    nationStore.state = this.nationState;
    characterStore.update = (_actionName, updater) =>
      patchState(this, (s) => ({
        ...s,
        characterState: updater(s.characterState),
      }));
    characterStore.state = this.characterState;
    fellowshipStore.update = (_actionName, updater) =>
      patchState(this, (s) => ({ ...s, fellowship: updater(s.fellowship) }));
    fellowshipStore.state = this.fellowship;
    huntStore.update = (_actionName, updater) =>
      patchState(this, (s) => ({ ...s, hunt: updater(s.hunt) }));
    huntStore.state = this.hunt;
    logStore.update = (_actionName, updater) =>
      patchState(this, (s) => ({ ...s, logs: updater(s.logs) }));
    logStore.state = this.logs;
    battleStore.update = (_actionName, updater) =>
      patchState(this, (s) => ({ ...s, battle: updater(s.battle) }));
    battleStore.state = this.battle;
  }

  clear(): void {
    patchState(this, () => initialState());
  }

  initGameState(
    players: WotrPlayerInfo[],
    gameId: string,
    gameOwner: BgUser,
    gameOptions: WotrGameOptions,
  ): void {
    patchState(this, (s) => ({
      ...s,
      gameId,
      gameOwner,
      gameOptions,
      players: {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        map: arrayUtil.toMap(players, (p) => p.id) as Record<
          WotrFrontId,
          WotrPlayerInfo
        >,
        ids: players.map((p) => p.id),
      },
    }));
  }

  isTemporaryState(): boolean {
    return !!this.backupState();
  }
  startTemporaryState(): void {
    patchState(this, (s) => ({ ...s, backupState: s }));
  }
  endTemporaryState(): void {
    if (this.backupState()) {
      patchState(this, (s) => ({ ...s.backupState, backupState: undefined }));
    } else {
      throw new Error('endTemporaryState without startTemporaryState');
    }
  }

  getGameId(): string {
    return this.gameId();
  }
  getGameOwner(): BgUser {
    const owner = this.gameOwner();
    if (!owner) throw new Error('Game owner is not set');
    return owner;
  }

  kome = computed(() => this.gameOptions().expansions.includes('kome'));
  visibleCorruptionTiles = computed(() =>
    this.gameOptions().variants.includes('visibleCorruptionTiles'),
  );
  sequentialCorruptionDraw = computed(() =>
    this.gameOptions().variants.includes('sequentialCorruptionDraw'),
  );
}

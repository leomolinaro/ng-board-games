import { inject, Injectable } from "@angular/core";
import { BgUser } from "@leobg/commons";
import { arrayUtil } from "@leobg/commons/utils";
import { patchState, signalStore, withState } from "@ngrx/signals";
import {
  initialeState as battleInitialeState,
  WotrBattleState,
  WotrBattleStore
} from "../battle/wotr-battle.store";
import {
  initialeState as characterInitialeState,
  WotrCharacterState,
  WotrCharacterStore
} from "../character/wotr-character.store";
import { WotrFellowship } from "../fellowship/wotr-fellowhip.models";
import {
  initialeState as fellowshipInitialeState,
  WotrFellowshipStore
} from "../fellowship/wotr-fellowship.store";
import { WotrFrontId } from "../front/wotr-front.models";
import {
  initialState as frontInitialState,
  WotrFrontState,
  WotrFrontStore
} from "../front/wotr-front.store";
import {
  initialeState as huntInitialeState,
  WotrHuntState,
  WotrHuntStore
} from "../hunt/wotr-hunt.store";
import { WotrLog } from "../log/wotr-log.models";
import { initialeState as lognitialeState, WotrLogStore } from "../log/wotr-log.store";
import {
  initialeState as nationInitialeState,
  WotrNationState,
  WotrNationStore
} from "../nation/wotr-nation.store";
import { WotrPlayerInfo } from "../player/wotr-player-info.models";
import {
  initialState as playerInitialStore,
  WotrPlayerInfoState,
  WotrPlayerInfoStore
} from "../player/wotr-player-info.store";
import {
  initialeState as regionInitialeState,
  WotrRegionState,
  WotrRegionStore
} from "../region/wotr-region.store";

export interface WotrGameState {
  gameId: string;
  gameOwner: BgUser;
  players: WotrPlayerInfoState;
  frontState: WotrFrontState;
  regionState: WotrRegionState;
  nationState: WotrNationState;
  characterState: WotrCharacterState;
  fellowship: WotrFellowship;
  hunt: WotrHuntState;
  logs: WotrLog[];
  battle: WotrBattleState;
  backupState: WotrGameState | null;
}

function initialeState(): WotrGameState {
  return {
    gameId: "",
    gameOwner: null as any,
    players: playerInitialStore(),
    frontState: frontInitialState(),
    regionState: regionInitialeState(),
    nationState: nationInitialeState(),
    characterState: characterInitialeState(),
    fellowship: fellowshipInitialeState(),
    hunt: huntInitialeState(),
    logs: lognitialeState(),
    battle: battleInitialeState(),
    backupState: null
  };
}

@Injectable({ providedIn: "root" })
export class WotrGameStore extends signalStore(
  { protectedState: false },
  // withDevtoo
  withState<WotrGameState>(initialeState())
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
    playerInfoStore.update = (actionName, updater) =>
      patchState(this, s => ({ ...s, players: updater(s.players) }));
    playerInfoStore.state = this.players;
    frontStore.update = (actionName, updater) =>
      patchState(this, s => ({ ...s, frontState: updater(s.frontState) }));
    frontStore.state = this.frontState;
    regionStore.update = (actionName, updater) =>
      patchState(this, s => ({ ...s, regionState: updater(s.regionState) }));
    regionStore.state = this.regionState;
    nationStore.update = (actionName, updater) =>
      patchState(this, s => ({ ...s, nationState: updater(s.nationState) }));
    nationStore.state = this.nationState;
    characterStore.update = (actionName, updater) =>
      patchState(this, s => ({ ...s, characterState: updater(s.characterState) }));
    characterStore.state = this.characterState;
    fellowshipStore.update = (actionName, updater) =>
      patchState(this, s => ({ ...s, fellowship: updater(s.fellowship) }));
    fellowshipStore.state = this.fellowship;
    huntStore.update = (actionName, updater) =>
      patchState(this, s => ({ ...s, hunt: updater(s.hunt) }));
    huntStore.state = this.hunt;
    logStore.update = (actionName, updater) =>
      patchState(this, s => ({ ...s, logs: updater(s.logs) }));
    logStore.state = this.logs;
    battleStore.update = (actionName, updater) =>
      patchState(this, s => ({ ...s, battle: updater(s.battle) }));
    battleStore.state = this.battle;
  }

  clear() {
    patchState(this, () => initialeState());
  }

  initGameState(players: WotrPlayerInfo[], gameId: string, gameOwner: BgUser) {
    patchState(this, s => ({
      ...s,
      gameId: gameId,
      gameOwner: gameOwner,
      players: {
        map: arrayUtil.toMap(players, p => p.id) as Record<WotrFrontId, WotrPlayerInfo>,
        ids: players.map(p => p.id)
      }
    }));
  }

  isTemporaryState() {
    return !!this.backupState();
  }
  startTemporaryState() {
    patchState(this, s => ({ ...s, backupState: s }));
  }
  endTemporaryState() {
    if (this.backupState()) {
      patchState(this, s => ({ ...s.backupState, backupState: null }));
    } else {
      throw new Error("endTemporaryState without startTemporaryState");
    }
  }

  getGameId(): string {
    return this.gameId();
  }
  getGameOwner(): BgUser {
    return this.gameOwner();
  }
}

import { Injectable, computed, inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { uiEvent } from "@leobg/commons/utils";
import { patchState, signalStore, withState } from "@ngrx/signals";
import { first, skip } from "rxjs/operators";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrPlayerInfo } from "../player/wotr-player-info.models";
import { WotrPlayerInfoStore } from "../player/wotr-player-info.store";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrGameStore } from "./wotr-game.store";

interface WotrGameUiState {
  currentPlayerId: WotrFrontId | null;
  canCancel: boolean;
  message: string | null;
  validRegions: WotrRegionId[] | null;
  canPass: boolean;
  canConfirm: boolean;
}

export interface WotrPlayerUiState {
  
}

export function initialState (): WotrPlayerUiState {
  return {
    
  };
}

@Injectable ()
export class WotrGameUiStore extends signalStore (
  { protectedState: false },
  withState<WotrGameUiState> ({
    currentPlayerId: null,
    canCancel: false,
    message: null,
    validRegions: null,
    canPass: false,
    canConfirm: false
  })
) {
  
  private playerInfoStore = inject (WotrPlayerInfoStore);
  private game = inject (WotrGameStore);

  // canPass = computed (() => this.currentPlayerUi ()?.canPass || false);
  // canCancel = computed (() => this.currentPlayerUi ()?.canCancel || false);
  // canConfirm = computed (() => this.currentPlayerUi ()?.canConfirm || false);
  // message = computed (() => this.currentPlayerUi ()?.message || "");

  // validRegions = toSignal (this.select$ ((s) => s.validRegions), { requireSync: true });
  // canPass = toSignal (this.select$ ((s) => s.canPass), { requireSync: true });
  // canContinue = toSignal (this.select$ (s => s.canConfirm), { requireSync: true });
  // canCancel = toSignal (this.select$ (s => s.canCancel), { requireSync: true });
  // currentPlayerId = toSignal (this.select$ (s => s.currentPlayer), { requireSync: true });
  // turnPlayerId = toSignal (this.select$ (s => s.turnPlayer), { requireSync: true });
  // message = toSignal (this.select$ (s => s.message), { requireSync: true });

  currentPlayer = computed<WotrPlayerInfo | null> (() => {
    const currentPlayerId = this.currentPlayerId ();
    if (currentPlayerId) {
      return this.playerInfoStore.playerMap ()[currentPlayerId];
    } else {
      return null;
    }
  });

  // turnPlayer = computed (() => {
  //   const turnPlayerId = this.turnPlayerId ();
  //   if (turnPlayerId) {
  //     return this.playerInfoStore.playerMap ()[turnPlayerId];
  //   } else {
  //     return null;
  //   }
  // });

  pass = uiEvent<void> ();
  confirm = uiEvent<void> ();
  cancel = uiEvent<void> ();
  selectRegion = uiEvent<WotrRegionId> ();

  _currentPlayerChange$ = toObservable (this.currentPlayerId).pipe (skip (1), first ());
  currentPlayerChange$ () { return this._currentPlayerChange$; }

  private updateUi<
    S extends WotrGameUiState & {
      [K in keyof S]: K extends keyof WotrGameUiState ? WotrGameUiState[K] : never;
    }
  > (updater: (state: WotrGameUiState) => S) {
    patchState (this, updater);
  }

  updatePlayer (front: WotrFrontId, updater: (state: WotrPlayerUiState) => WotrPlayerUiState | null) {
    // this.updateUi (s => ({
    //   ...s,
    //   players: {
    //     ...s.localPlayers,
    //     [front]: updater (s.localPlayers[front])
    //   }
    // }));
  }

  async askConfirm (message: string) {
    this.updateUi (s => ({ ...s, message, canConfirm: true }));
    await this.confirm.get ();
    this.updateUi (s => ({ ...s, message: null, canConfirm: false }));
  }

  resetUi (): Partial<WotrGameUiState> {
    return {
      // message: null,
      // validRegions: null,
      // validUnits: null,
      // selectedUnits: null,
      // canPass: false,
      // canCancel: true,
      // maxNumberOfKnights: null,
      // validActions: null,
      // validBuildings: null,
      // validLands: null,
      // validResources: null
    };
  }

  // setFirstActionUi (player: string): Partial<WotrUiState> {
  //   return {
  //     turnPlayer: player,
  //     canCancel: false
  //   };
  // }

  setCurrentPlayerId (playerId: WotrFrontId | null) {
    patchState (this, { currentPlayerId: playerId });
    // this.updateUi ((s) => ({
    //   ...s,
    //   currentPlayerId: playerId,
    // }));
  }
  
}

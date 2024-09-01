import { Injectable, computed, inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { uiEvent } from "@leobg/commons/utils";
import { patchState, signalStore, withState } from "@ngrx/signals";
import { first, skip } from "rxjs/operators";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrPlayer } from "../player/wotr-player.models";
import { WotrPlayerStore } from "../player/wotr-player.store";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrGameStore } from "./wotr-game.store";

interface WotrUiState {
  currentPlayerId: WotrFrontId | null;
  turnPlayerId: WotrFrontId;
  canCancel: boolean;
  message: string | null;
  validRegions: WotrRegionId[] | null;
  canPass: boolean;
  canConfirm: boolean;
}

@Injectable ()
export class WotrUiStore extends signalStore (
  { protectedState: false },
  withState<WotrUiState> ({
    currentPlayerId: null,
    turnPlayerId: "free-peoples",
    canCancel: false,
    message: null,
    validRegions: null,
    canPass: false,
    canConfirm: false,
  })
) {
  
  private playerStore = inject (WotrPlayerStore);
  private game = inject (WotrGameStore);

  // validRegions = toSignal (this.select$ ((s) => s.validRegions), { requireSync: true });
  // canPass = toSignal (this.select$ ((s) => s.canPass), { requireSync: true });
  // canContinue = toSignal (this.select$ (s => s.canConfirm), { requireSync: true });
  // canCancel = toSignal (this.select$ (s => s.canCancel), { requireSync: true });
  // currentPlayerId = toSignal (this.select$ (s => s.currentPlayer), { requireSync: true });
  // turnPlayerId = toSignal (this.select$ (s => s.turnPlayer), { requireSync: true });
  // message = toSignal (this.select$ (s => s.message), { requireSync: true });

  currentPlayer = computed<WotrPlayer | null> (() => {
    const currentPlayerId = this.currentPlayerId ();
    if (currentPlayerId) {
      return this.playerStore.playerMap ()[currentPlayerId];
    } else {
      return null;
    }
  });

  turnPlayer = computed (() => {
    const turnPlayerId = this.turnPlayerId ();
    if (turnPlayerId) {
      return this.playerStore.playerMap ()[turnPlayerId];
    } else {
      return null;
    }
  });

  pass = uiEvent<void> ();
  confirm = uiEvent<void> ();
  cancel = uiEvent<void> ();
  selectRegion = uiEvent<WotrRegionId> ();

  _currentPlayerChange$ = toObservable (this.currentPlayerId).pipe (skip (1), first ());
  currentPlayerChange$ () { return this._currentPlayerChange$; }

  updateUi<
    S extends WotrUiState & {
      [K in keyof S]: K extends keyof WotrUiState ? WotrUiState[K] : never;
    }
  > (updater: (state: WotrUiState) => S) {
    patchState (this, updater);
  }

  resetUi (): Partial<WotrUiState> {
    return {
      message: null,
      validRegions: null,
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

import { Injectable, computed, inject } from "@angular/core";
import { uiEvent } from "@leobg/commons/utils";
import { patchState, signalStore, withState } from "@ngrx/signals";
import { WotrActionDieOrToken } from "../action/wotr-action.models";
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
  validActionFront: WotrFrontId | null;
  canPass: boolean;
  canConfirm: boolean;
  canContinue: boolean;
  canInputQuantity: WotrGameUiInputQuantity | false;
}

export interface WotrGameUiInputQuantity {
  min: number;
  max: number;
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
    validActionFront: null,
    canPass: false,
    canConfirm: false,
    canContinue: false,
    canInputQuantity: false
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
  continue = uiEvent<void> ();
  confirm = uiEvent<boolean> ();
  cancel = uiEvent<void> ();
  inputQuantity = uiEvent<number> ();
  region = uiEvent<WotrRegionId> ();
  action = uiEvent<WotrActionDieOrToken> ();
  player = uiEvent<WotrFrontId | null> ();

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

  async askContinue (message: string): Promise<void> {
    this.updateUi (s => ({ ...s, message, canContinue: true }));
    await this.continue.get ();
    this.updateUi (s => ({ ...s, message: null, canContinue: false }));
  }

  async askConfirm (message: string): Promise<boolean> {
    this.updateUi (s => ({ ...s, message, canConfirm: true }));
    const confirm = await this.confirm.get ();
    this.updateUi (s => ({ ...s, message: null, canConfirm: false }));
    return confirm;
  }

  async askQuantity (message: string, min: number, max: number): Promise<number> {
    this.updateUi (s => ({ ...s, message, canInputQuantity: { min, max } }));
    const quantity = await this.inputQuantity.get ();
    this.updateUi (s => ({ ...s, message: null, canInputQuantity: false }));
    return quantity;
  }

  async askRegion (validRegions: WotrRegionId[]): Promise<WotrRegionId> {
    this.updateUi (s => ({ ...s, message: "Select a region", validRegions }));
    const region = await this.region.get ();
    this.updateUi (s => ({ ...s, message: null, validRegions: null }));
    return region;
  }

  async askActionDie (message: string, frontId: WotrFrontId): Promise<WotrActionDieOrToken> {
    this.updateUi (s => ({ ...s, message, validActionFront: frontId }));
    const actionDieOrToken = await this.action.get ();
    this.updateUi (s => ({ ...s, message: null, validActionFront: null }));
    return actionDieOrToken;
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
    this.player.emit (playerId);
    patchState (this, { currentPlayerId: playerId });
  }
  
}

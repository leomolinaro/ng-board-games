import { Injectable, inject } from '@angular/core';
import { patchState, signalStore, withState } from '@ngrx/signals';
import { uiEvent } from '../../../../commons/utils/src';
import type {
  BritAreaId,
  BritColor,
  BritLandAreaId,
} from '../brit-components.models';
import type { BritAreaUnit } from '../brit-game-state.models';
import { BritGameStore } from './brit-game.store';

interface BritUiState {
  currentPlayer: BritColor | null;
  turnPlayer: BritColor;
  canCancel: boolean;
  message: string | null;
  validAreas: BritAreaId[] | null;
  validUnits: BritAreaUnit[] | null;
  selectedUnits: BritAreaUnit[] | null;
  // validResources: {
  //   player: string;
  //   resources: BritResourceType[]
  // } | null;
  // validActions: BritAction[] | null;
  // validBuildings: ("stronghold" | "village")[] | null;
  canPass: boolean;
  canConfirm: boolean;
}

@Injectable()
export class BritUiStore extends signalStore(
  { protectedState: false },
  withState<BritUiState>({
    currentPlayer: null,
    turnPlayer: 'yellow',
    canCancel: false,
    message: null,
    validAreas: null,
    validUnits: null,
    selectedUnits: null,
    // validActions: null,
    // validBuildings: null,
    // validResources: null,
    canPass: false,
    canConfirm: false,
  }),
) {
  private game = inject(BritGameStore);

  cancel = uiEvent<void>();
  setCanCancel(canCancel: boolean) {
    patchState(this, { canCancel });
  }
  areaChange = uiEvent<BritAreaId>();
  landAreaChange = uiEvent<BritLandAreaId>();
  unitChange = uiEvent<BritAreaUnit>();
  selectedUnitsChange = uiEvent<BritAreaUnit[]>();
  passChange = uiEvent<void>();
  confirmChange = uiEvent<void>();

  player = uiEvent<BritColor | null>();
  setCurrentPlayerId(playerId: BritColor | null) {
    this.player.emit(playerId);
    patchState(this, { currentPlayer: playerId });
  }

  updateUi<
    S extends BritUiState & {
      [K in keyof S]: K extends keyof BritUiState ? BritUiState[K] : never;
    },
  >(_actionName: string, updater: (state: BritUiState) => S) {
    patchState(this, updater);
  }

  resetUi(): Partial<BritUiState> {
    return {
      message: null,
      validAreas: null,
      validUnits: null,
      selectedUnits: null,
      // canPass: false,
      // canCancel: true,
      // maxNumberOfKnights: null,
      // validActions: null,
      // validBuildings: null,
      // validLands: null,
      // validResources: null
    };
  }

  // setFirstActionUi (player: string): Partial<BritUiState> {
  //   return {
  //     turnPlayer: player,
  //     canCancel: false
  //   };
  // }

  setCurrentPlayer(playerId: BritColor | null) {
    this.updateUi('Set current player', (s) => ({
      ...s,
      currentPlayer: playerId,
    }));
  }
}

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
  currentPlayer: BritColor | undefined;
  turnPlayer: BritColor;
  canCancel: boolean;
  message: string | undefined;
  validAreas: BritAreaId[] | undefined;
  validUnits: BritAreaUnit[] | undefined;
  selectedUnits: BritAreaUnit[] | undefined;
  // validResources: {
  //   player: string;
  //   resources: BritResourceType[]
  // } | undefined;
  // validActions: BritAction[] | undefined;
  // validBuildings: ("stronghold" | "village")[] | undefined;
  canPass: boolean;
  canConfirm: boolean;
}

@Injectable()
export class BritUiStore extends signalStore(
  { protectedState: false },
  withState<BritUiState>({
    currentPlayer: undefined,
    turnPlayer: 'yellow',
    canCancel: false,
    message: undefined,
    validAreas: undefined,
    validUnits: undefined,
    selectedUnits: undefined,
    // validActions: undefined,
    // validBuildings: undefined,
    // validResources: undefined,
    canPass: false,
    canConfirm: false,
  }),
) {
  private game = inject(BritGameStore);

  cancel = uiEvent<void>();
  setCanCancel(canCancel: boolean): void {
    patchState(this, { canCancel });
  }
  areaChange = uiEvent<BritAreaId>();
  landAreaChange = uiEvent<BritLandAreaId>();
  unitChange = uiEvent<BritAreaUnit>();
  selectedUnitsChange = uiEvent<BritAreaUnit[]>();
  passChange = uiEvent<void>();
  confirmChange = uiEvent<void>();

  player = uiEvent<BritColor | undefined>();
  setCurrentPlayerId(playerId: BritColor | undefined): void {
    this.player.emit(playerId);
    patchState(this, { currentPlayer: playerId });
  }

  updateUi<
    S extends BritUiState & {
      [K in keyof S]: K extends keyof BritUiState ? BritUiState[K] : never;
    },
  >(_actionName: string, updater: (state: BritUiState) => S): void {
    patchState(this, updater);
  }

  resetUi(): Partial<BritUiState> {
    return {
      message: undefined,
      validAreas: undefined,
      validUnits: undefined,
      selectedUnits: undefined,
      // canPass: false,
      // canCancel: true,
      // maxNumberOfKnights: undefined,
      // validActions: undefined,
      // validBuildings: undefined,
      // validLands: undefined,
      // validResources: undefined
    };
  }

  // setFirstActionUi (player: string): Partial<BritUiState> {
  //   return {
  //     turnPlayer: player,
  //     canCancel: false
  //   };
  // }

  setCurrentPlayer(playerId: BritColor | undefined): void {
    this.updateUi('Set current player', (s) => ({
      ...s,
      currentPlayer: playerId,
    }));
  }
}

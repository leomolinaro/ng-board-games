import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { uiEvent } from '@leobg/commons/utils';
import { patchState, signalStore, withState } from '@ngrx/signals';
import { first, type Observable, skip } from 'rxjs';
import type {
  BaronyAction,
  BaronyColor,
  BaronyLand,
  BaronyLandCoordinates,
  BaronyResourceType,
} from '../barony-models';
import { BaronyGameStore } from './barony-game.store';

interface BaronyUiState {
  currentPlayer: BaronyColor | null;
  turnPlayer: BaronyColor;
  canCancel: boolean;
  message: string | null;
  validLands: BaronyLandCoordinates[] | null;
  validResources: {
    player: string;
    resources: BaronyResourceType[];
  } | null;
  validActions: BaronyAction[] | null;
  validBuildings: ('stronghold' | 'village')[] | null;
  canPass: boolean;
  maxNumberOfKnights: number | null;
}

@Injectable()
export class BaronyUiStore extends signalStore(
  { protectedState: false },
  withState<BaronyUiState>({
    currentPlayer: null,
    turnPlayer: 'blue',
    canCancel: false,
    message: null,
    validLands: null,
    validActions: null,
    validBuildings: null,
    validResources: null,
    canPass: false,
    maxNumberOfKnights: null,
  }),
) {
  private game = inject(BaronyGameStore);

  actionSelect = uiEvent<BaronyAction>();
  landSelect = uiEvent<BaronyLand>();
  numberOfKnightsSelect = uiEvent<number>();
  passSelect = uiEvent<void>();
  buildingSelect = uiEvent<'village' | 'stronghold'>();
  resourceSelect = uiEvent<BaronyResourceType>();
  cancelSelect = uiEvent<void>();

  private currentPlayerId$ = toObservable(this.currentPlayer);
  private turnPlayerId$ = toObservable(this.turnPlayer);

  currentPlayerChange$(): Observable<BaronyColor | null> {
    return this.currentPlayerId$.pipe(skip(1), first());
  }

  updateUi<
    S extends BaronyUiState & {
      [K in keyof S]: K extends keyof BaronyUiState ? BaronyUiState[K] : never;
    },
  >(_actionName: string, updater: (state: BaronyUiState) => S): void {
    patchState(this, updater);
  }

  resetUi(): Partial<BaronyUiState> {
    return {
      message: null,
      canPass: false,
      canCancel: true,
      maxNumberOfKnights: null,
      validActions: null,
      validBuildings: null,
      validLands: null,
      validResources: null,
    };
  }

  setFirstActionUi(player: BaronyColor): Partial<BaronyUiState> {
    return {
      turnPlayer: player,
      canCancel: false,
    };
  }

  setCurrentPlayer(playerId: BaronyColor | null): void {
    this.updateUi('Set current player', (s) => ({
      ...s,
      currentPlayer: playerId,
    }));
  }
}

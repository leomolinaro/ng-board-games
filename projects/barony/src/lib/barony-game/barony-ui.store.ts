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
  currentPlayer: BaronyColor | undefined;
  turnPlayer: BaronyColor;
  canCancel: boolean;
  message: string | undefined;
  validLands: BaronyLandCoordinates[] | undefined;
  validResources:
    | {
        player: string;
        resources: BaronyResourceType[];
      }
    | undefined;
  validActions: BaronyAction[] | undefined;
  validBuildings: ('stronghold' | 'village')[] | undefined;
  canPass: boolean;
  maxNumberOfKnights: number | undefined;
}

@Injectable()
export class BaronyUiStore extends signalStore(
  { protectedState: false },
  withState<BaronyUiState>({
    currentPlayer: undefined,
    turnPlayer: 'blue',
    canCancel: false,
    message: undefined,
    validLands: undefined,
    validActions: undefined,
    validBuildings: undefined,
    validResources: undefined,
    canPass: false,
    maxNumberOfKnights: undefined,
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

  currentPlayerChange$(): Observable<BaronyColor | undefined> {
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
      message: undefined,
      canPass: false,
      canCancel: true,
      maxNumberOfKnights: undefined,
      validActions: undefined,
      validBuildings: undefined,
      validLands: undefined,
      validResources: undefined,
    };
  }

  setFirstActionUi(player: BaronyColor): Partial<BaronyUiState> {
    return {
      turnPlayer: player,
      canCancel: false,
    };
  }

  setCurrentPlayer(playerId: BaronyColor | undefined): void {
    this.updateUi('Set current player', (s) => ({
      ...s,
      currentPlayer: playerId,
    }));
  }
}

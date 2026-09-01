import { Injectable, inject } from '@angular/core';
import { patchState, signalStore, withState } from '@ngrx/signals';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { uiEvent } from '../../../../commons/utils/src';
import type { BritAreaId, BritColor } from '../brit-components.models';
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

  // actionChange (action: BritAction) { this.$actionChange.next (action); }
  passChange() {
    this.$passChange.next();
  }
  confirmChange() {
    this.$confirmChange.next();
  }
  // numberOfKnightsChange (numberOfKnights: number) { this.$numberOfKnightsChange.next (numberOfKnights); }
  areaChange(areaId: BritAreaId) {
    this.$areaChange.next(areaId);
  }
  unitChange(unit: BritAreaUnit) {
    this.$unitChange.next(unit);
  }
  selectedUnitsChange(units: BritAreaUnit[]) {
    this.$selectedUnitsChange.next(units);
  }
  // buildingChange (building: BritBuilding) { this.$buildingChange.next (building); }
  // resourceChange (resource: BritResourceType) { this.$resourceChange.next (resource); }
  cancel = uiEvent<void>();
  setCanCancel(canCancel: boolean) {
    patchState(this, { canCancel });
  }
  // private $actionChange = new Subject<BritAction> ();
  private $areaChange = new Subject<BritAreaId>();
  private $unitChange = new Subject<BritAreaUnit>();
  private $selectedUnitsChange = new Subject<BritAreaUnit[]>();
  private $passChange = new Subject<void>();
  private $confirmChange = new Subject<void>();
  // private $buildingChange = new Subject<"village" | "stronghold"> ();
  // private $resourceChange = new Subject<BritResourceType> ();
  // actionChange$ () { return this.$actionChange.asObservable ().pipe (first ()); }
  areaChange$<T extends BritAreaId = BritAreaId>(): Observable<T> {
    return (this.$areaChange as unknown as Subject<T>)
      .asObservable()
      .pipe(first());
  }
  unitChange$(): Observable<BritAreaUnit> {
    return this.$unitChange.asObservable().pipe(first());
  }
  selectedUnitsChange$(): Observable<BritAreaUnit[]> {
    return this.$selectedUnitsChange.asObservable().pipe(first());
  }
  // numberOfKnightsChange$ () { return this.$numberOfKnightsChange.asObservable ().pipe (first ()); }
  passChange$() {
    return this.$passChange.asObservable().pipe(first());
  }
  confirmChange$() {
    return this.$confirmChange.asObservable().pipe(first());
  }

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

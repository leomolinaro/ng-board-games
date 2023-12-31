import { Injectable } from "@angular/core";
import { BgStore } from "@leobg/commons";
import { Observable, Subject } from "rxjs";
import { first, skip } from "rxjs/operators";
import { BritAreaId } from "../brit-components.models";
import { BritAreaUnit } from "../brit-game-state.models";
import { BritGameStore } from "./brit-game.store";

interface BritUiState {
  currentPlayer: string | null;
  turnPlayer: string;
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
} // BritUiState

@Injectable ()
export class BritUiStore extends BgStore<BritUiState> {
  constructor (private game: BritGameStore) {
    super (
      {
        currentPlayer: null,
        turnPlayer: "",
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
      },
      "Brit UI"
    );
  } // constructor

  // actionChange (action: BritAction) { this.$actionChange.next (action); }
  passChange () {
    this.$passChange.next ();
  }
  confirmChange () {
    this.$confirmChange.next ();
  }
  // numberOfKnightsChange (numberOfKnights: number) { this.$numberOfKnightsChange.next (numberOfKnights); }
  areaChange (areaId: BritAreaId) {
    this.$areaChange.next (areaId);
  }
  unitChange (unit: BritAreaUnit) {
    this.$unitChange.next (unit);
  }
  selectedUnitsChange (units: BritAreaUnit[]) {
    this.$selectedUnitsChange.next (units);
  }
  // buildingChange (building: BritBuilding) { this.$buildingChange.next (building); }
  // resourceChange (resource: BritResourceType) { this.$resourceChange.next (resource); }
  cancelChange () {
    this.$cancelChange.next (void 0);
  }
  // private $actionChange = new Subject<BritAction> ();
  private $areaChange = new Subject<BritAreaId> ();
  private $unitChange = new Subject<BritAreaUnit> ();
  private $selectedUnitsChange = new Subject<BritAreaUnit[]> ();
  private $passChange = new Subject<void> ();
  private $confirmChange = new Subject<void> ();
  // private $buildingChange = new Subject<"village" | "stronghold"> ();
  // private $resourceChange = new Subject<BritResourceType> ();
  private $cancelChange = new Subject<void> ();
  // actionChange$ () { return this.$actionChange.asObservable ().pipe (first ()); }
  areaChange$<T extends BritAreaId = BritAreaId> (): Observable<T> {
    return (this.$areaChange as unknown as Subject<T>)
      .asObservable ()
      .pipe (first ());
  }
  unitChange$ (): Observable<BritAreaUnit> {
    return this.$unitChange.asObservable ().pipe (first ());
  }
  selectedUnitsChange$ (): Observable<BritAreaUnit[]> {
    return this.$selectedUnitsChange.asObservable ().pipe (first ());
  }
  // numberOfKnightsChange$ () { return this.$numberOfKnightsChange.asObservable ().pipe (first ()); }
  passChange$ () {
    return this.$passChange.asObservable ().pipe (first ());
  }
  confirmChange$ () {
    return this.$confirmChange.asObservable ().pipe (first ());
  }
  // buildingChange$ () { return this.$buildingChange.asObservable ().pipe (first ()); }
  // resourceChange$ () { return this.$resourceChange.asObservable ().pipe (first ()); }
  cancelChange$ () {
    return this.$cancelChange.asObservable ().pipe (first ());
  }
  currentPlayerChange$ () {
    return this.selectCurrentPlayerId$ ().pipe (skip (1), first ());
  }

  selectValidAreas$ () {
    return this.select$ ((s) => s.validAreas);
  }
  selectValidUnits$ () {
    return this.select$ ((s) => s.validUnits);
  }
  selectSelectedUnits$ () {
    return this.select$ ((s) => s.selectedUnits);
  }
  // selectValidResources$ () { return this.select$ (s => s.validResources); }
  // selectValidActions$ () { return this.select$ (s => s.validActions); }
  // selectValidBuildings$ () { return this.select$ (s => s.validBuildings); }
  selectCanPass$ () {
    return this.select$ ((s) => s.canPass);
  }
  selectCanContinue$ () {
    return this.select$ ((s) => s.canConfirm);
  }
  selectCanCancel$ () {
    return this.select$ ((s) => s.canCancel);
  }
  // selectMaxNumberOfKnights$ () { return this.select$ (s => s.maxNumberOfKnights); }
  selectCurrentPlayerId$ () {
    return this.select$ ((s) => s.currentPlayer);
  }
  getCurrentPlayerId () {
    return this.get ((s) => s.currentPlayer);
  }
  selectTurnPlayerId$ () {
    return this.select$ ((s) => s.turnPlayer);
  }
  selectMessage$ () {
    return this.select$ ((s) => s.message);
  }

  selectCurrentPlayer$ () {
    return this.game.select$ (
      this.selectCurrentPlayerId$ (),
      this.game.selectPlayerMap$ (),
      (playerId, playersMap) => (playerId ? playersMap[playerId] : null)
    );
  } // selectCurrentPlayer$

  selectTurnPlayer$ () {
    return this.game.select$ (
      this.selectTurnPlayerId$ (),
      this.game.selectPlayerMap$ (),
      (playerId, playersMap) => (playerId ? playersMap[playerId] : null)
    );
  } // selectCurrentPlayer$

  // selectOtherPlayers$ () {
  //   return this.game.select$ (
  //     this.selectCurrentPlayerId$ (),
  //     this.game.selectPlayerIds$ (),
  //     this.game.selectPlayerMap$ (),
  //     (currentPlayerId, playerIds, playerMap) => {
  //       if (currentPlayerId) {
  //         const n = playerIds.length;
  //         const toReturn: BritPlayer[] = [];
  //         const offset = playerIds.indexOf (currentPlayerId);
  //         for (let i = 1; i < n; i++) {
  //           toReturn.push (playerMap[playerIds[(offset + i) % n]]);
  //         } // for
  //         return toReturn;
  //       } else {
  //         return playerIds.map (id => playerMap[id]);
  //       } // if - else
  //     }
  //   );
  // } // selectOtherPlayers$

  updateUi<
    S extends BritUiState & {
      [K in keyof S]: K extends keyof BritUiState ? BritUiState[K] : never;
    }
  > (actionName: string, updater: (state: BritUiState) => S) {
    this.update (actionName, updater);
  } // updateUi

  resetUi (): Partial<BritUiState> {
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
  } // resetUi

  // setFirstActionUi (player: string): Partial<BritUiState> {
  //   return {
  //     turnPlayer: player,
  //     canCancel: false
  //   };
  // } // setFirstActionUi

  setCurrentPlayer (playerId: string | null) {
    this.updateUi ("Set current player", (s) => ({
      ...s,
      currentPlayer: playerId,
    }));
  } // setCurrentPlayer
} // BritUiStore

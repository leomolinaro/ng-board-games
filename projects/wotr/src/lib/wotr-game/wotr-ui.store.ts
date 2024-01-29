import { Injectable } from "@angular/core";
import { BgStore } from "@leobg/commons/utils";
import { Observable, Subject } from "rxjs";
import { first, skip } from "rxjs/operators";
import { WotrFrontId } from "../wotr-elements/wotr-front.models";
import { WotrRegionId } from "../wotr-elements/wotr-region.models";
import { WotrGameStore } from "./wotr-game.store";

interface WotrUiState {
  currentPlayer: WotrFrontId | null;
  turnPlayer: WotrFrontId;
  canCancel: boolean;
  message: string | null;
  validRegions: WotrRegionId[] | null;
  // validUnits: WotrRegionUnit[] | null;
  // selectedUnits: WotrRegionUnit[] | null;
  // validResources: {
  //   player: string;
  //   resources: WotrResourceType[]
  // } | null;
  // validActions: WotrAction[] | null;
  // validBuildings: ("stronghold" | "village")[] | null;
  canPass: boolean;
  canConfirm: boolean;
}

@Injectable ()
export class WotrUiStore extends BgStore<WotrUiState> {
  
  constructor (private game: WotrGameStore) {
    super ({
      currentPlayer: null,
      turnPlayer: "free-peoples",
      canCancel: false,
      message: null,
      validRegions: null,
      // validUnits: null,
      // selectedUnits: null,
      // validActions: null,
      // validBuildings: null,
      // validResources: null,
      canPass: false,
      canConfirm: false,
    },
    "Wotr UI");
  }

  // actionChange (action: WotrAction) { this.$actionChange.next (action); }
  passChange () { this.$passChange.next (); }
  confirmChange () { this.$confirmChange.next (); }
  // numberOfKnightsChange (numberOfKnights: number) { this.$numberOfKnightsChange.next (numberOfKnights); }
  regionChange (regionId: WotrRegionId) { this.$regionChange.next (regionId); }
  // unitChange (unit: WotrRegionUnit) {
  //   this.$unitChange.next (unit);
  // }
  // selectedUnitsChange (units: WotrRegionUnit[]) {
  //   this.$selectedUnitsChange.next (units);
  // }
  // buildingChange (building: WotrBuilding) { this.$buildingChange.next (building); }
  // resourceChange (resource: WotrResourceType) { this.$resourceChange.next (resource); }
  cancelChange () { this.$cancelChange.next (void 0); }
  // private $actionChange = new Subject<WotrAction> ();
  private $regionChange = new Subject<WotrRegionId> ();
  // private $unitChange = new Subject<WotrRegionUnit> ();
  // private $selectedUnitsChange = new Subject<WotrRegionUnit[]> ();
  private $passChange = new Subject<void> ();
  private $confirmChange = new Subject<void> ();
  
  private $testChange = new Subject<void> ();
  testChange () { this.$testChange.next (void 0); }
  testChange$ () { return this.$testChange.asObservable ().pipe (first ()); }

  // private $buildingChange = new Subject<"village" | "stronghold"> ();
  // private $resourceChange = new Subject<WotrResourceType> ();
  private $cancelChange = new Subject<void> ();
  // actionChange$ () { return this.$actionChange.asObservable ().pipe (first ()); }
  regionChange$<T extends WotrRegionId = WotrRegionId> (): Observable<T> {
    return (this.$regionChange as unknown as Subject<T>).asObservable ().pipe (first ());
  }
  // unitChange$ (): Observable<WotrRegionUnit> {
  //   return this.$unitChange.asObservable ().pipe (first ());
  // }
  // selectedUnitsChange$ (): Observable<WotrRegionUnit[]> {
  //   return this.$selectedUnitsChange.asObservable ().pipe (first ());
  // }
  // numberOfKnightsChange$ () { return this.$numberOfKnightsChange.asObservable ().pipe (first ()); }
  passChange$ () { return this.$passChange.asObservable ().pipe (first ()); }
  confirmChange$ () { return this.$confirmChange.asObservable ().pipe (first ()); }
  cancelChange$ () { return this.$cancelChange.asObservable ().pipe (first ()); }
  currentPlayerChange$ () { return this.selectCurrentPlayerId$ ().pipe (skip (1), first ()); }

  selectValidRegions$ () { return this.select$ ((s) => s.validRegions); }
  // selectValidUnits$ () {
  //   return this.select$ ((s) => s.validUnits);
  // }
  // selectSelectedUnits$ () {
  //   return this.select$ ((s) => s.selectedUnits);
  // }
  // selectValidResources$ () { return this.select$ (s => s.validResources); }
  // selectValidActions$ () { return this.select$ (s => s.validActions); }
  // selectValidBuildings$ () { return this.select$ (s => s.validBuildings); }
  selectCanPass$ () {
    return this.select$ ((s) => s.canPass);
  }
  selectCanContinue$ () { return this.select$ (s => s.canConfirm); }
  selectCanCancel$ () { return this.select$ (s => s.canCancel); }
  // selectMaxNumberOfKnights$ () { return this.select$ (s => s.maxNumberOfKnights); }
  selectCurrentPlayerId$ () { return this.select$ (s => s.currentPlayer); }
  getCurrentPlayerId () { return this.get (s => s.currentPlayer); }
  selectTurnPlayerId$ () { return this.select$ (s => s.turnPlayer); }
  message$ = this.select$ (s => s.message);

  selectCurrentPlayer$ () {
    return this.game.select$ (
      this.selectCurrentPlayerId$ (),
      this.game.playerMap$,
      (playerId, playersMap) => (playerId ? playersMap[playerId] : null)
    );
  }

  selectTurnPlayer$ () {
    return this.game.select$ (
      this.selectTurnPlayerId$ (),
      this.game.playerMap$,
      (playerId, playersMap) => (playerId ? playersMap[playerId] : null)
    );
  }

  // selectOtherPlayers$ () {
  //   return this.game.select$ (
  //     this.selectCurrentPlayerId$ (),
  //     this.game.selectPlayerIds$ (),
  //     this.game.selectPlayerMap$ (),
  //     (currentPlayerId, playerIds, playerMap) => {
  //       if (currentPlayerId) {
  //         const n = playerIds.length;
  //         const toReturn: WotrPlayer[] = [];
  //         const offset = playerIds.indexOf (currentPlayerId);
  //         for (let i = 1; i < n; i++) {
  //           toReturn.push (playerMap[playerIds[(offset + i) % n]]);
  //         }
  //         return toReturn;
  //       } else {
  //         return playerIds.map (id => playerMap[id]);
  //       }
  //     }
  //   );
  // }

  updateUi<
    S extends WotrUiState & {
      [K in keyof S]: K extends keyof WotrUiState ? WotrUiState[K] : never;
    }
  > (actionName: string, updater: (state: WotrUiState) => S) {
    this.update (actionName, updater);
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

  setCurrentPlayer (playerId: WotrFrontId | null) {
    this.updateUi ("Set current player", (s) => ({
      ...s,
      currentPlayer: playerId,
    }));
  }
  
}

import { Injectable } from "@angular/core";
import { BgStore } from "@bg-utils";
import { Subject } from "rxjs";
import { first, skip } from "rxjs/operators";
// import { BritAction, BritBuilding, BritLand, BritLandCoordinates, BritPlayer, BritResourceType } from "../brit-models";
import { BritGameStore } from "./brit-game.store";

interface BritUiState {
  currentPlayer: string | null;
  turnPlayer: string;
  canCancel: boolean;
  message: string | null;
  // validLands: BritLandCoordinates[] | null;
  // validResources: {
  //   player: string;
  //   resources: BritResourceType[]
  // } | null;
  // validActions: BritAction[] | null;
  // validBuildings: ("stronghold" | "village")[] | null;
  // canPass: boolean;
  // maxNumberOfKnights: number | null;
} // BritUiState

@Injectable ()
export class BritUiStore extends BgStore<BritUiState> {

  constructor (
    private game: BritGameStore
  ) {
    super ({
      currentPlayer: null,
      turnPlayer: "",
      canCancel: false,
      message: null,
      // validLands: null,
      // validActions: null,
      // validBuildings: null,
      // validResources: null,
      // canPass: false,
      // maxNumberOfKnights: null
    }, "Brit UI");
  } // constructor

  // actionChange (action: BritAction) { this.$actionChange.next (action); }
  // passChange () { this.$passChange.next (); }
  // numberOfKnightsChange (numberOfKnights: number) { this.$numberOfKnightsChange.next (numberOfKnights); }
  // landTileChange (landTile: BritLand) { this.$landTileChange.next (landTile); }
  // buildingChange (building: BritBuilding) { this.$buildingChange.next (building); }
  // resourceChange (resource: BritResourceType) { this.$resourceChange.next (resource); }
  cancelChange () { this.$cancelChange.next (void 0); }
  // private $actionChange = new Subject<BritAction> ();
  // private $landTileChange = new Subject<BritLand> ();
  // private $numberOfKnightsChange = new Subject<number> ();
  // private $passChange = new Subject<void> ();
  // private $buildingChange = new Subject<"village" | "stronghold"> ();
  // private $resourceChange = new Subject<BritResourceType> ();
  private $cancelChange = new Subject<void> ();
  // actionChange$ () { return this.$actionChange.asObservable ().pipe (first ()); }
  // landChange$ () { return this.$landTileChange.asObservable ().pipe (first ()); }
  // numberOfKnightsChange$ () { return this.$numberOfKnightsChange.asObservable ().pipe (first ()); }
  // passChange$ () { return this.$passChange.asObservable ().pipe (first ()); }
  // buildingChange$ () { return this.$buildingChange.asObservable ().pipe (first ()); }
  // resourceChange$ () { return this.$resourceChange.asObservable ().pipe (first ()); }
  cancelChange$ () { return this.$cancelChange.asObservable ().pipe (first ()); }
  currentPlayerChange$ () { return this.selectCurrentPlayerId$ ().pipe (skip (1), first ()); }

  // selectValidLands$ () { return this.select$ (s => s.validLands); }
  // selectValidResources$ () { return this.select$ (s => s.validResources); }
  // selectValidActions$ () { return this.select$ (s => s.validActions); }
  // selectValidBuildings$ () { return this.select$ (s => s.validBuildings); }
  // selectCanPass$ () { return this.select$ (s => s.canPass); }
  // selectCanCancel$ () { return this.select$ (s => s.canCancel); }
  // selectMaxNumberOfKnights$ () { return this.select$ (s => s.maxNumberOfKnights); }
  selectCurrentPlayerId$ () { return this.select$ (s => s.currentPlayer); }
  getCurrentPlayerId () { return this.get (s => s.currentPlayer); }
  // selectTurnPlayerId$ () { return this.select$ (s => s.turnPlayer); }
  // selectMessage$ () { return this.select$ (s => s.message); }

  // selectCurrentPlayer$ () {
  //   return this.game.select$ (
  //     this.selectCurrentPlayerId$ (),
  //     this.game.selectPlayerMap$ (),
  //     (playerId, playersMap) => playerId ? playersMap[playerId] : null
  //   );
  // } // selectCurrentPlayer$

  // selectTurnPlayer$ () {
  //   return this.game.select$ (
  //     this.selectTurnPlayerId$ (),
  //     this.game.selectPlayerMap$ (),
  //     (playerId, playersMap) => playerId ? playersMap[playerId] : null
  //   );
  // } // selectCurrentPlayer$

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

  updateUi<S extends BritUiState & { [K in keyof S]: K extends keyof BritUiState ? BritUiState[K] : never }> (
    actionName: string,
    updater: (state: BritUiState) => S
  ) {
    this.update (actionName, updater);
  } // updateUi

  resetUi (): Partial<BritUiState> {
    return {
      // message: null,
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
    this.updateUi ("Set current player", s => ({ ...s, currentPlayer: playerId }));
  } // setCurrentPlayer

} // BritUiStore
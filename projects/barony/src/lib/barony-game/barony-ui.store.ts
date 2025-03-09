import { Injectable, inject } from "@angular/core";
import { BgStore } from "@leobg/commons/utils";
import { Subject } from "rxjs";
import { first, skip } from "rxjs/operators";
import { BaronyAction, BaronyBuilding, BaronyColor, BaronyLand, BaronyLandCoordinates, BaronyResourceType } from "../barony-models";
import { BaronyGameStore } from "./barony-game.store";

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
  validBuildings: ("stronghold" | "village")[] | null;
  canPass: boolean;
  maxNumberOfKnights: number | null;
} // BaronyUiState

@Injectable ()
export class BaronyUiStore extends BgStore<BaronyUiState> {
  
  private game = inject (BaronyGameStore);

  constructor () {
    super (
      {
        currentPlayer: null,
        turnPlayer: "blue",
        canCancel: false,
        message: null,
        validLands: null,
        validActions: null,
        validBuildings: null,
        validResources: null,
        canPass: false,
        maxNumberOfKnights: null,
      },
      "Barony UI"
    );
  } // constructor

  actionChange (action: BaronyAction) {
    this.$actionChange.next (action);
  }
  passChange () {
    this.$passChange.next ();
  }
  numberOfKnightsChange (numberOfKnights: number) {
    this.$numberOfKnightsChange.next (numberOfKnights);
  }
  landTileChange (landTile: BaronyLand) {
    this.$landTileChange.next (landTile);
  }
  buildingChange (building: BaronyBuilding) {
    this.$buildingChange.next (building);
  }
  resourceChange (resource: BaronyResourceType) {
    this.$resourceChange.next (resource);
  }
  cancelChange () {
    this.$cancelChange.next (void 0);
  }
  private $actionChange = new Subject<BaronyAction> ();
  private $landTileChange = new Subject<BaronyLand> ();
  private $numberOfKnightsChange = new Subject<number> ();
  private $passChange = new Subject<void> ();
  private $buildingChange = new Subject<"village" | "stronghold"> ();
  private $resourceChange = new Subject<BaronyResourceType> ();
  private $cancelChange = new Subject<void> ();
  actionChange$ () {
    return this.$actionChange.asObservable ().pipe (first ());
  }
  landChange$ () {
    return this.$landTileChange.asObservable ().pipe (first ());
  }
  numberOfKnightsChange$ () {
    return this.$numberOfKnightsChange.asObservable ().pipe (first ());
  }
  passChange$ () {
    return this.$passChange.asObservable ().pipe (first ());
  }
  buildingChange$ () {
    return this.$buildingChange.asObservable ().pipe (first ());
  }
  resourceChange$ () {
    return this.$resourceChange.asObservable ().pipe (first ());
  }
  cancelChange$ () {
    return this.$cancelChange.asObservable ().pipe (first ());
  }
  currentPlayerChange$ () {
    return this.selectCurrentPlayerId$ ().pipe (skip (1), first ());
  }

  selectValidLands$ () { return this.select$ (s => s.validLands); }
  selectValidResources$ () { return this.select$ (s => s.validResources); }
  selectValidActions$ () { return this.select$ (s => s.validActions); }
  selectValidBuildings$ () { return this.select$ (s => s.validBuildings); }
  selectCanPass$ () { return this.select$ (s => s.canPass); }
  selectCanCancel$ () { return this.select$ (s => s.canCancel); }
  selectMaxNumberOfKnights$ () { return this.select$ (s => s.maxNumberOfKnights); }
  selectCurrentPlayerId$ () { return this.select$ (s => s.currentPlayer); }
  getCurrentPlayerId () { return this.get (s => s.currentPlayer); }
  selectTurnPlayerId$ () { return this.select$ (s => s.turnPlayer); }
  selectMessage$ () { return this.select$ (s => s.message); }

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

  selectPlayers$ () {
    return this.game.select$ (
      this.game.selectPlayerIds$ (),
      this.game.selectPlayerMap$ (),
      (playerIds, playerMap) => playerIds.map ((id) => playerMap[id])
    );
  } // selectPlayers$

  updateUi<
    S extends BaronyUiState & {
      [K in keyof S]: K extends keyof BaronyUiState ? BaronyUiState[K] : never;
    }
  > (actionName: string, updater: (state: BaronyUiState) => S) {
    this.update (actionName, updater);
  } // updateUi

  resetUi (): Partial<BaronyUiState> {
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
  } // resetUi

  setFirstActionUi (player: BaronyColor): Partial<BaronyUiState> {
    return {
      turnPlayer: player,
      canCancel: false,
    };
  }

  setCurrentPlayer (playerId: BaronyColor | null) {
    this.updateUi ("Set current player", (s) => ({
      ...s,
      currentPlayer: playerId,
    }));
  }

}

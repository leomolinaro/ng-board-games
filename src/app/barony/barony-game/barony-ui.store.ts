import { Injectable } from "@angular/core";
import { BgStore } from "@bg-utils";
import { BehaviorSubject, Subject } from "rxjs";
import { first } from "rxjs/operators";
import { BaronyGameStore } from "../logic";
import { BaronyAction, BaronyBuilding, BaronyLand, BaronyLandCoordinates, BaronyPlayer, BaronyResourceType } from "../models";

interface BaronyUiState {
  currentPlayer: string | null;
  turnPlayer: string;
  canCancel: boolean;
  message: string | null;
  validLands: BaronyLandCoordinates[] | null;
  validResources: {
    player: string;
    resources: BaronyResourceType[]
  } | null;
  validActions: BaronyAction[] | null;
  validBuildings: ("stronghold" | "village")[] | null;
  canPass: boolean;
  maxNumberOfKnights: number | null;
} // BaronyUiState

@Injectable ()
export class BaronyUiStore extends BgStore<BaronyUiState> {

  constructor (
    private game: BaronyGameStore
  ) {
    super ({
      currentPlayer: null,
      turnPlayer: "",
      canCancel: false,
      message: null,
      validLands: null,
      validActions: null,
      validBuildings: null,
      validResources: null,
      canPass: false,
      maxNumberOfKnights: null
    });
  } // constructor

  actionChange (action: BaronyAction) { this.$actionChange.next (action); }
  passChange () { this.$passChange.next (); }
  numberOfKnightsChange (numberOfKnights: number) { this.$numberOfKnightsChange.next (numberOfKnights); }
  landTileChange (landTile: BaronyLand) { this.$landTileChange.next (landTile); }
  buildingChange (building: BaronyBuilding) { this.$buildingChange.next (building); }
  resourceChange (resource: BaronyResourceType) { this.$resourceChange.next (resource); }
  cancelChange () { this.$cancelChange.next (); }
  private $actionChange = new Subject<BaronyAction> ();
  private $landTileChange = new Subject<BaronyLand> ();
  private $numberOfKnightsChange = new Subject<number> ();
  private $passChange = new Subject<void> ();
  private $buildingChange = new Subject<"village" | "stronghold"> ();
  private $resourceChange = new Subject<BaronyResourceType> ();
  private $cancelChange = new BehaviorSubject<void> (void 0);
  actionChange$ () { return this.$actionChange.asObservable ().pipe (first ()); }
  landChange$ () { return this.$landTileChange.asObservable ().pipe (first ()); }
  numberOfKnightsChange$ () { return this.$numberOfKnightsChange.asObservable ().pipe (first ()); }
  passChange$ () { return this.$passChange.asObservable ().pipe (first ()); }
  buildingChange$ () { return this.$buildingChange.asObservable ().pipe (first ()); }
  resourceChange$ () { return this.$resourceChange.asObservable ().pipe (first ()); }
  cancelChange$ () { return this.$cancelChange.asObservable (); }

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
      (playerId, playersMap) => playerId ? playersMap[playerId] : null
    );
  } // selectCurrentPlayer$

  selectTurnPlayer$ () {
    return this.game.select$ (
      this.selectTurnPlayerId$ (),
      this.game.selectPlayerMap$ (),
      (playerId, playersMap) => playerId ? playersMap[playerId] : null
    );
  } // selectCurrentPlayer$

  selectOtherPlayers$ () {
    return this.game.select$ (
      this.selectCurrentPlayerId$ (),
      this.game.selectPlayerIds$ (),
      this.game.selectPlayerMap$ (),
      (currentPlayerId, playerIds, playerMap) => {
        if (currentPlayerId) {
          const n = playerIds.length;
          const toReturn: BaronyPlayer[] = [];
          const offset = playerIds.indexOf (currentPlayerId);
          for (let i = 1; i < n; i++) {
            toReturn.push (playerMap[playerIds[(offset + i) % n]]);
          } // for
          return toReturn;
        } else {
          return playerIds.map (id => playerMap[id]);
        } // if - else
      }
    );
  } // selectOtherPlayers$

  updateUi<S extends BaronyUiState & { [K in keyof S]: K extends keyof BaronyUiState ? BaronyUiState[K] : never }> (
    updater: (state: BaronyUiState) => S
  ) {
    this.update (updater);
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
      validResources: null
    };
  } // resetUi

  setFirstActionUi (player: string): Partial<BaronyUiState> {
    return {
      turnPlayer: player,
      canCancel: false
    };
  } // setFirstActionUi

  setCurrentPlayer (playerId: string | null) {
    this.updateUi (s => ({ ...s, currentPlayer: playerId }));
  } // setCurrentPlayer

} // BaronyUiStore

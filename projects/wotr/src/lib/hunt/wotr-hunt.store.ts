import { Injectable, Signal } from "@angular/core";
import { immutableUtil } from "@leobg/commons/utils";
import { WotrHuntTile, WotrHuntTileId } from "./wotr-hunt.models";

export interface WotrHuntState {
  map: Record<WotrHuntTileId, WotrHuntTile>;
  huntPool: WotrHuntTileId[];
  huntDrawn: WotrHuntTileId[];
  huntReady: WotrHuntTileId[];
  huntAvailable: WotrHuntTileId[];
  huntRemoved: WotrHuntTileId[];
  nHuntDice: number;
  nFreePeopleDice: number;
}

export function initialeState (): WotrHuntState {
  return {
    map: {
      3: { id: "3", type: "standard", quantity: 3 },
      2: { id: "2", type: "standard", quantity: 2 },
      1: { id: "1", type: "standard", quantity: 1 },
      er: { id: "er", type: "standard", eye: true, reveal: true },
      "2r": { id: "2r", type: "standard", quantity: 2, reveal: true },
      "1r": { id: "1r", type: "standard", quantity: 1, reveal: true },
      "0r": { id: "0r", type: "standard", quantity: 0, reveal: true },
      b0: { id: "b0", type: "free-people-special", quantity: 0 },
      "b-1": { id: "b-1", type: "free-people-special", quantity: -1 },
      "b-2": { id: "b-2", type: "free-people-special", quantity: -2 },
      r1rs: { id: "r1rs", type: "shadow-special", quantity: 1, reveal: true, stop: true },
      r3s: { id: "r3s", type: "shadow-special", quantity: 3, stop: true },
      rds: { id: "rds", type: "shadow-special", dice: true, stop: true },
      rers: { id: "rers", type: "shadow-special", eye: true, reveal: true, stop: true }
    },
    huntPool: ["3", "3", "3", "2", "2", "1", "1", "er", "er", "er", "er", "2r", "1r", "1r", "0r", "0r"],
    huntDrawn: [],
    huntReady: [],
    huntAvailable: ["b0", "b0", "b-1", "b-2", "r1rs", "r3s", "rds", "rers"],
    huntRemoved: [],
    nHuntDice: 0,
    nFreePeopleDice: 0
  };
}

@Injectable ({
  providedIn: "root"
})
export class WotrHuntStore {

  update!: (actionName: string, updater: (a: WotrHuntState) => WotrHuntState) => void;
  state!: Signal<WotrHuntState>;

  huntTile (huntTileId: WotrHuntTileId): WotrHuntTile { return this.state ().map[huntTileId]; }
  hasHuntDice (): boolean { return !!this.state ().nHuntDice; }
  getNTotalDice (): number { return this.state ().nHuntDice + this.state ().nFreePeopleDice; }

  incrementFreePeopleDice (): void {
    this.update ("incrementFreePeopleDice", state => ({
      ...state,
      nFreePeopleDice: state.nFreePeopleDice + 1
    }));
  }

  addHuntDice (quantity: number): void {
    this.update ("addHuntDice", state => ({
      ...state,
      nHuntDice: quantity + state.nHuntDice
    }));
  }

  addFellowshipDie (): void {
    this.update ("addFellowshipDie", state => ({
      ...state,
      nFreePeopleDice: 1 + state.nFreePeopleDice
    }));
  }

  resetHuntBox (): void {
    this.update ("resetHuntBox", state => ({
      ...state,
      nHuntDice: 0,
      nFreePeopleDice: 0
    }));
  }

  drawHuntTile (tile: WotrHuntTileId): void {
    this.update ("drawHuntTile", state => ({
      ...state,
      huntPool: immutableUtil.listRemoveFirst (h => h === tile, state.huntPool),
      huntDrawn: immutableUtil.listPush ([tile], state.huntDrawn)
    }));
  }

  moveAvailableTileToReady (tile: WotrHuntTileId): void {
    this.update ("moveAvailableTileToReady", state => ({
      ...state,
      huntReady: immutableUtil.listPush ([tile], state.huntReady),
      huntAvailable: immutableUtil.listRemoveFirst (h => h === tile, state.huntAvailable),
    }));
  }

  moveAvailableTileToPool (tile: WotrHuntTileId): void {
    this.update ("moveAvailableTileToPool", state => ({
      ...state,
      huntReady: immutableUtil.listPush ([tile], state.huntReady),
      huntPool: immutableUtil.listRemoveFirst (h => h === tile, state.huntPool),
    }));
  }

  moveDrawnEyeTilesToAvailable () {
    this.update ("moveDrawnEyeTilesToAvailable", state => {
      const eyeTiles = state.huntDrawn.filter (t => !!state.map[t].eye);
      const newHuntDrawn = immutableUtil.listRemoveAll (t => !!state.map[t].eye, state.huntDrawn);
      const newHuntPool = immutableUtil.listPush (eyeTiles, state.huntPool);
      return { ...state, huntDrawn: newHuntDrawn, huntPool: newHuntPool };
    });
  }

  moveReadyTilesToAvailable () {
    this.update ("moveReadyTilesToAvailable", state => {
      const newHuntPool = immutableUtil.listPush (state.huntAvailable, state.huntPool);
      return { ...state, huntAvailable: [], huntPool: newHuntPool };
    });
  }

}

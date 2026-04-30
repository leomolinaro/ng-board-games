import { inject, Injectable, Signal } from "@angular/core";
import { immutableUtil } from "@leobg/commons/utils";
import { KomeSovereignId } from "../character/wotr-character-models";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrHuntTile, WotrHuntTileId } from "./wotr-hunt-models";

export interface WotrHuntState {
  map: Record<WotrHuntTileId, WotrHuntTile>;
  huntPool: WotrHuntTileId[];
  huntDrawn: WotrHuntTileId[];
  huntReady: WotrHuntTileId[];
  huntAvailable: WotrHuntTileId[];
  huntRemoved: WotrHuntTileId[];
  nHuntDice: number;
  nFreePeopleDice: number;
  previousTurnNFreePeopleDice: number;
  inProgress: boolean;
  corruptionAttempt: KomeCorruptionAttemptState | null;
}

export interface KomeCorruptionAttemptState {
  sovereign: KomeSovereignId;
  drawnTiles: WotrHuntTileId[];
}

export function initialeState(): WotrHuntState {
  return {
    map: {
      3: { id: "3", type: "standard", quantity: 3 },
      2: { id: "2", type: "standard", quantity: 2 },
      1: { id: "1", type: "standard", quantity: 1 },
      "er": { id: "er", type: "standard", eye: true, reveal: true },
      "2r": { id: "2r", type: "standard", quantity: 2, reveal: true },
      "1r": { id: "1r", type: "standard", quantity: 1, reveal: true },
      "0r": { id: "0r", type: "standard", quantity: 0, reveal: true },
      "b0": { id: "b0", type: "free-people-special", quantity: 0 },
      "b-1": { id: "b-1", type: "free-people-special", quantity: -1 },
      "b-2": { id: "b-2", type: "free-people-special", quantity: -2 },
      "r1rs": { id: "r1rs", type: "shadow-special", quantity: 1, reveal: true, stop: true },
      "r3s": { id: "r3s", type: "shadow-special", quantity: 3, stop: true },
      "rds": { id: "rds", type: "shadow-special", dice: true, stop: true },
      "rers": { id: "rers", type: "shadow-special", eye: true, reveal: true, stop: true },
      // Kome tiles
      "1km": { id: "1km", type: "standard", quantity: 1, crown: true },
      "2km": { id: "2km", type: "standard", quantity: 2, crown: true }
    },
    huntPool: [],
    huntDrawn: [],
    huntReady: [],
    huntAvailable: ["b0", "b0", "b-1", "b-2", "r1rs", "r3s", "rds", "rers"],
    huntRemoved: [],
    nHuntDice: 0,
    nFreePeopleDice: 0,
    previousTurnNFreePeopleDice: 0,
    inProgress: false,
    corruptionAttempt: null
  };
}

@Injectable()
export class WotrHuntStore {
  private fellowship = inject(WotrFellowshipStore);

  update!: (actionName: string, updater: (a: WotrHuntState) => WotrHuntState) => void;
  state!: Signal<WotrHuntState>;

  inProgress(): boolean {
    return this.state().inProgress;
  }
  huntTile(huntTileId: WotrHuntTileId): WotrHuntTile {
    return this.state().map[huntTileId];
  }
  hasHuntDice(): boolean {
    return !!this.state().nHuntDice;
  }
  nTotalDice(): number {
    return this.state().nHuntDice + this.state().nFreePeopleDice;
  }
  nHuntDice(): number {
    return this.state().nHuntDice;
  }
  huntPool(): WotrHuntTileId[] {
    return this.state().huntPool;
  }
  getCorruptionAttempt(): KomeCorruptionAttemptState | null {
    return this.state().corruptionAttempt;
  }

  setHuntPool(huntPool: WotrHuntTileId[]): void {
    this.update("setHuntPool", state => ({
      ...state,
      huntPool
    }));
  }

  setInProgress(inProgress: boolean): void {
    this.update("setInProgress", state => ({
      ...state,
      inProgress
    }));
  }

  incrementFreePeopleDice(): void {
    this.update("incrementFreePeopleDice", state => ({
      ...state,
      nFreePeopleDice: state.nFreePeopleDice + 1
    }));
  }

  addHuntDice(quantity: number): void {
    this.update("addHuntDice", state => ({
      ...state,
      nHuntDice: quantity + state.nHuntDice
    }));
  }

  removeHuntDice(quantity: number): void {
    this.update("removeHuntDice", state => ({
      ...state,
      nHuntDice: Math.max(state.nHuntDice - quantity, 0)
    }));
  }

  addFellowshipDie(): void {
    this.update("addFellowshipDie", state => ({
      ...state,
      nFreePeopleDice: 1 + state.nFreePeopleDice
    }));
  }

  resetHuntBox(): void {
    this.update("resetHuntBox", state => ({
      ...state,
      nHuntDice: 0,
      nFreePeopleDice: 0,
      previousTurnNFreePeopleDice: state.nFreePeopleDice
    }));
  }

  drawHuntTile(tile: WotrHuntTileId): void {
    this.update("drawHuntTile", state => ({
      ...state,
      huntPool: immutableUtil.listRemoveFirst(h => h === tile, state.huntPool),
      huntDrawn: immutableUtil.listPush([tile], state.huntDrawn)
    }));
  }

  drawCorruptionTile(tile: WotrHuntTileId): void {
    this.update("drawCorruptionTile", state => ({
      ...state,
      huntPool: immutableUtil.listRemoveFirst(h => h === tile, state.huntPool)
    }));
  }

  moveAvailableTileToReady(tile: WotrHuntTileId): void {
    this.update("moveAvailableTileToReady", state => ({
      ...state,
      huntReady: immutableUtil.listPush([tile], state.huntReady),
      huntAvailable: immutableUtil.listRemoveFirst(h => h === tile, state.huntAvailable)
    }));
  }

  returnDrawnTileToPool(tile: WotrHuntTileId): void {
    this.update("returnDrawnTileToAvailable", state => ({
      ...state,
      huntPool: immutableUtil.listPush([tile], state.huntPool),
      huntDrawn: immutableUtil.listRemoveFirst(h => h === tile, state.huntDrawn)
    }));
  }

  removeDrawnTilesFromGame(tile: WotrHuntTileId): void {
    this.update("removeDrawnTilesFromGame", state => ({
      ...state,
      huntDrawn: immutableUtil.listRemoveFirst(h => h === tile, state.huntDrawn),
      huntRemoved: immutableUtil.listPush([tile], state.huntRemoved)
    }));
  }

  moveAvailableTileToPool(tile: WotrHuntTileId): void {
    this.update("moveAvailableTileToPool", state => ({
      ...state,
      huntPool: immutableUtil.listPush([tile], state.huntPool),
      huntAvailable: immutableUtil.listRemoveFirst(h => h === tile, state.huntAvailable)
    }));
  }

  moveDrawnEyeTilesToAvailable() {
    this.update("moveDrawnEyeTilesToAvailable", state => {
      const eyeTiles = state.huntDrawn.filter(t => !!state.map[t].eye);
      const newHuntDrawn = immutableUtil.listRemoveAll(t => !!state.map[t].eye, state.huntDrawn);
      const newHuntPool = immutableUtil.listPush(eyeTiles, state.huntPool);
      return { ...state, huntDrawn: newHuntDrawn, huntPool: newHuntPool };
    });
  }

  moveReadyTilesToPool() {
    this.update("moveReadyTilesToPool", state => {
      const newHuntPool = immutableUtil.listPush(state.huntReady, state.huntPool);
      return { ...state, huntReady: [], huntPool: newHuntPool };
    });
  }

  maximumNumberOfHuntDice(): number {
    return Math.max(this.fellowship.numberOfCompanions(), 1);
  }

  minimumNumberOfHuntDice(): number {
    return this.state().previousTurnNFreePeopleDice > 0 ? 1 : 0;
  }

  startCorruptionAttempt(sovereign: KomeSovereignId, tile: WotrHuntTileId): void {
    this.update("startCorruptionAttempt", state => ({
      ...state,
      corruptionAttempt: { sovereign, drawnTiles: [tile] }
    }));
  }

  continueCorruptionAttempt(tile: WotrHuntTileId): void {
    this.update("continueCorruptionAttempt", state => ({
      ...state,
      corruptionAttempt: state.corruptionAttempt
        ? { ...state.corruptionAttempt, drawnTiles: [...state.corruptionAttempt.drawnTiles, tile] }
        : null
    }));
  }

  resetCorruptionAttempt(choosenTile: WotrHuntTileId): void {
    this.update("resetCorruptionAttempt", state => ({
      ...state,
      corruptionAttempt: null,
      huntPool: immutableUtil.listPush(
        state.corruptionAttempt!.drawnTiles.filter(t => t !== choosenTile),
        state.huntPool
      )
    }));
  }

  resetCorruptionTiles(corruptionTiles: WotrHuntTileId[]) {
    const huntTile = this.getHighestNumberedTile(corruptionTiles);
    this.update("resetCorruptionTiles", state => ({
      ...state,
      huntPool: immutableUtil.listPush(
        corruptionTiles.filter(t => t !== huntTile.id),
        state.huntPool
      ),
      huntRemoved: immutableUtil.listPush([huntTile.id], state.huntRemoved)
    }));
  }

  private getHighestNumberedTile(tileIds: WotrHuntTileId[]): WotrHuntTile {
    return tileIds.reduce((highest, tileId) => {
      const tile = this.huntTile(tileId);
      const highestNumber = highest.quantity ?? 0;
      const tileNumber = tile.quantity ?? 0;
      return tileNumber > highestNumber ? tile : highest;
    }, this.huntTile(tileIds[0]));
  }
}

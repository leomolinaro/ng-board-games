import { Injectable, Signal } from "@angular/core";
import { immutableUtil } from "@leobg/commons/utils";
import { WotrHuntTile } from "./wotr-hunt.models";

export interface WotrHuntState {
  huntPool: WotrHuntTile[];
  huntDrawn: WotrHuntTile[];
  huntReady: WotrHuntTile[];
  huntAvailable: WotrHuntTile[];
  huntRemoved: WotrHuntTile[];
  nHuntDice: number;
  nFreePeopleDice: number;
}

@Injectable ()
export class WotrHuntStore {

  update!: (actionName: string, updater: (a: WotrHuntState) => WotrHuntState) => void;
  state!: Signal<WotrHuntState>;

  init (): WotrHuntState {
    return {
      huntPool: ["3", "3", "3", "2", "2", "1", "1", "er", "er", "er", "er", "2r", "1r", "1r", "0r", "0r"],
      huntDrawn: [],
      huntReady: [],
      huntAvailable: ["b0", "b-1", "b-2", "er", "r1rs", "r3s", "rds", "rers"],
      huntRemoved: [],
      nHuntDice: 0,
      nFreePeopleDice: 0
    };
  }

  incrementFreePeopleDice (): void {
    this.update ("incrementFreePeopleDice", state => ({
      ...state,
      nFreePeopleDice: state.nFreePeopleDice + 1
    }));
  }

  setHuntDice (quantity: number): void {
    this.update ("setHuntDice", state => ({
      ...state,
      nHuntDice: quantity
    }));
  }

  drawHuntTile (tile: WotrHuntTile): void {
    this.update ("drawHuntTile", state => ({
      ...state,
      huntPool: immutableUtil.listRemoveFirst (h => h === tile, state.huntPool),
      huntDrawn: immutableUtil.listPush ([tile], state.huntDrawn)
    }));
  }

}

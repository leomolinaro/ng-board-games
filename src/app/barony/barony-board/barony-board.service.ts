import { Injectable } from "@angular/core";
import { BgProcessService } from "@bg-services";
import { arrayUtil } from "@bg-utils";
import { BgStore } from "src/app/bg-utils/store.util";
import { BaronyPlayer } from "../models";
import { BaronyContext, BaronyPlay, IBaronyProcessTask } from "../process";

interface BaronyUiState {
  currentPlayerIndex: number;
  turnPlayerIndex: number;
} // BaronyUiState

@Injectable ({
  providedIn: "root"
})
export class BaronyBoardService {

  constructor (
    private bgProcessService: BgProcessService
  ) {
    this.context = new BaronyContext ();
  } // constructor

  private context: BaronyContext;
  private ui = new BgStore<BaronyUiState> ({
    currentPlayerIndex: 0,
    turnPlayerIndex: 0
  });

  selectPlayers$ () { return this.context.selectPlayers$ (); }
  selectOtherPlayers$ () {
    return this.context.select$ (
      this.selectCurrentPlayerIndex$ (),
      this.selectPlayers$ (),
      (pIndex, players) => {
        const n = players.length;
        const toReturn: BaronyPlayer[] = [];
        for (let i = 1; i < n; i++) {
          toReturn.push (players[(pIndex + i) % n]);
        } // for
        return toReturn;
      }
    );
  } // selectOtherPlayers$
  selectLandTiles$ () { return this.context.selectLandTiles$ (); }
  selectCurrentPlayerIndex$ () { return this.ui.select$ (s => s.currentPlayerIndex); }
  selectCurrentPlayer$ () {
    return this.context.select$ (
      this.selectCurrentPlayerIndex$ (),
      this.selectPlayers$ (),
      (pIndex, players) => players[pIndex]
    );
  } // selectCurrentPlayer$

  startGame () {
    const baronyPlay = new BaronyPlay ();
    const tasks = this.bgProcessService.startProcess (baronyPlay, this.context) as IBaronyProcessTask[];
    this.processTasks (tasks);
  } // startProcess
  
  resolveAction<A> (action: A, task: IBaronyProcessTask<A>) {
    task.resolve (action);
    const tasks = this.bgProcessService.resolveTask (task, this.context) as IBaronyProcessTask[];
    this.processTasks (tasks);
  } // resolveRequest

  private processTasks (tasks: IBaronyProcessTask[]) {
    // throw new Error ("Method not implemented.");
  } // processTasks

} // BaronyBoardService

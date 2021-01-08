import { Injectable } from "@angular/core";
import { BgProcessService } from "@bg-services";
import { BgStore } from "src/app/bg-utils/store.util";
import { BaronyLandTile, BaronyPlayer } from "../models";
import { BaronyContext, BaronyPlay, BaronyProcessTask, IBaronyProcessTask } from "../process";

interface BaronyUiState {
  currentPlayerIndex: number;
  turnPlayerIndex: number;
  instruction: string | null;
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
    turnPlayerIndex: 0,
    instruction: null
  });
  private pendingTask!: BaronyProcessTask;

  selectMessage$ () {
    return this.ui.select$ (
      this.selectCurrentPlayerIndex$ (),
      this.selectTurnPlayerIndex$ (),
      this.selectInstruction$ (),
      (cIndex, tIndex, instruction) => {
        if (cIndex === tIndex) {
          return instruction;
        } else {
          const turnPlayer = this.context.getPlayerByIndex (tIndex);
          return `${turnPlayer.name} is thinking...`;
        } // if - else
      }
    );
  } // selectMessage$
  selectInstruction$ () { return this.ui.select$ (s => s.instruction); }
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
  selectTurnPlayerIndex$ () { return this.ui.select$ (s => s.turnPlayerIndex); }
  selectCurrentPlayer$ () {
    return this.context.select$ (
      this.selectCurrentPlayerIndex$ (),
      this.selectPlayers$ (),
      (pIndex, players) => players[pIndex]
    );
  } // selectCurrentPlayer$

  startGame () {
    const baronyPlay = new BaronyPlay ();
    const tasks = this.bgProcessService.startProcess (baronyPlay, this.context) as BaronyProcessTask[];
    this.processTasks (tasks);
  } // startProcess
  
  resolveAction<A> (action: A, task: IBaronyProcessTask<A>) {
    task.resolve (action);
    const tasks = this.bgProcessService.resolveTask (task, this.context) as BaronyProcessTask[];
    this.processTasks (tasks);
  } // resolveRequest

  setCurrentPlayer (player: BaronyPlayer) {
    this.ui.update ({ currentPlayerIndex: player.index });
  } // setCurrentPlayer

  selectLandTile (landTile: BaronyLandTile) {
    const task = this.pendingTask;
    if (task.taskName === "setupPlacement") {
      this.resolveAction ({ landTileCoordinates: landTile.coordinates }, task);
    } // if
  } // selectLandTile

  private processTasks (tasks: BaronyProcessTask[]) {
    const task = tasks[0];
    this.pendingTask = task;
    switch (task.taskName) {
      case "setupPlacement": {
        this.ui.update ({
          turnPlayerIndex: task.playerIndex,
          instruction: `Place a village and a knight.`
        });
        break;
      } // case
    } // switch
  } // processTasks

} // BaronyBoardService

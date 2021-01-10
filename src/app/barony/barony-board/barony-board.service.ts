import { Injectable } from "@angular/core";
import { BgProcessService } from "@bg-services";
import { BehaviorSubject } from "rxjs";
import { BgStore } from "src/app/bg-utils/store.util";
import { BaronyAction, BaronyLandTile, BaronyPlayer } from "../models";
import { BaronyChooseAction, BaronyContext, BaronyPlay, BaronyProcessTask, BaronySetupPlacement, IBaronyProcessTask } from "../process";

interface BaronyUiState {
  currentPlayerIndex: number;
  turnPlayerIndex: number;
  instruction: string | null;
  candidateLandTiles: BaronyLandTile[] | null;
  candidateActions: BaronyAction[] | null;
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
    instruction: null,
    candidateLandTiles: null,
    candidateActions: null
  });
  private $pendingTask = new BehaviorSubject<BaronyProcessTask | null> (null);
  
  selectPendingTask$ () { return this.$pendingTask.asObservable (); }

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
  selectCandidateLandTiles$ () { return this.ui.select$ (s => s.turnPlayerIndex === s.currentPlayerIndex ? s.candidateLandTiles : null); }
  selectCandidateActions$ () { return this.ui.select$ (s => s.turnPlayerIndex === s.currentPlayerIndex ? s.candidateActions : null); }
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
    const task = this.$pendingTask.getValue ();
    if (task) {
      if (task.taskName === "setupPlacement") {
        this.resolveSetupPlacement (landTile, task);
      } // if
    } // if
  } // selectLandTile

  private resolveSetupPlacement (landTile: BaronyLandTile, task: BaronySetupPlacement) {
    this.resolveAction ({ landTileCoordinates: landTile.coordinates }, task);
  } // resolveSetupPlacement

  selectAction (action: BaronyAction) {
    const task = this.$pendingTask.getValue ();
    if (task) {
      if (task.taskName === "chooseAction") {
        this.resolveChooseAction (action, task);
      } // if
    } // if
  } // selectAction

  private resolveChooseAction (action: BaronyAction, task: BaronyChooseAction) {
    this.resolveAction ({ action: action }, task);
  } // resolveChooseAction

  private processTasks (tasks: BaronyProcessTask[]) {
    const task = tasks[0];
    this.$pendingTask.next (task);
    switch (task.taskName) {
      case "setupPlacement": {
        this.setUi ({
          currentPlayerIndex: task.playerIndex,
          turnPlayerIndex: task.playerIndex,
          instruction: `Place a city and a knight.`,
          candidateLandTiles: task.candidateLandTiles,
          candidateActions: null
        });
        break;
      } // case
      case "chooseAction": {
        this.ui.update ({
          currentPlayerIndex: task.playerIndex,
          turnPlayerIndex: task.playerIndex,
          instruction: `Choose an action to perform.`,
          candidateLandTiles: null,
          candidateActions: task.candidateActions
        });
        break;
      } // case
      default: throw new Error (`Task ${(task as BaronyProcessTask).taskName} non gestito.`);
    } // switch
  } // processTasks

  resolveAiTask (task: BaronyProcessTask) {
    switch (task.taskName) {
      case "setupPlacement": {
        this.resolveSetupPlacement (task.candidateLandTiles[0], task);
        break;
      } // case
      case "chooseAction": {
        this.resolveChooseAction (task.candidateActions[0], task);
        break;
      } // case
      default: throw new Error (`Task ${(task as BaronyProcessTask).taskName} non gestito.`);
    } // switch
  } // resolveAiTask

  private setUi (uiState: BaronyUiState) {
    this.ui.update (uiState);
  } // setUi

} // BaronyBoardService

import { Injectable } from "@angular/core";
import { BgProcessService } from "@bg-services";
import { BehaviorSubject, combineLatest, Observable, of, Subject } from "rxjs";
import { BgStore } from "@bg-utils";
import { BaronyAction, BaronyLandTile, BaronyLandTileCoordinates, BaronyPlayer } from "../models";
import { BaronyContext, baronyRules } from "../logic";
import { BaronyPlay, BaronyProcessTask, BaronySetupPlacement, BaronyTurn, BaronyTurnRectruitmentResult } from "../process";
import { debounceTime, map, mapTo, switchMap, tap } from "rxjs/operators";

interface BaronyUiState {
  currentPlayerIndex: number | null;
  aiPlayerIndicies: number[];
  turnPlayerIndex: number;
  message: string | null;
  availableLandTiles: BaronyLandTileCoordinates[] | null;
  availableActions: BaronyAction[] | null;
  maxNumberOfKnights: number | null;
  subTask: BaronySubTask | null;
} // BaronyUiState

type BaronySubTask = "chooseLandTileForSetupPlacement" | "chooseAction" | "chooseLandTileForRecruitment" | "chooseNumberOfKnightsForRecruitment";

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
    currentPlayerIndex: null,
    aiPlayerIndicies: [],
    turnPlayerIndex: 0,
    message: null,
    availableLandTiles: null,
    availableActions: null,
    maxNumberOfKnights: null,
    subTask: null
  });
  private $pendingTask = new BehaviorSubject<BaronyProcessTask | null> (null);

  private $selectAction = new Subject<BaronyAction> ();
  private $selectLandTile = new Subject<BaronyLandTile> ();
  private $selectNumberOfKnights = new Subject<number> ();
  
  selectPendingTask$ () { return this.$pendingTask.asObservable (); }

  selectMessage$ () { return this.ui.select$ (s => s.message); }
  selectPlayers$ () { return this.context.selectPlayers$ (); }
  selectOtherPlayers$ () {
    return this.context.select$ (
      this.selectCurrentPlayerIndex$ (),
      this.selectPlayers$ (),
      (pIndex, players) => {
        if (pIndex === null) {
          return players;
        } else {
          const n = players.length;
          const toReturn: BaronyPlayer[] = [];
          for (let i = 1; i < n; i++) {
            toReturn.push (players[(pIndex + i) % n]);
          } // for
          return toReturn;
        } // if - else
      }
    );
  } // selectOtherPlayers$
  selectLandTiles$ () { return this.context.selectLandTiles$ (); }
  selectAvailableLandTiles$ () { return this.ui.select$ (s => s.availableLandTiles); }
  selectAvailableActions$ () { return this.ui.select$ (s => s.availableActions); }
  selectMaxNumberOfKnights$ () { return this.ui.select$ (s => s.maxNumberOfKnights); }
  selectCurrentPlayerIndex$ () { return this.ui.select$ (s => s.currentPlayerIndex); }
  selectAiPlayerIndicies$ () { return this.ui.select$ (s => s.aiPlayerIndicies); }
  selectTurnPlayerIndex$ () { return this.ui.select$ (s => s.turnPlayerIndex); }
  selectCurrentPlayer$ () {
    return this.context.select$ (
      this.selectCurrentPlayerIndex$ (),
      this.selectPlayers$ (),
      (pIndex, players) => pIndex === null ? null : players[pIndex]
    );
  } // selectCurrentPlayer$
  selectAiPlayers$ () {
    return this.context.select$ (
      this.selectAiPlayerIndicies$ (),
      this.selectPlayers$ (),
      (pIndicies, players) => pIndicies.map (pIndex => players[pIndex])
    );
  } // selectCurrentPlayer$

  setCurrentPlayer (playerIndex: number | null) {
    this.ui.update (s => ({ ...s, currentPlayerIndex: playerIndex }));
  } // setCurrentPlayer

  setAiPlayers (aiPlayerIndicies: number[]) {
    this.ui.update (s => ({ ...s, aiPlayerIndicies: aiPlayerIndicies }));
  } // setAiPlayers

  selectAction (action: BaronyAction) {
    this.$selectAction.next (action);
  } // selectAction

  selectNumberOfKnights (numberOfKnights: number) {
    this.$selectNumberOfKnights.next (numberOfKnights);
  } // selectNumberOfKnights

  selectLandTile (landTile: BaronyLandTile) {
    this.$selectLandTile.next (landTile);
  } // selectLandTile

  private updateUi (updater: (state: BaronyUiState) => BaronyUiState) {
    this.ui.update (updater);
  } // setUi

  private autoRefreshCurrentPlayer (currentPlayer: BaronyPlayer | null, aiPlayers: BaronyPlayer[], task: BaronyProcessTask) {
    if (aiPlayers.every (aiPlayer => aiPlayer.index !== task.data.player.index)) {
      this.setCurrentPlayer (task.data.player.index);
    } // if - else
  } // autoRefreshCurrentPlayer

  resolveTasks$ (): Observable<void> {
    return combineLatest ([
      this.selectCurrentPlayer$ (),
      this.selectAiPlayers$ (),
      this.selectPendingTask$ ()
    ]).pipe (
      debounceTime (0),
      switchMap (([currentPlayer, aiPlayers, task]) => this.resolveTask$ (task, currentPlayer, aiPlayers).pipe (
        tap (nextTask => {
          if (nextTask) {
            this.$pendingTask.next (nextTask);
            this.autoRefreshCurrentPlayer (currentPlayer, aiPlayers, nextTask);
          } // if
        })
      )),
      mapTo (void 0)
    );
  } // resolveTasks$

  private resolveTask$ (task: BaronyProcessTask | null, currentPlayer: BaronyPlayer | null, aiPlayers: BaronyPlayer[]): Observable<BaronyProcessTask | null> {
    if (task) {
      return this.executeTask$ (task, currentPlayer, aiPlayers).pipe (
        map (taskResult => {
          if (taskResult) {
            task.result = taskResult;
            const nextTasks = this.bgProcessService.resolveTask (task, this.context) as BaronyProcessTask[];
            return nextTasks[0];
          } else {
            return null;
          } // if - else
        })
      );
    } else {
      const baronyPlay = new BaronyPlay ();
      const startingTasks = this.bgProcessService.startProcess (baronyPlay, this.context) as BaronyProcessTask[];
      const startingTask = startingTasks[0];
      return of (startingTask);
    } // if - else
  } // resolveTask$

  private executeTask$<T extends BaronyProcessTask> (task: T, currentPlayer: BaronyPlayer | null, aiPlayers: BaronyPlayer[]): Observable<T["result"] | null> {
    if (currentPlayer?.index === task.data.player.index) {
      return this.executeTaskByPlayer$ (task, currentPlayer);
    } else if (aiPlayers.some (aiPlayer => aiPlayer.index === task.data.player.index)) {
      return this.executeTaskByAi$ (task);
    } else {
      return this.executeTaskByObserver$ (task);
    } // if - else
  } // getTaskResult

  private executeTaskByObserver$ (task: BaronyProcessTask): Observable<null> {
    this.updateUi (s => ({
      ...s,
      turnPlayerIndex: task.data.player.index,
      message: `${this.context.getPlayerByIndex (task.data.player.index).name} is thinking...`,
      availableLandTiles: null,
      maxNumberOfKnights: null,
      availableActions: null,
      subTask: null
    }));
    return of (null);
  } // resolveObserverTask

  private executeTaskByAi$<T extends BaronyProcessTask> (task: T & BaronyProcessTask): Observable<T["result"]> {
    switch (task.taskName) {
      case "setupPlacement": {
        return of ({ choosenLandTileCoordinates: task.data.availableLandTiles[0].coordinates });
      } // case
      case "turn": {
        throw new Error ("TODO");
        // this.service.resolveTaskResultResult ({ choosenAction: task.data.availableActions[0] }, task);
      } // case
      default: throw new Error (`Task ${(task as BaronyProcessTask).taskName} non gestito.`);
    } // switch
  } // resolveAiTask

  private executeTaskByPlayer$<T extends BaronyProcessTask> (task: T & BaronyProcessTask, player: BaronyPlayer): Observable<T["result"]> {
    switch (task.taskName) {
      case "setupPlacement": {
        return this.executeChooseLandTileForSetupPlacement$ (task, player).pipe (
          map (landTile => ({ choosenLandTileCoordinates: landTile.coordinates }))
        );
      } // case
      case "turn": {
        return this.executeChooseAction$ (task, player).pipe (
          switchMap (action => {
            switch (action) {
              case "recruitment": {
                return this.executeChooseLandTileForRecruitment$ (player).pipe (
                  switchMap (landTile => this.executeChooseNumberOfKnightsForRecruitment$ (landTile, player).pipe (
                    map (numberOfKnights => ({
                      choosenAction: "recruitment",
                      landTileCoordinates: landTile.coordinates,
                      numberOfKnights: numberOfKnights
                    } as BaronyTurnRectruitmentResult))
                  ))
                );
              } // case
              default: throw new Error ("TODO");
            } // switch
          })
        );
      } // case
      default: throw new Error (`Task ${(task as BaronyProcessTask).taskName} non gestito.`);
    } // switch
  } // resolvePlayerTask

  private executeChooseLandTileForSetupPlacement$ (task: BaronySetupPlacement, player: BaronyPlayer): Observable<BaronyLandTile> {
    this.updateUi (s => ({
      ...s,
      turnPlayerIndex: task.data.player.index,
      message: `Place a city and a knight.`,
      availableLandTiles: task.data.availableLandTiles.map (lt => lt.coordinates),
      availableActions: null,
      maxNumberOfKnights: null,
      subTask: "chooseLandTileForSetupPlacement"
    }));
    return this.$selectLandTile;
  } // executeChooseLandTileForSetupPlacement$

  private executeChooseAction$ (task: BaronyTurn, player: BaronyPlayer): Observable<BaronyAction> {
    this.updateUi (s => ({
      ...s,
      turnPlayerIndex: task.data.player.index,
      message: `Choose an action to perform.`,
      availableLandTiles: null,
      maxNumberOfKnights: null,
      availableActions: task.data.availableActions,
      subTask: "chooseAction"
    }));
    return this.$selectAction;
  } // executeChooseAction$

  private executeChooseLandTileForRecruitment$ (player: BaronyPlayer): Observable<BaronyLandTile> {
    const availableLandTiles = baronyRules.getAvailableLandTileForRecruitment (player, this.context);
    this.updateUi (s => ({
      ...s,
      availableActions: null,
      availableLandTiles: availableLandTiles.map (lt => lt.coordinates),
      message: `Choose a land tile to recruit on.`,
      subTask: "chooseLandTileForRecruitment"
    }));
    return this.$selectLandTile;
  } // executeChooseLandTileForRecruitment$

  private executeChooseNumberOfKnightsForRecruitment$ (landTile: BaronyLandTile, player: BaronyPlayer): Observable<number> {
    const maxNumberOfKnights = baronyRules.getMaxKnightForRecruitment (landTile, player, this.context);
    this.updateUi (s => ({
      ...s,
      availableLandTiles: null,
      message: `Choose the number of knights to recruit.`,
      maxNumberOfKnights: maxNumberOfKnights,
      subTask: "chooseNumberOfKnightsForRecruitment"
    }));
    return this.$selectNumberOfKnights;
  } // executeChooseNumberOfKnightsForRecruitment$

} // BaronyBoardService

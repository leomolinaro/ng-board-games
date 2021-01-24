import { Injectable } from "@angular/core";
import { BgProcessService } from "@bg-services";
import { BehaviorSubject, combineLatest, Observable, of, race, Subject } from "rxjs";
import { BgStore, randomUtil } from "@bg-utils";
import { BaronyAction, BaronyLandTile, BaronyLandTileCoordinates, BaronyLandType, BaronyPlayer } from "../models";
import { BaronyContext, baronyRules } from "../logic";
import { BaronyMovement, BaronyPlay, BaronyProcessTask, BaronySetupPlacement, BaronyTurn, BaronyTurnMovementResult, BaronyTurnRectruitmentResult } from "../process";
import { debounceTime, first, map, mapTo, switchMap, tap } from "rxjs/operators";

interface BaronyUiState {
  currentPlayerIndex: number | null;
  aiPlayerIndicies: number[];
  turnPlayerIndex: number;
  message: string | null;
  validLandTiles: BaronyLandTileCoordinates[] | null;
  validActions: BaronyAction[] | null;
  canPass: boolean;
  maxNumberOfKnights: number | null;
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
    currentPlayerIndex: null,
    aiPlayerIndicies: [],
    turnPlayerIndex: 0,
    message: null,
    validLandTiles: null,
    validActions: null,
    canPass: false,
    maxNumberOfKnights: null
  });
  private $pendingTask = new BehaviorSubject<BaronyProcessTask | null> (null);

  private $selectAction = new Subject<BaronyAction> ();
  private $selectLandTile = new Subject<BaronyLandTile> ();
  private $selectNumberOfKnights = new Subject<number> ();
  private $selectPass = new Subject<void> ();
  private selectAction$ () { return this.$selectAction.asObservable ().pipe (first ()); }
  private selectLandTile$ () { return this.$selectLandTile.asObservable ().pipe (first ()); }
  private selectNumberOfKnights$ () { return this.$selectNumberOfKnights.asObservable ().pipe (first ()); }
  private selectPass$ () { return this.$selectPass.asObservable ().pipe (first ()); }
  
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
  selectValidLandTiles$ () { return this.ui.select$ (s => s.validLandTiles); }
  selectValidActions$ () { return this.ui.select$ (s => s.validActions); }
  selectCanPass$ () { return this.ui.select$ (s => s.canPass); }
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

  selectPass () {
    this.$selectPass.next ();
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
      validLandTiles: null,
      maxNumberOfKnights: null,
      validActions: null,
      subTask: null
    }));
    return of (null);
  } // resolveObserverTask

  private executeTaskByAi$<T extends BaronyProcessTask> (task: T & BaronyProcessTask): Observable<T["result"]> {
    switch (task.taskName) {
      case "setupPlacement": {
        return of ({ choosenLandTileCoordinates: task.data.validLandTiles[0].coordinates });
      } // case
      case "turn": {
        const action = randomUtil.getRandomElement (task.data.validActions);
        const player = task.data.player;
        switch (action) {
          case "recruitment": {
            const validLandTiles = baronyRules.getValidLandTilesForRecruitment (player, this.context);
            const landTile = randomUtil.getRandomElement (validLandTiles);
            const maxKnights = baronyRules.getMaxKnightForRecruitment (landTile, player, this.context);
            return of<BaronyTurnRectruitmentResult> ({ choosenAction: "recruitment", landTileCoordinates: landTile.coordinates, numberOfKnights: maxKnights });
          } // case
          case "movement": {
            const validSourceLandTiles = baronyRules.getValidSourceLandTilesForFirstMovement (player, this.context);
            const sourceLandTile = randomUtil.getRandomElement (validSourceLandTiles);
            const validTargetLandTiles = baronyRules.getValidTargetLandTilesForFirstMovement (sourceLandTile, player, this.context);
            const targetLandTile = randomUtil.getRandomElement (validTargetLandTiles);
            const firstMovement: BaronyMovement = {
              fromLandTileCoordinates: sourceLandTile.coordinates,
              toLandTileCoordinates: targetLandTile.coordinates
            };
            // TODO conflict
            if (baronyRules.isSecondMovementValid (player, firstMovement, this.context)) {
              const validSourceLandTiles2 = baronyRules.getValidSourceLandTilesForSecondMovement (player, firstMovement, this.context);
              const sourceLandTile2 = randomUtil.getRandomElement (validSourceLandTiles2);
              const validTargetLandTiles2 = baronyRules.getValidTargetLandTilesForFirstMovement (sourceLandTile2, player, this.context);
              const targetLandTile2 = randomUtil.getRandomElement (validTargetLandTiles2);
              const secondMovement: BaronyMovement = {
                fromLandTileCoordinates: sourceLandTile2.coordinates,
                toLandTileCoordinates: targetLandTile2.coordinates
              };
              // TODO conflict
              return of<BaronyTurnMovementResult> ({
                choosenAction: "movement",
                movements: [firstMovement, secondMovement],
                gainedResources: [null, null]
              });
            } else {
              return of<BaronyTurnMovementResult> ({
                choosenAction: "movement",
                movements: [firstMovement],
                gainedResources: [null]
              });
            } // if - else
          } // case
        } // switch
        throw new Error ("TODO");
        // this.service.resolveTaskResultResult ({ choosenAction: task.data.validActions[0] }, task);
      } // case
      default: throw new Error (`Task ${(task as BaronyProcessTask).taskName} non gestito.`);
    } // switch
  } // resolveAiTask

  private executeTaskByPlayer$<T extends BaronyProcessTask> (task: T & BaronyProcessTask, player: BaronyPlayer): Observable<T["result"]> {
    switch (task.taskName) {
      case "setupPlacement": {
        return this.chooseLandTileForSetupPlacement$ (task, player).pipe (
          map (landTile => ({ choosenLandTileCoordinates: landTile.coordinates }))
        );
      } // case
      case "turn": {
        return this.chooseAction$ (task, player).pipe (
          switchMap (action => {
            switch (action) {
              case "recruitment": {
                return this.chooseLandTileForRecruitment$ (player).pipe (
                  switchMap (landTile => this.chooseNumberOfKnightsForRecruitment$ (landTile, player).pipe (
                    map<number, BaronyTurnRectruitmentResult> (numberOfKnights => ({
                      choosenAction: "recruitment",
                      landTileCoordinates: landTile.coordinates,
                      numberOfKnights: numberOfKnights
                    }))
                  ))
                );
              } // case
              case "movement": {
                return this.resolveFirstMovement$ (player).pipe (
                  switchMap (([firstMovement, firstGainedResource]) => {
                    if (baronyRules.isSecondMovementValid (player, firstMovement, this.context)) {
                      return this.resolveSecondMovement$ (player, firstMovement).pipe (
                        map<([BaronyMovement | null, BaronyLandType | null]), BaronyTurnMovementResult> (([secondMovement, secondGainedResource]) => {
                          if (secondMovement) {
                            return {
                              choosenAction: "movement",
                              movements: [firstMovement, secondMovement],
                              gainedResources: [firstGainedResource, secondGainedResource]
                            };
                          } else {
                            return {
                              choosenAction: "movement",
                              movements: [firstMovement],
                              gainedResources: [firstGainedResource]
                            };
                          } // if - else
                        })
                      );
                    } else {
                      return of<BaronyTurnMovementResult> ({
                        choosenAction: "movement",
                        movements: [firstMovement],
                        gainedResources: [firstGainedResource]
                      });
                    } // if - else
                  })
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

  private chooseLandTileForSetupPlacement$ (task: BaronySetupPlacement, player: BaronyPlayer): Observable<BaronyLandTile> {
    this.updateUi (s => ({
      ...s,
      turnPlayerIndex: task.data.player.index,
      message: `Place a city and a knight.`,
      validLandTiles: task.data.validLandTiles.map (lt => lt.coordinates),
      validActions: null,
      maxNumberOfKnights: null
    }));
    return this.selectLandTile$ ();
  } // chooseLandTileForSetupPlacement$

  private chooseAction$ (task: BaronyTurn, player: BaronyPlayer): Observable<BaronyAction> {
    this.updateUi (s => ({
      ...s,
      turnPlayerIndex: task.data.player.index,
      message: `Choose an action to perform.`,
      canPass: false,
      validLandTiles: null,
      maxNumberOfKnights: null,
      validActions: task.data.validActions
    }));
    return this.selectAction$ ();
  } // chooseAction$

  private chooseLandTileForRecruitment$ (player: BaronyPlayer): Observable<BaronyLandTile> {
    const validLandTiles = baronyRules.getValidLandTilesForRecruitment (player, this.context);
    this.updateUi (s => ({
      ...s,
      validActions: null,
      validLandTiles: validLandTiles.map (lt => lt.coordinates),
      message: `Choose a land tile to recruit on.`,
    }));
    return this.selectLandTile$ ();
  } // chooseLandTileForRecruitment$

  private chooseNumberOfKnightsForRecruitment$ (landTile: BaronyLandTile, player: BaronyPlayer): Observable<number> {
    const maxNumberOfKnights = baronyRules.getMaxKnightForRecruitment (landTile, player, this.context);
    this.updateUi (s => ({
      ...s,
      validLandTiles: null,
      message: `Choose the number of knights to recruit.`,
      maxNumberOfKnights: maxNumberOfKnights,
    }));
    return this.selectNumberOfKnights$ ();
  } // chooseNumberOfKnightsForRecruitment$

  private resolveFirstMovement$ (player: BaronyPlayer): Observable<[BaronyMovement, BaronyLandType | null]> {
    return this.chooseLandTileSourceForFirstMovement$ (player).pipe (
      switchMap (movementSource => this.chooseLandTileTargetForMovement$ (movementSource, player).pipe (
        switchMap (movementTarget => {
          const movement: BaronyMovement = {
            fromLandTileCoordinates: movementSource.coordinates,
            toLandTileCoordinates: movementTarget.coordinates
          };
          if (baronyRules.isDestroyingOpponentVillage (movementTarget, player)) {
            return this.chooseResourceForConflict$ (movementTarget, player).pipe (
              map<BaronyLandType, [BaronyMovement, BaronyLandType]> (resource => ([movement, resource]))
            );
          } else {
            return of<[BaronyMovement, null]> ([movement, null]);
          } // if - else
        }) // switchMap
      )) // switchMap
    );
  } // resolveFirstMovement$

  private resolveSecondMovement$ (player: BaronyPlayer, firstMovement: BaronyMovement): Observable<[BaronyMovement | null, BaronyLandType | null]> {
    return this.chooseLandTileSourceOrPassForSecondMovement$ (player, firstMovement).pipe (
      switchMap (movementSource => {
        if (movementSource) {
          return this.chooseLandTileTargetForMovement$ (movementSource, player).pipe (
            switchMap (movementTarget => {
              const movement: BaronyMovement = {
                fromLandTileCoordinates: movementSource.coordinates,
                toLandTileCoordinates: movementTarget.coordinates
              };
              if (baronyRules.isDestroyingOpponentVillage (movementTarget, player)) {
                return this.chooseResourceForConflict$ (movementTarget, player).pipe (
                  map<BaronyLandType, [BaronyMovement, BaronyLandType]> (resource => ([movement, resource]))
                );
              } else {
                return of<[BaronyMovement, null]> ([movement, null]);
              } // if - else
            }) // switchMap
          );
        } else {
          return of<[null, null]> ([null, null]);
        } // if - else
      }) // switchMap
    );
  } // resolveSecondMovement$

  private chooseLandTileSourceForFirstMovement$ (player: BaronyPlayer): Observable<BaronyLandTile> {
    const validSourceLandTiles = baronyRules.getValidSourceLandTilesForFirstMovement (player, this.context);
    this.updateUi (s => ({
      ...s,
      validActions: null,
      validLandTiles: validSourceLandTiles.map (lt => lt.coordinates),
      message: `Choose a land tile to move a knight from.`,
    }));
    return this.selectLandTile$ ();
  } // chooseLandTileSourceForFirstMovement$

  private chooseLandTileSourceOrPassForSecondMovement$ (player: BaronyPlayer, firstMovement: BaronyMovement): Observable<BaronyLandTile | null> {
    const validSourceLandTiles = baronyRules.getValidSourceLandTilesForSecondMovement (player, firstMovement, this.context);
    this.updateUi (s => ({
      ...s,
      validActions: null,
      validLandTiles: validSourceLandTiles.map (lt => lt.coordinates),
      message: `Choose a land tile to move a knight from, or pass.`,
      canPass: true
    }));
    return race (
      this.selectLandTile$ (),
      this.selectPass$ ().pipe (mapTo (null))
    );
  } // chooseLandTileSourceOrPassForSecondMovement$

  private chooseLandTileTargetForMovement$ (movementSource: BaronyLandTile, player: BaronyPlayer): Observable<BaronyLandTile> {
    const validSourceLandTiles = baronyRules.getValidTargetLandTilesForFirstMovement (movementSource, player, this.context);
    this.updateUi (s => ({
      ...s,
      validActions: null,
      validLandTiles: validSourceLandTiles.map (lt => lt.coordinates),
      message: `Choose a land tile to move a knight to.`,
    }));
    return this.selectLandTile$ ();
  } // chooseLandTileTargetForMovement$

  private chooseResourceForConflict$ (landTile: BaronyLandTile, player: BaronyPlayer): Observable<BaronyLandType> {
    throw new Error ("TODO");
  } // chooseResourceForConflict$

} // BaronyBoardService

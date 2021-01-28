import { Injectable } from "@angular/core";
import { BgProcessService } from "@bg-services";
import { BehaviorSubject, combineLatest, Observable, of, race, Subject } from "rxjs";
import { BgStore, randomUtil } from "@bg-utils";
import { BaronyAction, BaronyBuilding, BaronyConstruction, BaronyLandTile, BaronyLandTileCoordinates, BaronyLandType, BaronyMovement, BaronyPlayer, BaronyResourceType } from "../models";
import { BaronyContext, baronyRules } from "../logic";
import { BaronyPlay, BaronyProcessTask, BaronySetupPlacement, BaronyTurn, BaronyTurnConstructionResult, BaronyTurnMovementResult, BaronyTurnRectruitmentResult } from "../process";
import { debounceTime, finalize, first, map, mapTo, switchMap, take, takeUntil, tap } from "rxjs/operators";

interface BaronyUiState {
  currentPlayerIndex: number | null;
  aiPlayerIndicies: number[];
  turnPlayerIndex: number;
  message: string | null;
  validLandTiles: BaronyLandTileCoordinates[] | null;
  validActions: BaronyAction[] | null;
  validBuildings: ("stronghold" | "village")[] | null;
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
    validBuildings: null,
    canPass: false,
    maxNumberOfKnights: null
  });
  private $pendingTask = new BehaviorSubject<BaronyProcessTask | null> (null);

  private $selectAction = new Subject<BaronyAction> ();
  private $selectLandTile = new Subject<BaronyLandTile> ();
  private $selectNumberOfKnights = new Subject<number> ();
  private $selectPass = new Subject<void> ();
  private $selectBuilding = new Subject<"village" | "stronghold"> ();
  private selectAction$ () { return this.$selectAction.asObservable ().pipe (first ()); }
  private selectLandTile$ () { return this.$selectLandTile.asObservable ().pipe (first ()); }
  private selectNumberOfKnights$ () { return this.$selectNumberOfKnights.asObservable ().pipe (first ()); }
  private selectPass$ () { return this.$selectPass.asObservable ().pipe (first ()); }
  private selectBuilding$ () { return this.$selectBuilding.asObservable ().pipe (first ()); }

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
  selectValidBuildings$ () { return this.ui.select$ (s => s.validBuildings); }
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

  selectAction (action: BaronyAction) { this.$selectAction.next (action); }
  selectPass () { this.$selectPass.next (); }
  selectNumberOfKnights (numberOfKnights: number) { this.$selectNumberOfKnights.next (numberOfKnights); }
  selectLandTile (landTile: BaronyLandTile) { this.$selectLandTile.next (landTile); }
  selectBuilding (building: BaronyBuilding) { this.$selectBuilding.next (building); }

  private updateUi (updater: (state: BaronyUiState) => BaronyUiState) {
    this.ui.update (updater);
  } // updateUi

  private resetUi (): Partial<BaronyUiState> {
    return {
      message: null,
      canPass: false,
      maxNumberOfKnights: null,
      validActions: null,
      validBuildings: null,
      validLandTiles: null
    };
  } // resetUi

  private autoRefreshCurrentPlayer (currentPlayer: BaronyPlayer | null, aiPlayers: BaronyPlayer[], task: BaronyProcessTask) {
    if (aiPlayers.every (aiPlayer => aiPlayer.index !== task.data.player.index)) {
      this.setCurrentPlayer (task.data.player.index);
    } // if - else
  } // autoRefreshCurrentPlayer

  resolveTasks$ (): Observable<void> {
    return combineLatest ([
      this.selectCurrentPlayerIndex$ (),
      this.selectAiPlayerIndicies$ (),
      this.selectPendingTask$ ()
    ]).pipe (
      debounceTime (0),
      switchMap (([currentPlayerIndex, aiPlayersIndicies, task]) => {
        const currentPlayer = (currentPlayerIndex || currentPlayerIndex === 0) ? this.context.getPlayerByIndex (currentPlayerIndex) : null;
        const aiPlayers = aiPlayersIndicies.map (i => this.context.getPlayerByIndex (i));
        return this.resolveTask$ (task, currentPlayer, aiPlayers).pipe (
          tap (nextTask => {
            if (nextTask) {
              this.$pendingTask.next (nextTask);
              this.autoRefreshCurrentPlayer (currentPlayer, aiPlayers, nextTask);
            } // if
          })
        );
      }),
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
      this.context.startTemporaryState ();
      return this.executeTaskByPlayer$ (task, currentPlayer).pipe (
        tap ((x) => {
          this.context.endTemporaryState ();
        })
      );
    } else if (aiPlayers.some (aiPlayer => aiPlayer.index === task.data.player.index)) {
      this.context.startTemporaryState ();
      return this.executeTaskByAi$ (task).pipe (
        tap (() => this.context.endTemporaryState ())
      );
    } else {
      return this.executeTaskByObserver$ (task);
    } // if - else
  } // getTaskResult

  private executeTaskByObserver$ (task: BaronyProcessTask): Observable<null> {
    this.updateUi (s => ({
      ...s,
      turnPlayerIndex: task.data.player.index,
      ...this.resetUi (),
      message: `${this.context.getPlayerByIndex (task.data.player.index).name} is thinking...`,
    }));
    return of (null);
  } // resolveObserverTask

  private executeTaskByAi$<T extends BaronyProcessTask> (task: T & BaronyProcessTask): Observable<T["result"]> {
    switch (task.taskName) {
      case "setupPlacement": {
        const landTile = randomUtil.getRandomElement (task.data.validLandTiles);
        return of ({ choosenLandTileCoordinates: landTile.coordinates });
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
            this.context.applyMovement (firstMovement, null, player);
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
          case "construction": {
            const constructions: BaronyConstruction[] = [];
            let validConstruction = true;
            do {
              const validLandTiles = baronyRules.getValidLandTilesForConstruction (player, this.context);
              const landTile = randomUtil.getRandomElement (validLandTiles);
              const validBuildings = baronyRules.getValidBuildingsForConstruction (player, this.context);
              const building = randomUtil.getRandomElement (validBuildings);
              const construction: BaronyConstruction = {
                building: building,
                landTileCoordinates: landTile.coordinates
              };
              this.context.applyConstruction (construction, player);
              validConstruction = baronyRules.isConstructionValid (player, this.context);
            } while (validConstruction);
            return of<BaronyTurnConstructionResult> ({
              choosenAction: "construction",
              constructions: constructions
            });
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
                return this.chooseFirstMovement$ (player).pipe (
                  switchMap (([firstMovement, firstGainedResource]) => {
                    this.context.applyMovement (firstMovement, firstGainedResource, player);
                    if (baronyRules.isSecondMovementValid (player, firstMovement, this.context)) {
                      return this.chooseSecondMovement$ (player, firstMovement).pipe (
                        map<([BaronyMovement | null, BaronyResourceType | null]), BaronyTurnMovementResult> (([secondMovement, secondGainedResource]) => {
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
              case "construction": {
                return this.chooseConstructions$ (player, null).pipe (
                  map<BaronyConstruction[], BaronyTurnConstructionResult> (constructions => ({
                    choosenAction: "construction",
                    constructions: constructions
                  }))
                );
              } // case
              default: throw new Error ("TODO");
            } // switch
          })
        );
      } // case
      default: throw new Error (`Task ${(task as BaronyProcessTask).taskName} non gestito.`);
    } // switch
  } // executeTaskByPlayer

  private chooseLandTileForSetupPlacement$ (task: BaronySetupPlacement, player: BaronyPlayer): Observable<BaronyLandTile> {
    this.updateUi (s => ({
      ...s,
      turnPlayerIndex: task.data.player.index,
      ...this.resetUi (),
      message: `Place a city and a knight.`,
      validLandTiles: task.data.validLandTiles.map (lt => lt.coordinates),
    }));
    return this.selectLandTile$ ();
  } // chooseLandTileForSetupPlacement$

  private chooseAction$ (task: BaronyTurn, player: BaronyPlayer): Observable<BaronyAction> {
    this.updateUi (s => ({
      ...s,
      turnPlayerIndex: task.data.player.index,
      ...this.resetUi (),
      message: `Choose an action to perform.`,
      validActions: task.data.validActions
    }));
    return this.selectAction$ ();
  } // chooseAction$

  private chooseLandTileForRecruitment$ (player: BaronyPlayer): Observable<BaronyLandTile> {
    const validLandTiles = baronyRules.getValidLandTilesForRecruitment (player, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose a land tile to recruit on.`,
      validLandTiles: validLandTiles.map (lt => lt.coordinates),
    }));
    return this.selectLandTile$ ();
  } // chooseLandTileForRecruitment$

  private chooseNumberOfKnightsForRecruitment$ (landTile: BaronyLandTile, player: BaronyPlayer): Observable<number> {
    const maxNumberOfKnights = baronyRules.getMaxKnightForRecruitment (landTile, player, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose the number of knights to recruit.`,
      maxNumberOfKnights: maxNumberOfKnights,
    }));
    return this.selectNumberOfKnights$ ();
  } // chooseNumberOfKnightsForRecruitment$

  private chooseFirstMovement$ (player: BaronyPlayer): Observable<[BaronyMovement, BaronyResourceType | null]> {
    return this.chooseLandTileSourceForFirstMovement$ (player).pipe (
      switchMap (movementSource => this.chooseLandTileTargetForMovement$ (movementSource, player).pipe (
        switchMap (movementTarget => {
          const movement: BaronyMovement = {
            fromLandTileCoordinates: movementSource.coordinates,
            toLandTileCoordinates: movementTarget.coordinates
          };
          if (baronyRules.isDestroyingOpponentVillage (movementTarget, player)) {
            return this.chooseResourceForConflict$ (movementTarget, player).pipe (
              map<BaronyResourceType, [BaronyMovement, BaronyResourceType]> (resource => ([movement, resource]))
            );
          } else {
            return of<[BaronyMovement, null]> ([movement, null]);
          } // if - else
        }) // switchMap
      )) // switchMap
    );
  } // chooseFirstMovement$

  private chooseSecondMovement$ (player: BaronyPlayer, firstMovement: BaronyMovement): Observable<[BaronyMovement | null, BaronyResourceType | null]> {
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
                  map<BaronyResourceType, [BaronyMovement, BaronyResourceType]> (resource => ([movement, resource]))
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
      ...this.resetUi (),
      message: `Choose a land tile to move a knight from.`,
      validLandTiles: validSourceLandTiles.map (lt => lt.coordinates),
    }));
    return this.selectLandTile$ ();
  } // chooseLandTileSourceForFirstMovement$

  private chooseLandTileSourceOrPassForSecondMovement$ (player: BaronyPlayer, firstMovement: BaronyMovement): Observable<BaronyLandTile | null> {
    const validSourceLandTiles = baronyRules.getValidSourceLandTilesForSecondMovement (player, firstMovement, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose a land tile to move a knight from, or pass.`,
      validLandTiles: validSourceLandTiles.map (lt => lt.coordinates),
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
      ...this.resetUi (),
      message: `Choose a land tile to move a knight to.`,
      validLandTiles: validSourceLandTiles.map (lt => lt.coordinates),
    }));
    return this.selectLandTile$ ();
  } // chooseLandTileTargetForMovement$

  private chooseResourceForConflict$ (landTile: BaronyLandTile, player: BaronyPlayer): Observable<BaronyResourceType> {
    throw new Error ("TODO");
  } // chooseResourceForConflict$

  private chooseConstructions$ (player: BaronyPlayer, prevConstructions: BaronyConstruction[] | null): Observable<BaronyConstruction[]> {
    if (prevConstructions) {
      return this.chooseConstructionOrPass$ (player).pipe (
        switchMap (construction => {
          if (construction) {
            this.context.applyConstruction (construction, player);
            const constructions = [...prevConstructions, construction];
            if (baronyRules.isConstructionValid (player, this.context)) {
              return this.chooseConstructions$ (player, constructions);
            } else {
              return of (constructions);
            } // if - else
          } else {
            return of (prevConstructions);
          } // if - else
        })
      );
    } else {
      return this.chooseConstruction$ (player, false).pipe (
        switchMap (construction => {
          const constructions = [construction];
          this.context.applyConstruction (construction, player);
          if (baronyRules.isConstructionValid (player, this.context)) {
            return this.chooseConstructions$ (player, constructions);
          } else {
            return of (constructions);
          } // if - else
        })
      );
    } // if - else
  } // chooseConstructions$

  private chooseConstructionOrPass$ (player: BaronyPlayer): Observable<BaronyConstruction | null> {
    return race (
      this.chooseConstruction$ (player, true),
      this.selectPass$ ().pipe (mapTo (null))
    );
  } // chooseConstructionOrPass$

  private chooseConstruction$ (player: BaronyPlayer, orPass: boolean): Observable<BaronyConstruction> {
    return this.chooseLandTileForConstruction$ (player, orPass).pipe (
      switchMap (landTile => this.chooseBuildingForConstruction$ (player, orPass).pipe (
        map<"stronghold" | "village", BaronyConstruction> (building => ({
          building: building,
          landTileCoordinates: landTile.coordinates
        }))
      ))
    );
  } // chooseConstruction$

  private chooseLandTileForConstruction$ (player: BaronyPlayer, orPass: boolean): Observable<BaronyLandTile> {
    const validLandTiles = baronyRules.getValidLandTilesForConstruction (player, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose a land tile to construct on${ orPass ? `, or pass` : ``}.`,
      validLandTiles: validLandTiles.map (lt => lt.coordinates),
      canPass: orPass
    }));
    return this.selectLandTile$ ();
  } // chooseLandTileForConstruction$

  private chooseBuildingForConstruction$ (player: BaronyPlayer, orPass: boolean): Observable<"stronghold" | "village"> {
    const validBuildings = baronyRules.getValidBuildingsForConstruction (player, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose a building to construct on the tile${ orPass ? `, or pass` : ``}.`,
      validBuildings: validBuildings,
      canPass: orPass
    }));
    return this.selectBuilding$ ();
  } // chooseBuildingForConstruction$

} // BaronyBoardService

import { Injectable } from "@angular/core";
import { BgProcessService } from "@bg-services";
import { BehaviorSubject, combineLatest, Observable, of, race, Subject } from "rxjs";
import { BgStore, randomUtil } from "@bg-utils";
import { BaronyAction, BaronyBuilding, BaronyConstruction, BaronyLand, BaronyLandCoordinates, BaronyLandType, BaronyMovement, BaronyPlayer, BaronyResourceType } from "../models";
import { BaronyContext, baronyRules } from "../logic";
import { BaronyPlay, BaronyProcessTask, BaronySetupPlacement, BaronyTurn, BaronyTurnConstructionResult, BaronyTurnExpeditionResult, BaronyTurnMovementResult, BaronyTurnNewCityResult, BaronyTurnNobleTiltleResult, BaronyTurnRectruitmentResult } from "../process";
import { debounceTime, first, map, mapTo, switchMap, tap } from "rxjs/operators";

interface BaronyUiState {
  currentPlayer: string | null;
  aiPlayers: string[];
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

@Injectable ({
  providedIn: "root"
})
export class BaronyBoardService {

  constructor (
    private bgProcessService: BgProcessService
  ) { }

  private context = new BaronyContext (3);
  private ui = new BgStore<BaronyUiState> ({
    currentPlayer: null,
    aiPlayers: [],
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
  selectMessage$ () { return this.ui.select$ (s => s.message); }
  selectOtherPlayers$ () {
    return this.context.select$ (
      this.selectCurrentPlayerId$ (),
      this.context.selectPlayerIds$ (),
      this.context.selectPlayerMap$ (),
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
  selectLands$ () { return this.context.selectLands$ (); }
  selectValidLands$ () { return this.ui.select$ (s => s.validLands); }
  selectValidResources$ () { return this.ui.select$ (s => s.validResources); }
  selectValidActions$ () { return this.ui.select$ (s => s.validActions); }
  selectValidBuildings$ () { return this.ui.select$ (s => s.validBuildings); }
  selectCanPass$ () { return this.ui.select$ (s => s.canPass); }
  selectCanCancel$ () { return this.ui.select$ (s => s.canCancel); }
  selectMaxNumberOfKnights$ () { return this.ui.select$ (s => s.maxNumberOfKnights); }
  selectCurrentPlayerId$ () { return this.ui.select$ (s => s.currentPlayer); }
  selectAiPlayerIds$ () { return this.ui.select$ (s => s.aiPlayers); }
  selectTurnPlayerId$ () { return this.ui.select$ (s => s.turnPlayer); }
  selectCurrentPlayer$ () {
    return this.context.select$ (
      this.selectCurrentPlayerId$ (),
      this.context.selectPlayerMap$ (),
      (playerId, playersMap) => playerId ? playersMap[playerId] : null
    );
  } // selectCurrentPlayer$

  setCurrentPlayer (playerId: string | null) {
    this.updateUi (s => ({ ...s, currentPlayer: playerId }));
  } // setCurrentPlayer

  setAiPlayers (aiPlayers: string[]) {
    this.updateUi (s => ({ ...s, aiPlayers: aiPlayers }));
  } // setAiPlayers

  private updateUi<S extends BaronyUiState & { [K in keyof S]: K extends keyof BaronyUiState ? BaronyUiState[K] : never }> (
    updater: (state: BaronyUiState) => S
  ) {
    this.ui.update (updater);
  } // updateUi

  private resetUi (): Partial<BaronyUiState> {
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

  private setFirstActionUi (player: string) {
    return {
      turnPlayer: player,
      canCancel: false
    };
  } // setFirstActionUi
  
  private $pendingTask = new BehaviorSubject<BaronyProcessTask | null> (null);
  selectPendingTask$ () { return this.$pendingTask.asObservable (); }

  actionChange (action: BaronyAction) { this.$actionChange.next (action); }
  passChange () { this.$passChange.next (); }
  numberOfKnightsChange (numberOfKnights: number) { this.$numberOfKnightsChange.next (numberOfKnights); }
  landTileChange (landTile: BaronyLand) { this.$landTileChange.next (landTile); }
  buildingChange (building: BaronyBuilding) { this.$buildingChange.next (building); }
  resourceChange (resource: BaronyResourceType, player: BaronyPlayer) { this.$resourceChange.next (resource); }
  cancelChange () { this.$cancelChange.next (); }
  private $actionChange = new Subject<BaronyAction> ();
  private $landTileChange = new Subject<BaronyLand> ();
  private $numberOfKnightsChange = new Subject<number> ();
  private $passChange = new Subject<void> ();
  private $buildingChange = new Subject<"village" | "stronghold"> ();
  private $resourceChange = new Subject<BaronyResourceType> ();
  private $cancelChange = new BehaviorSubject<void> (void 0);
  private actionChange$ () { return this.$actionChange.asObservable ().pipe (first ()); }
  private landChange$ () { return this.$landTileChange.asObservable ().pipe (first ()); }
  private numberOfKnightsChange$ () { return this.$numberOfKnightsChange.asObservable ().pipe (first ()); }
  private passChange$ () { return this.$passChange.asObservable ().pipe (first ()); }
  private buildingChange$ () { return this.$buildingChange.asObservable ().pipe (first ()); }
  private resourceChange$ () { return this.$resourceChange.asObservable ().pipe (first ()); }
  private cancelChange$ () { return this.$cancelChange.asObservable (); }

  resolveTasks$ (): Observable<void> {
    return combineLatest ([
      this.selectCurrentPlayerId$ (),
      this.selectAiPlayerIds$ (),
      this.selectPendingTask$ (),
      this.cancelChange$ (),
    ]).pipe (
      debounceTime (0),
      switchMap (([currentPlayerId, aiPlayersIndicies, task]) => {
        if (this.context.isTemporaryState ()) {
          this.context.endTemporaryState ();
        } // if
        return this.resolveTask$ (task, currentPlayerId, aiPlayersIndicies).pipe (
          tap (nextTask => {
            if (nextTask) {
              this.$pendingTask.next (nextTask);
              this.autoRefreshCurrentPlayer (currentPlayerId, aiPlayersIndicies, nextTask);
            } // if
          })
        );
      }),
      mapTo (void 0)
    );
  } // resolveTasks$

  private autoRefreshCurrentPlayer (currentPlayer: string | null, aiPlayers: string[], task: BaronyProcessTask) {
    if (aiPlayers.every (aiPlayer => aiPlayer !== task.data.player)) {
      this.setCurrentPlayer (task.data.player);
    } // if - else
  } // autoRefreshCurrentPlayer

  private resolveTask$ (task: BaronyProcessTask | null, currentPlayer: string | null, aiPlayers: string[]): Observable<BaronyProcessTask | null> {
    if (task) {
      this.context.startTemporaryState ();
      return this.executeTask$ (task, currentPlayer, aiPlayers).pipe (
        map (taskResult => {
          this.context.endTemporaryState ();
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

  private executeTask$<T extends BaronyProcessTask> (task: T, currentPlayer: string | null, aiPlayers: string[]): Observable<T["result"] | null> {
    if (currentPlayer === task.data.player) {
      return this.executeTaskByPlayer$ (task, currentPlayer);
    } else if (aiPlayers.some (aiPlayer => aiPlayer === task.data.player)) {
      return this.executeTaskByAi$ (task);
    } else {
      return this.executeTaskByObserver$ (task);
    } // if - else
  } // executeTask$

  private executeTaskByObserver$ (task: BaronyProcessTask): Observable<null> {
    this.updateUi (s => ({
      ...s,
      turnPlayer: task.data.player,
      ...this.resetUi (),
      message: `${this.context.getPlayer (task.data.player).name} is thinking...`,
    }));
    return of (null);
  } // executeTaskByObserver$

  private executeTaskByAi$<T extends BaronyProcessTask> (task: T & BaronyProcessTask): Observable<T["result"]> {
    switch (task.taskName) {
      case "setupPlacement": {
        const validLands = baronyRules.getValidLandsForSetupPlacement (this.context);
        const land = randomUtil.getRandomElement (validLands);
        return of ({ land: land.coordinates });
      } // case
      case "turn": {
        const validActions = baronyRules.getValidActions (task.data.player, this.context);
        const action: any = randomUtil.getRandomElement (validActions);
        const player = task.data.player;
        switch (action) {
          case "recruitment": {
            const validLands = baronyRules.getValidLandsForRecruitment (player, this.context);
            const land = randomUtil.getRandomElement (validLands);
            const maxKnights = baronyRules.getMaxKnightForRecruitment (land.coordinates, player, this.context);
            return of<BaronyTurnRectruitmentResult> ({ action: "recruitment", land: land.coordinates, numberOfKnights: maxKnights });
          } // case
          case "movement": {
            const validSourceLands = baronyRules.getValidSourceLandsForFirstMovement (player, this.context);
            const sourceLand = randomUtil.getRandomElement (validSourceLands);
            const firstMovement = this.executeAiMovement (sourceLand, player);
            this.context.applyMovement (firstMovement, player);
            if (baronyRules.isSecondMovementValid (player, firstMovement, this.context)) {
              const validSourceLands2 = baronyRules.getValidSourceLandsForSecondMovement (player, firstMovement, this.context);
              const sourceLand2 = randomUtil.getRandomElement (validSourceLands2);
              const secondMovement = this.executeAiMovement (sourceLand2, player);
              return of<BaronyTurnMovementResult> ({
                action: "movement",
                movements: [firstMovement, secondMovement],
              });
            } else {
              return of<BaronyTurnMovementResult> ({
                action: "movement",
                movements: [firstMovement],
              });
            } // if - else
          } // case
          case "construction": {
            const constructions: BaronyConstruction[] = [];
            let validConstruction = true;
            do {
              const validLands = baronyRules.getValidLandsForConstruction (player, this.context);
              const land = randomUtil.getRandomElement (validLands);
              const validBuildings = baronyRules.getValidBuildingsForConstruction (player, this.context);
              const building = randomUtil.getRandomElement (validBuildings);
              const construction: BaronyConstruction = {
                building: building,
                land: land.coordinates
              };
              this.context.applyConstruction (construction, player);
              validConstruction = baronyRules.isConstructionValid (player, this.context);
            } while (validConstruction);
            return of<BaronyTurnConstructionResult> ({
              action: "construction",
              constructions: constructions
            });
          } // case
          case "newCity": {
            const validLands = baronyRules.getValidLandsForNewCity (player, this.context);
            const land = randomUtil.getRandomElement (validLands);
            return of<BaronyTurnNewCityResult> ({
              action: "newCity",
              land: land.coordinates
            });
          } // case
          case "expedition": {
            const validLands = baronyRules.getValidLandsForExpedition (player, this.context);
            const land = randomUtil.getRandomElement (validLands);
            return of<BaronyTurnExpeditionResult> ({
              action: "expedition",
              land: land.coordinates
            });
          } // case
          case "nobleTitle": {
            const resources: BaronyResourceType[] = [];
            const p = this.context.getPlayer (player);
            const r = { ...p.resources };
            let sum = 0;
            while (sum < 15) {
              if (r.fields) { sum += 5; r.fields--; resources.push ("fields"); }
              else if (r.plain) { sum += 4; r.plain--; resources.push ("plain"); }
              else if (r.forest) { sum += 3; r.forest--; resources.push ("forest"); }
              else { sum += 2; r.mountain--; resources.push ("mountain"); }
            } // while
          } // case
        } // switch
        throw new Error ("TODO");
      } // case
      default: throw new Error (`Task ${(task as BaronyProcessTask).taskName} non gestito.`);
    } // switch
  } // executeAiTask

  private executeAiMovement (sourceLand: BaronyLand, player: string): BaronyMovement {
    const validTargetLands = baronyRules.getValidTargetLandsForMovement (sourceLand.coordinates, player, this.context);
    const targetLand = randomUtil.getRandomElement (validTargetLands);
    if (baronyRules.isConflict (targetLand.coordinates, player, this.context)) {
      if (baronyRules.isVillageBeingDestroyed (targetLand.coordinates, player, this.context)) {
        const villagePlayer = baronyRules.getVillageDestroyedPlayer (targetLand.coordinates, player, this.context);
        if (baronyRules.hasResourcesToTakeForVillageDestruction (villagePlayer.id, this.context)) {
          const validResourcesForVillageDestruction = baronyRules.getValidResourcesForVillageDestruction (villagePlayer.id, this.context);
          const resource = randomUtil.getRandomElement (validResourcesForVillageDestruction);
          return {
            fromLand: sourceLand.coordinates,
            toLand: targetLand.coordinates,
            conflict: true,
            gainedResource: resource
          };
        } // if
      } // if
      return {
        fromLand: sourceLand.coordinates,
        toLand: targetLand.coordinates,
        conflict: true,
        gainedResource: null
      };
    } else {
      return {
        fromLand: sourceLand.coordinates,
        toLand: targetLand.coordinates,
        conflict: false,
        gainedResource: null
      };
    } // if - else
  } // executeAiMovement

  private executeTaskByPlayer$<T extends BaronyProcessTask> (task: T & BaronyProcessTask, player: string): Observable<T["result"]> {
    switch (task.taskName) {
      case "setupPlacement": {
        return this.chooseLandForSetupPlacement$ (player).pipe (
          map (landTile => ({ land: landTile.coordinates }))
        );
      } // case
      case "turn": {
        return this.chooseAction$ (player).pipe (
          switchMap (action => {
            switch (action) {
              case "recruitment": {
                return this.chooseRectruitment$ (player).pipe (
                  map<{ land: BaronyLand, numberOfKnights: number }, BaronyTurnRectruitmentResult> (result => ({
                    action: "recruitment",
                    land: result.land.coordinates,
                    numberOfKnights: result.numberOfKnights
                  }))
                );
              } // case
              case "movement": {
                return this.chooseMovements$ (player).pipe (
                  map<BaronyMovement[], BaronyTurnMovementResult> (movements => ({
                    action: "movement",
                    movements: movements,
                  }))
                );
              } // case
              case "construction": {
                return this.chooseConstructions$ (player, null).pipe (
                  map<BaronyConstruction[], BaronyTurnConstructionResult> (constructions => ({
                    action: "construction",
                    constructions: constructions
                  }))
                );
              } // case
              case "newCity": {
                return this.chooseNewCity$ (player).pipe (
                  map<BaronyLand, BaronyTurnNewCityResult> (land => ({
                    action: "newCity",
                    land: land.coordinates
                  }))
                );
              } // case
              case "expedition": {
                return this.chooseExpedition$ (player).pipe (
                  map<BaronyLand, BaronyTurnExpeditionResult> (land => ({
                    action: "expedition",
                    land: land.coordinates
                  }))
                );
              } // case
              case "nobleTitle": {
                return this.chooseNobleTitle$ (player).pipe (
                  map<BaronyResourceType[], BaronyTurnNobleTiltleResult> (resources => ({
                    action: "nobleTitle",
                    discardedResources: resources
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

  private chooseLandForSetupPlacement$ (player: string): Observable<BaronyLand> {
    const validLands = baronyRules.getValidLandsForSetupPlacement (this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      ...this.setFirstActionUi (player),
      message: `Place a city and a knight.`,
      validLands: validLands.map (land => land.coordinates),
    }));
    return this.landChange$ ();
  } // chooseLandForSetupPlacement$

  private chooseAction$ (player: string): Observable<BaronyAction> {
    const validActions = baronyRules.getValidActions (player, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      ...this.setFirstActionUi (player),
      message: `Choose an action to perform.`,
      validActions: validActions
    }));
    return this.actionChange$ ();
  } // chooseAction$

  private chooseRectruitment$ (player: string): Observable<{ land: BaronyLand, numberOfKnights: number }> {
    return this.chooseLandForRecruitment$ (player).pipe (
      switchMap (land => this.chooseNumberOfKnightsForRecruitment$ (land.coordinates, player).pipe (
        map (numberOfKnights => ({
          land: land,
          numberOfKnights: numberOfKnights
        }))
      ))
    );
  } // chooseRectruitment$

  private chooseLandForRecruitment$ (player: string): Observable<BaronyLand> {
    const validLands = baronyRules.getValidLandsForRecruitment (player, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose a land tile to recruit on.`,
      validLands: validLands.map (lt => lt.coordinates),
    }));
    return this.landChange$ ();
  } // chooseLandForRecruitment$

  private chooseNumberOfKnightsForRecruitment$ (land: BaronyLandCoordinates, player: string): Observable<number> {
    const maxNumberOfKnights = baronyRules.getMaxKnightForRecruitment (land, player, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose the number of knights to recruit.`,
      maxNumberOfKnights: maxNumberOfKnights,
    }));
    return this.numberOfKnightsChange$ ();
  } // chooseNumberOfKnightsForRecruitment$

  private chooseMovements$ (player: string): Observable<BaronyMovement[]> {
    return this.chooseFirstMovement$ (player).pipe (
      switchMap (firstMovement => {
        this.context.applyMovement (firstMovement, player);
        if (baronyRules.isSecondMovementValid (player, firstMovement, this.context)) {
          return this.chooseSecondMovement$ (player, firstMovement).pipe (
            map (secondMovement => {
              if (secondMovement) {
                return [firstMovement, secondMovement];
              } else {
                return [firstMovement];
              } // if - else
            })
          );
        } else {
          return of ([firstMovement]);
        } // if - else
      })
    );
  } // chooseMovements$

  private chooseFirstMovement$ (player: string): Observable<BaronyMovement> {
    return this.chooseLandSourceForFirstMovement$ (player).pipe (
      switchMap (movementSource => this.chooseMovementTargetAndConflict$ (movementSource.coordinates, player))
    );
  } // chooseFirstMovement$

  private chooseSecondMovement$ (player: string, firstMovement: BaronyMovement): Observable<BaronyMovement | null> {
    return this.chooseLandSourceOrPassForSecondMovement$ (player, firstMovement).pipe (
      switchMap (movementSource => {
        if (movementSource) {
          return this.chooseMovementTargetAndConflict$ (movementSource.coordinates, player);
        } else {
          return of (null);
        } // if - else
      })
    );
  } // chooseSecondMovement$

  private chooseMovementTargetAndConflict$ (movementSource: BaronyLandCoordinates, player: string): Observable<BaronyMovement> {
    return this.chooseLandTargetForMovement$ (movementSource, player).pipe (
      switchMap (movementTarget => {
        if (baronyRules.isConflict (movementTarget.coordinates, player, this.context)) {
          if (baronyRules.isVillageBeingDestroyed (movementTarget.coordinates, player, this.context)) {
            const villagePlayer = baronyRules.getVillageDestroyedPlayer (movementTarget.coordinates, player, this.context);
            if (baronyRules.hasResourcesToTakeForVillageDestruction (villagePlayer.id, this.context)) {
              return this.chooseResourceForVillageDestruction$ (player, villagePlayer.id).pipe (
                map (resource => ({
                  fromLand: movementSource,
                  toLand: movementTarget.coordinates,
                  conflict: true,
                  gainedResource: resource
                }))
              );
            } // if
          } // if
          return of ({
            fromLand: movementSource,
            toLand: movementTarget.coordinates,
            conflict: true,
            gainedResource: null
          });
        } else {
          return of ({
            fromLand: movementSource,
            toLand: movementTarget.coordinates,
            conflict: false,
            gainedResource: null
          });
        } // if - else
      }) // switchMap
    );
  } // chooseMovementTargetAndConflict$

  private chooseResourceForVillageDestruction$ (player: string, villagePlayer: string): Observable<BaronyResourceType> {
    const validResourcesForVillageDestruction = baronyRules.getValidResourcesForVillageDestruction (villagePlayer, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose a resource to take for the village destruction.`,
      validResources: {
        player: villagePlayer,
        resources: validResourcesForVillageDestruction
      }
    }));
    return this.resourceChange$ ();
  } // chooseResourceForVillageDestruction$

  private chooseLandSourceForFirstMovement$ (player: string): Observable<BaronyLand> {
    const validSourceLands = baronyRules.getValidSourceLandsForFirstMovement (player, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose a land tile to move a knight from.`,
      validLands: validSourceLands.map (lt => lt.coordinates),
    }));
    return this.landChange$ ();
  } // chooseLandSourceForFirstMovement$

  private chooseLandSourceOrPassForSecondMovement$ (player: string, firstMovement: BaronyMovement): Observable<BaronyLand | null> {
    const validSourceLands = baronyRules.getValidSourceLandsForSecondMovement (player, firstMovement, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose a land tile to move a knight from, or pass.`,
      validLands: validSourceLands.map (lt => lt.coordinates),
      canPass: true
    }));
    return race (
      this.landChange$ (),
      this.passChange$ ().pipe (mapTo (null))
    );
  } // chooseLandTileSourceOrPassForSecondMovement$

  private chooseLandTargetForMovement$ (movementSource: BaronyLandCoordinates, player: string): Observable<BaronyLand> {
    const validSourceLands = baronyRules.getValidTargetLandsForMovement (movementSource, player, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose a land tile to move a knight to.`,
      validLands: validSourceLands.map (lt => lt.coordinates),
    }));
    return this.landChange$ ();
  } // chooseLandTargetForMovement$

  private chooseConstructions$ (player: string, prevConstructions: BaronyConstruction[] | null): Observable<BaronyConstruction[]> {
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

  private chooseConstructionOrPass$ (player: string): Observable<BaronyConstruction | null> {
    return race (
      this.chooseConstruction$ (player, true),
      this.passChange$ ().pipe (mapTo (null))
    );
  } // chooseConstructionOrPass$

  private chooseConstruction$ (player: string, orPass: boolean): Observable<BaronyConstruction> {
    return this.chooseLandForConstruction$ (player, orPass).pipe (
      switchMap (land => this.chooseBuildingForConstruction$ (player, orPass).pipe (
        map<"stronghold" | "village", BaronyConstruction> (building => ({
          building: building,
          land: land.coordinates
        }))
      ))
    );
  } // chooseConstruction$

  private chooseLandForConstruction$ (player: string, orPass: boolean): Observable<BaronyLand> {
    const validLands = baronyRules.getValidLandsForConstruction (player, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose a land tile to construct on${ orPass ? `, or pass` : ``}.`,
      validLands: validLands.map (lt => lt.coordinates),
      canPass: orPass
    }));
    return this.landChange$ ();
  } // chooseLandForConstruction$

  private chooseBuildingForConstruction$ (player: string, orPass: boolean): Observable<"stronghold" | "village"> {
    const validBuildings = baronyRules.getValidBuildingsForConstruction (player, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose a building to construct on the tile${ orPass ? `, or pass` : ``}.`,
      validBuildings: validBuildings,
      canPass: orPass
    }));
    return this.buildingChange$ ();
  } // chooseBuildingForConstruction$

  private chooseNewCity$ (player: string): Observable<BaronyLand> {
    const validLandsForNewCity = baronyRules.getValidLandsForNewCity (player, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose a land tile to build a new city.`,
      validLands: validLandsForNewCity.map (l => l.coordinates)
    }));
    return this.landChange$ ();
  } // chooseNewCity$

  private chooseExpedition$ (player: string): Observable<BaronyLand> {
    const validLandsForExpedition = baronyRules.getValidLandsForExpedition (player, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose a land tile for the expedition.`,
      validLands: validLandsForExpedition.map (l => l.coordinates)
    }));
    return this.landChange$ ();
  } // chooseExpedition$

  private chooseNobleTitle$ (player: string): Observable<BaronyResourceType[]> {
    return this.chooseResourcesForNobleTitle$ (player, [], 0);
  } // chooseNobleTitle$
  
  private chooseResourcesForNobleTitle$ (player: string, resources: BaronyResourceType[], sum: number): Observable<BaronyResourceType[]> {
    return this.chooseResourceForNobleTitle$ (player, sum).pipe (
      switchMap (resource => {
        const resoucePoints = baronyRules.getResourcePoints (resource);
        sum += resoucePoints;
        resources.push (resource);
        this.context.discardResource (resource, player);
        if (sum < 15) {
          return this.chooseResourcesForNobleTitle$ (player, resources, sum);
        } else {
          return of (resources);
        } // if - else
      })
    );
  } // chooseResourcesForNobleTitle$

  private chooseResourceForNobleTitle$ (player: string, sum: number): Observable<BaronyResourceType> {
    const validResourcesForNobleTitle = baronyRules.getValidResourcesForNobleTitle (player, this.context);
    this.updateUi (s => ({
      ...s,
      ...this.resetUi (),
      message: `Choose a resource to discard for the noble title (${sum} / 15).`,
      validResources: {
        player: player,
        resources: validResourcesForNobleTitle
      }
    }));
    return this.resourceChange$ ();
  } // chooseResourceForNobleTitle$

} // BaronyBoardService

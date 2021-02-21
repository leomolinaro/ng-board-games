import { Injectable } from "@angular/core";
import { BgProcessService } from "@bg-services";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { BaronyGameStore } from "../logic";
import { BaronyPlay, BaronyProcessTask } from "../process";
import { debounceTime, map, mapTo, switchMap, tap } from "rxjs/operators";
import { BaronyUiStore } from "./barony-ui.store";
import { BaronyPlayerAiService } from "./barony-player-ai.service";
import { BaronyPlayerLocalService } from "./barony-player-local.service";
import { BaronyPlayerObserverService } from "./barony-player-observer.service";

@Injectable ()
export class BaronyGameService {

  constructor (
    private bgProcessService: BgProcessService,
    private ui: BaronyUiStore,
    private game: BaronyGameStore,
    private aiService: BaronyPlayerAiService,
    private localService: BaronyPlayerLocalService,
    private observerService: BaronyPlayerObserverService
  ) { }
  
  private $pendingTask = new BehaviorSubject<BaronyProcessTask | null> (null);
  selectPendingTask$ () { return this.$pendingTask.asObservable (); }

  resolveTasks$ (): Observable<void> {
    return combineLatest ([
      this.ui.selectCurrentPlayerId$ (),
      this.ui.selectAiPlayerIds$ (),
      this.selectPendingTask$ (),
      this.ui.cancelChange$ (),
    ]).pipe (
      debounceTime (0),
      switchMap (([currentPlayerId, aiPlayersIndicies, task]) => {
        if (this.game.isTemporaryState ()) {
          this.game.endTemporaryState ();
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
      this.ui.setCurrentPlayer (task.data.player);
    } // if - else
  } // autoRefreshCurrentPlayer

  private resolveTask$ (task: BaronyProcessTask | null, currentPlayer: string | null, aiPlayers: string[]): Observable<BaronyProcessTask | null> {
    if (task) {
      this.game.startTemporaryState ();
      return this.executeTask$ (task, currentPlayer, aiPlayers).pipe (
        map (taskResult => {
          this.game.endTemporaryState ();
          if (taskResult) {
            task.result = taskResult;
            const nextTasks = this.bgProcessService.resolveTask (task, this.game) as BaronyProcessTask[];
            return nextTasks[0];
          } else {
            return null;
          } // if - else
        })
      );
    } else {
      const baronyPlay = new BaronyPlay ();
      const startingTasks = this.bgProcessService.startProcess (baronyPlay, this.game) as BaronyProcessTask[];
      const startingTask = startingTasks[0];
      return of (startingTask);
    } // if - else
  } // resolveTask$

  private executeTask$<T extends BaronyProcessTask> (task: T, currentPlayer: string | null, aiPlayers: string[]): Observable<T["result"] | null> {
    if (currentPlayer === task.data.player) {
      return this.localService.executeTask$ (task, currentPlayer);
    } else if (aiPlayers.some (aiPlayer => aiPlayer === task.data.player)) {
      return this.aiService.executeTask$ (task);
    } else {
      return this.observerService.executeTask$ (task);
    } // if - else
  } // executeTask$

} // BaronyBoardService

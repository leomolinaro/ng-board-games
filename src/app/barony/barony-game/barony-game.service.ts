import { Injectable } from "@angular/core";
import { BgProcessService } from "@bg-services";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { BaronyGameStore } from "../logic";
import { BaronyPlay, BaronyProcessTask } from "../process";
import { debounceTime, map, mapTo, switchMap, tap } from "rxjs/operators";
import { BaronyUiStore } from "./barony-ui.store";
import { BaronyPlayerAiService } from "./barony-player-ai.service";
import { BaronyPlayerLocalService } from "./barony-player-local.service";
import { BaronyPlayerRemoteService } from "./barony-player-remote.service";

@Injectable ()
export class BaronyGameService {

  constructor (
    private bgProcessService: BgProcessService,
    private ui: BaronyUiStore,
    private game: BaronyGameStore,
    private aiService: BaronyPlayerAiService,
    private localService: BaronyPlayerLocalService,
    private remoteService: BaronyPlayerRemoteService
  ) { }
  
  private $pendingTask = new BehaviorSubject<BaronyProcessTask | null> (null);
  selectPendingTask$ () { return this.$pendingTask.asObservable (); }

  resolveTasks$ (): Observable<void> {
    return combineLatest ([
      this.ui.selectCurrentPlayerId$ (),
      this.selectPendingTask$ (),
      this.ui.cancelChange$ (),
    ]).pipe (
      debounceTime (0),
      switchMap (([currentPlayerId, task]) => {
        if (this.game.isTemporaryState ()) {
          this.game.endTemporaryState ();
        } // if
        return this.resolveTask$ (task, currentPlayerId).pipe (
          tap (nextTask => {
            if (nextTask) {
              this.$pendingTask.next (nextTask);
              this.autoRefreshCurrentPlayer (currentPlayerId, nextTask);
            } // if
          })
        );
      }),
      mapTo (void 0)
    );
  } // resolveTasks$

  private autoRefreshCurrentPlayer (currentPlayer: string | null, task: BaronyProcessTask) {
    if (this.game.isLocalPlayer (task.data.player)) {
      this.ui.setCurrentPlayer (task.data.player);
    } // if - else
  } // autoRefreshCurrentPlayer

  private resolveTask$ (task: BaronyProcessTask | null, currentPlayer: string | null): Observable<BaronyProcessTask | null> {
    if (task) {
      this.game.startTemporaryState ();
      return this.executeTask$ (task, currentPlayer).pipe (
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

  private executeTask$<T extends BaronyProcessTask> (task: T, currentPlayer: string | null): Observable<T["result"] | null> {
    const turnPlayer = this.game.getPlayer (task.data.player);
    if (currentPlayer === task.data.player) {
      return this.localService.executeTask$ (task, currentPlayer);
    } else if (turnPlayer.isRemote) {
      return this.remoteService.executeTask$ (task);
    } else {
      return this.aiService.executeTask$ (task);
    } // if - else
  } // executeTask$

} // BaronyBoardService

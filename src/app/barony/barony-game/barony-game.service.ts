import { Injectable } from "@angular/core";
import { BgProcessService } from "@bg-services";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { BaronyGameStore } from "../logic";
import { BaronyPlay, BaronyProcessTask, BaronyStory } from "../process";
import { debounceTime, filter, first, map, mapTo, switchMap, tap } from "rxjs/operators";
import { BaronyUiStore } from "./barony-ui.store";
import { BaronyPlayerAiService } from "./barony-player-ai.service";
import { BaronyPlayerLocalService } from "./barony-player-local.service";
import { BaronyPlayerObserverService } from "./barony-player-observer.service";
import { BaronyRemoteService } from "../barony-remote.service";

@Injectable ()
export class BaronyGameService {

  constructor (
    private bgProcessService: BgProcessService,
    private ui: BaronyUiStore,
    private game: BaronyGameStore,
    private aiService: BaronyPlayerAiService,
    private localService: BaronyPlayerLocalService,
    private observerService: BaronyPlayerObserverService,
    private remoteService: BaronyRemoteService
  ) { }
  
  private $pendingTask = new BehaviorSubject<BaronyProcessTask | null> (null);
  selectPendingTask$ () { return this.$pendingTask.asObservable (); }

  private lastStoryId: number = 0;

  resolveTasks$ (stories: BaronyStory[]): Observable<void> {
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
        return this.resolveTask$ (task, currentPlayerId, stories).pipe (
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

  private resolveTask$ (task: BaronyProcessTask | null, currentPlayer: string | null, stories: BaronyStory[]): Observable<BaronyProcessTask | null> {
    if (task) {
      this.game.startTemporaryState ();
      return this.executeTask$ (task, currentPlayer).pipe (
        map (taskResult => {
          this.game.endTemporaryState ();
          task.result = taskResult;
          const nextTasks = this.bgProcessService.resolveTask (task, this.game) as BaronyProcessTask[];
          return nextTasks[0];
        })
      );
    } else {
      const baronyPlay = new BaronyPlay ();
      let startingTasks = this.bgProcessService.startProcess (baronyPlay, this.game) as BaronyProcessTask[];
      let startingTask = startingTasks[0];
      for (const story of stories) {
        startingTask.result = story;
        startingTasks = this.bgProcessService.resolveTask (startingTask, this.game) as BaronyProcessTask[];
        startingTask = startingTasks[0];
        this.lastStoryId++;
      } // for
      return of (startingTask);
    } // if - else
  } // resolveTask$

  private executeTask$ (task: BaronyProcessTask, currentPlayer: string | null): Observable<BaronyStory> {
    const turnPlayer = this.game.getPlayer (task.data.player);
    const nextStoryId = ++this.lastStoryId;
    if (currentPlayer === task.data.player) {
      return this.localService.executeTask$ (task, currentPlayer).pipe (
        switchMap (result => this.remoteService.insertStory$ (result, nextStoryId, this.game.getGameId ()))
      );
    } else if (turnPlayer.isRemote) {
      return this.observerService.executeTask$ (task).pipe (
        switchMap (() => this.remoteService.getStory$ (nextStoryId, this.game.getGameId ())),
        filter (story => !!story),
        map (story => story as BaronyStory),
        first<BaronyStory> ()
      );
    } else {
      return this.aiService.executeTask$ (task).pipe (
        switchMap (result => this.remoteService.insertStory$ (result, nextStoryId, this.game.getGameId ()))
      );
    } // if - else
  } // executeTask$

} // BaronyBoardService

import { Injectable } from "@angular/core";
import { BgAuthService, BgProcessService } from "@bg-services";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { debounceTime, filter, first, map, mapTo, switchMap, tap } from "rxjs/operators";
import { BaronyRemoteService } from "../barony-remote.service";
import { BaronyGameStore } from "../logic";
import { BaronyPlay, BaronyProcessTask, BaronyStory } from "../process";
import { BaronyPlayerAiService } from "./barony-player-ai.service";
import { BaronyPlayerLocalService } from "./barony-player-local.service";
import { BaronyPlayerObserverService } from "./barony-player-observer.service";
import { BaronyUiStore } from "./barony-ui.store";

@Injectable ()
export class BaronyGameService {

  constructor (
    private bgProcessService: BgProcessService,
    private ui: BaronyUiStore,
    private game: BaronyGameStore,
    private aiService: BaronyPlayerAiService,
    private localService: BaronyPlayerLocalService,
    private observerService: BaronyPlayerObserverService,
    private remoteService: BaronyRemoteService,
    private authService: BgAuthService
  ) { }
  
  private $pendingTask = new BehaviorSubject<BaronyProcessTask | null> (null);
  selectPendingTask$ () { return this.$pendingTask.asObservable (); }

  private lastStoryId: number = 0;

  private isLocalPlayer (playerId: string) {
    const user = this.authService.getUser ();
    const player = this.game.getPlayer (playerId);
    return player.isAi ? false : player.controller.id === user.id;
  } // isLocalPlayer

  private isOwnerUser () {
    const user = this.authService.getUser ();
    const gameOwner = this.game.getGameOwner ();
    return user.id === gameOwner.id;
  } // isOwnerUser

  private isCurrentPlayer (playerId: string) {
    const currentPlayerId = this.ui.getCurrentPlayerId ();
    return currentPlayerId === playerId;
  } // isCurrentPlayer

  private isAiPlayer (playerId: string) {
    const player = this.game.getPlayer (playerId);
    return player.isAi;
  } // isAiPlayer

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
    if (this.isLocalPlayer (task.data.player)) {
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
    const turnPlayerId = task.data.player;
    const nextStoryId = ++this.lastStoryId;
    if (this.isLocalPlayer (turnPlayerId) && this.isCurrentPlayer (turnPlayerId)) {
      return this.localService.executeTask$ (task, turnPlayerId).pipe (
        switchMap (result => this.insertStory$ (result, nextStoryId, this.game.getGameId ()))
      );
    } else if (this.isAiPlayer (turnPlayerId) && this.isOwnerUser ()) {
      return this.aiService.executeTask$ (task).pipe (
        switchMap (result => this.insertStory$ (result, nextStoryId, this.game.getGameId ()))
      );
    } else {
      return this.observerService.executeTask$ (task).pipe (
        switchMap (() => this.remoteService.selectStory$ (nextStoryId, this.game.getGameId ())),
        filter (story => !!story),
        map (story => story as BaronyStory),
        first<BaronyStory> ()
      );
    } // if - else
  } // executeTask$

  private insertStory$ (story: BaronyStory, storyId: number, gameId: string) {
    return this.remoteService.insertStory$ ({
      id: storyId,
      ...story
    }, gameId);
  } // insertAction$

} // BaronyBoardService

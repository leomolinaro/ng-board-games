import { EMPTY, NEVER, Observable, expand, filter, finalize, first, forkJoin, last, map, of, race, switchMap, tap } from "rxjs";
import { BgAuthService, BgUser } from "../authentication/bg-auth.service";

interface ABgPlayer<Id extends string> {
  id: Id;
  name: string;
}

export interface BgAiPlayer<Id extends string> extends ABgPlayer<Id> {
  isAi: true;
  isRemote: false;
  isLocal: false;
}

export interface BgRealPlayer<Id extends string> extends ABgPlayer<Id> {
  isAi: false;
  isRemote: boolean;
  isLocal: boolean;
  controller: BgUser;
}

type BgPlayer<Id extends string> = BgAiPlayer<Id> | BgRealPlayer<Id>;

export type BgStoryDoc<Pid, St> = St & { time: number; playerId: Pid };

export interface BgStoryTask<Pid extends string, St, PlSrv> {
  playerId: Pid;
  task$: (playerService: PlSrv) => Observable<St>;
}

export function unexpectedStory<St> (storyDoc: St) {
  console.error ("Unexpected story", storyDoc);
  return new Error ("Unexpected story");
}

export abstract class ABgGameService<Pid extends string, Pl extends BgPlayer<Pid>, St, PlSrv> {
  
  constructor () { }

  protected abstract auth: BgAuthService;
  protected abstract localPlayer: PlSrv;
  protected abstract aiPlayer: PlSrv;

  private storyTime: number = 0;
  protected abstract storyDocs: BgStoryDoc<Pid, St>[] | null;

  protected abstract getGameId (): string;
  protected abstract getPlayer (playerId: string): Pl;
  protected abstract getGameOwner (): BgUser;
  protected abstract getCurrentPlayerId (): string | null;
  protected abstract setCurrentPlayer (playerId: string): void;
  protected abstract currentPlayerChange$ (): Observable<string | null>;
  protected abstract cancelChange$ (): Observable<void>;

  protected abstract startTemporaryState (): void;
  protected abstract endTemporaryState (): void;
  protected abstract resetUi (playerId: string): void;

  protected abstract insertStoryDoc$ (storyId: string, storyDoc: BgStoryDoc<Pid, St>, gameId: string): Observable<unknown>;
  protected abstract selectStoryDoc$ (storyId: string, gameId: string): Observable<BgStoryDoc<Pid, St> | undefined>;

  private isLocalPlayer (playerId: string) {
    const user = this.auth.getUser ();
    const player = this.getPlayer (playerId);
    return player.isAi ? false : player.controller.id === user.id;
  }

  private isOwnerUser () {
    const user = this.auth.getUser ();
    const gameOwner = this.getGameOwner ();
    return user.id === gameOwner.id;
  }

  private isCurrentPlayer (playerId: string) {
    const currentPlayerId = this.getCurrentPlayerId ();
    return currentPlayerId === playerId;
  }

  private isAiPlayer (playerId: string) {
    const player = this.getPlayer (playerId);
    return player.isAi;
  }

  private autoRefreshCurrentPlayer (player: string) {
    if (this.isLocalPlayer (player)) {
      this.setCurrentPlayer (player);
      return true;
    }
    return false;
  }

  private getPlayerService (playerId: Pid) {
    if (this.isLocalPlayer (playerId) && this.isCurrentPlayer (playerId)) {
      return this.localPlayer;
    } else if (this.isAiPlayer (playerId) && this.isOwnerUser ()) {
      return this.aiPlayer;
    } else {
      return null;
    }
  }

  private getLocalStory$<R extends St> (time: number, playerId: Pid, task$: (playerService: PlSrv) => Observable<R>): Observable<BgStoryDoc<Pid, R> | null> {
    const playerService = this.getPlayerService (playerId);
    if (!playerService) { return NEVER; }
    this.startTemporaryState ();
    return task$ (playerService).pipe (
      switchMap (story => {
        const storyDoc: BgStoryDoc<Pid, R> = { ...story, time, playerId };
        const storyId = getStoryId (storyDoc.time, playerId);
        return this.insertStoryDoc$ (storyId, storyDoc, this.getGameId ()).pipe (map (() => storyDoc));
      }),
      finalize (() => this.endTemporaryState ())
    );
  }

  private getRemoteStory$<R extends St> (time: number, playerId: Pid): Observable<BgStoryDoc<Pid, R> | null> {
    const storyId = getStoryId (time, playerId);
    return this.selectStoryDoc$ (storyId, this.getGameId ()).pipe (
      filter (storyDoc => !!storyDoc),
      map (story => story as BgStoryDoc<Pid, R>),
      first ()
    );
  }

  private getPastStory<R extends St> (time: number, playerId: Pid): null | R {
    if (!this.storyDocs?.length) { return null; }
    const storyDoc = this.storyDocs.shift ()!;
    if (storyDoc.time !== time || storyDoc.playerId !== playerId) { throw unexpectedStory (storyDoc); }
    this.storyTime = time;
    return storyDoc as St as R;
  }

  private getStory$<R extends St> (time: number, playerId: Pid, task$: (playerService: PlSrv) => Observable<R>): Observable<BgStoryDoc<Pid, R> | null> {
    this.resetUi (playerId);
    return race (
      this.getLocalStory$ (time, playerId, task$),
      this.getRemoteStory$<R> (time, playerId),
      this.currentPlayerChange$ ().pipe (map (() => null)),
      this.cancelChange$ ().pipe (map (() => null))
    );
  }

  private getStoryWrap$<R extends St> (time: number, playerId: Pid, task$: (playerService: PlSrv) => Observable<R>): Observable<R> {
    const pastStory = this.getPastStory<R> (time, playerId);
    if (pastStory) { return of (pastStory); }
    return this.getStory$ (time, playerId, task$).pipe (
      expand (storyDoc => {
        if (storyDoc) { return EMPTY; }
        return this.getStory$ (time, playerId, task$);
      }),
      last (),
      map (story => story!)
    );
  }

  protected executeTask$<R extends St> (playerId: Pid, task$: (playerService: PlSrv) => Observable<R>): Observable<R> {
    const time = this.storyTime + 1;
    this.autoRefreshCurrentPlayer (playerId);
    return this.getStoryWrap$<R> (time, playerId, task$).pipe (
      tap (() => this.storyTime = time)
    );
  }

  protected executeTasks$ (tasks: BgStoryTask<Pid, St, PlSrv>[]): Observable<St[]> {
    const time = this.storyTime + 1;
    tasks.find (task => this.autoRefreshCurrentPlayer (task.playerId));
    return forkJoin (tasks.map (task => this.getStoryWrap$ (time, task.playerId, task.task$))).pipe (
      tap (() => this.storyTime = time)
    );
  }

}

export function getStoryId (time: number, playerId: string) {
  const timeString = time.toString ();
  const zerosToAdd = 4 - timeString.length;
  return `${"0".repeat (zerosToAdd)}${timeString}.${playerId}`;
}

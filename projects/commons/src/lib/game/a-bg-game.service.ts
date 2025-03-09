import { EMPTY, Observable, defer, expand, filter, finalize, first, forkJoin, last, map, of, race, switchMap, tap } from "rxjs";
import { BgAuthService, BgUser } from "../authentication/bg-auth.service";

interface ABgPlayer<Id extends string> {
  id: Id;
  name: string;
  isRemote: boolean;
  isLocal: boolean;
}

export interface BgAiPlayer<Id extends string> extends ABgPlayer<Id> {
  isAi: true;
}

export interface BgRealPlayer<Id extends string> extends ABgPlayer<Id> {
  isAi: false;
  controller: BgUser;
}

type BgPlayer<Id extends string> = BgAiPlayer<Id> | BgRealPlayer<Id>;

export type BgStoryDoc<Pid, St> = St & { time: number; playerId: Pid };

export interface BgStoryTask<Pid extends string, St, PlSrv> {
  playerId: Pid;
  task$: (playerService: PlSrv) => Observable<St>;
}

export function unexpectedStory<St> (actualStoryDoc: St, expected: string) {
  console.error ("Unexpected story", actualStoryDoc, " Expected: ", expected);
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

  private isRemotePlayer (playerId: string) {
    const player = this.getPlayer (playerId);
    return player.isRemote;
  }

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

  private getLocalStory$<R extends St> (time: number, playerId: Pid, task$: () => Observable<R>): Observable<BgStoryDoc<Pid, R> | null> {
    this.startTemporaryState ();
    return task$ ().pipe (
      switchMap (story => {
        const storyDoc: BgStoryDoc<Pid, R> = { ...story, time, playerId };
        const storyId = getStoryId (storyDoc.time, playerId);
        return this.insertStoryDoc$ (storyId, storyDoc, this.getGameId ()).pipe (map (() => storyDoc));
      }),
      finalize (() => this.endTemporaryState ())
    );
  }

  private getRemoteStory$<R extends St> (time: number, playerId: Pid): Observable<BgStoryDoc<Pid, R>> {
    const storyId = getStoryId (time, playerId);
    return this.selectStoryDoc$ (storyId, this.getGameId ()).pipe (
      filter (storyDoc => !!storyDoc),
      map (story => story as BgStoryDoc<Pid, R>),
      first ()
    );
  }

  private getLocalStoryWrap$<R extends St> (time: number, playerId: Pid, task$: (playerService: PlSrv) => Observable<R>): Observable<BgStoryDoc<Pid, R> | null> {
    return defer (() => {
      const playerService = this.getPlayerService (playerId);
      if (playerService) {
        return race (
          this.getLocalStory$ (time, playerId, () => task$ (playerService)),
          this.currentPlayerChange$ ().pipe (map (() => null)),
          this.cancelChange$ ().pipe (map (() => null))
        );
      } else {
        return this.currentPlayerChange$ ().pipe (map (() => null));
      }
    });
  }

  private getStoryWrap$<R extends St> (time: number, playerId: Pid, task$: (playerService: PlSrv) => Observable<R>): Observable<R> {
    if (this.isRemotePlayer (playerId)) {
      this.resetUi (playerId);
      return this.getRemoteStory$<R> (time, playerId);
    } else {
      this.resetUi (playerId);
      return this.getLocalStoryWrap$ (time, playerId, task$).pipe (
        expand (storyDoc => {
          if (storyDoc) { return EMPTY; }
          this.resetUi (playerId);
          return this.getLocalStoryWrap$ (time, playerId, task$);
        }),
        last (),
        map (story => story!)
      );
    }
  }

  protected executeTask$<R extends St> (playerId: Pid, task$: (playerService: PlSrv) => Observable<R>): Observable<R> {
    const time = this.storyTime + 1;
    this.autoRefreshCurrentPlayer (playerId);
    if (this.storyDocs?.length) {
      const storyDoc = this.storyDocs.shift ()!;
      this.storyTime = time;
      if (storyDoc.time !== time) { throw unexpectedStory (storyDoc, `time ${time}`); }
      if (storyDoc.playerId !== playerId) { throw unexpectedStory (storyDoc, `player ${playerId}`); }
      return of (storyDoc as R);
    }
    return this.getStoryWrap$<R> (time, playerId, task$).pipe (
      tap (() => this.storyTime = time)
    );
  }

  protected executeTasks$ (tasks: BgStoryTask<Pid, St, PlSrv>[]): Observable<St[]> {
    const time = this.storyTime + 1;
    tasks.find (task => this.autoRefreshCurrentPlayer (task.playerId));

    const storyDocByPlayer = new Map<Pid, BgStoryDoc<Pid, St>> ();
    let i = 0;
    while (this.storyDocs?.length && i < tasks.length) {
      const storyDoc = this.storyDocs.shift ()!;
      storyDocByPlayer.set (storyDoc.playerId, storyDoc);
      i++;
    }

    const storyDoc$s: Observable<St>[] = [];
    for (const task of tasks) {
      const storyDoc = storyDocByPlayer.get (task.playerId);
      if (storyDoc) {
        storyDocByPlayer.delete (task.playerId);
        storyDoc$s.push (of (storyDoc));
        if (storyDoc.time !== time) { throw unexpectedStory (storyDoc, `time ${time}`); }
      } else {
        storyDoc$s.push (this.getStoryWrap$ (time, task.playerId, task.task$));
      }
    }

    if (storyDocByPlayer.size) {
      const next = storyDocByPlayer.values ().next ();
      throw unexpectedStory (next, `player be ${tasks.map (t => t.playerId).join (" or ")}`);
    }

    return forkJoin (storyDoc$s).pipe (
      tap (() => this.storyTime = time)
    );
  }

}

export function getStoryId (time: number, playerId: string) {
  const timeString = time.toString ();
  const zerosToAdd = 4 - timeString.length;
  return `${"0".repeat (zerosToAdd)}${timeString}.${playerId}`;
}

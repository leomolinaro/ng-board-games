import { EMPTY, NEVER, Observable, expand, filter, first, last, map, of, race, switchMap } from "rxjs";
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

export function unexpectedStory<St> (storyDoc: St) {
  console.error ("Unexpected story", storyDoc);
  return new Error ("Unexpected story");
}

export abstract class ABgGameService<Pid extends string, Pl extends BgPlayer<Pid>, St, PlSrv> {
  
  constructor () { }

  protected abstract authService: BgAuthService;
  protected abstract localService: PlSrv;
  protected abstract aiService: PlSrv;

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
    const user = this.authService.getUser ();
    const player = this.getPlayer (playerId);
    return player.isAi ? false : player.controller.id === user.id;
  }

  private isOwnerUser () {
    const user = this.authService.getUser ();
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
    }
  }

  private getPlayerService (playerId: Pid) {
    if (this.isLocalPlayer (playerId) && this.isCurrentPlayer (playerId)) {
      return this.localService;
    } else if (this.isAiPlayer (playerId) && this.isOwnerUser ()) {
      return this.aiService;
    } else {
      return null;
    }
  }

  private getLocalStory$<R extends St> (time: number, playerId: Pid, task$: (playerService: PlSrv) => Observable<R>): Observable<BgStoryDoc<Pid, R> | null> {
    const playerService = this.getPlayerService (playerId);
    if (!playerService) { return NEVER; }
    return task$ (playerService).pipe (
      switchMap (story => {
        const storyDoc: BgStoryDoc<Pid, R> = { ...story, time, playerId };
        const storyId = storyDoc.time + "." + playerId;
        return this.insertStoryDoc$ (storyId, storyDoc, this.getGameId ()).pipe (map (() => storyDoc));
      })
    );
  }

  private getRemoteStory$<R extends St> (time: number, playerId: Pid): Observable<BgStoryDoc<Pid, R> | null> {
    const storyId = time + "." + playerId;
    return this.selectStoryDoc$ (storyId, this.getGameId ()).pipe (
      filter (storyDoc => !!storyDoc),
      map (story => story as BgStoryDoc<Pid, R>),
      first ()
    );
  }

  private getPastStory (time: number, playerId: Pid) {
    if (!this.storyDocs?.length) { return null; }
    const storyDoc = this.storyDocs.shift ()!;
    if (storyDoc.time !== time || storyDoc.playerId !== playerId) { throw unexpectedStory (storyDoc); }
    this.storyTime = time;
    return storyDoc;
  }

  private getStory$<R extends St> (time: number, playerId: Pid, task$: (playerService: PlSrv) => Observable<R>): Observable<BgStoryDoc<Pid, R> | null> {
    this.startTemporaryState ();
    this.resetUi (playerId);
    return race (
      this.getLocalStory$ (time, playerId, task$),
      this.getRemoteStory$<R> (time, playerId),
      this.currentPlayerChange$ ().pipe (map (() => null)),
      this.cancelChange$ ().pipe (map (() => null))
    );
  }

  protected executeTask$<R extends St> (playerId: Pid, task$: (playerService: PlSrv) => Observable<R>): Observable<R> {
    const time = this.storyTime + 1;
    const pastStory = this.getPastStory (time, playerId);
    if (pastStory) { return of (pastStory as St as R); }
    this.autoRefreshCurrentPlayer (playerId);
    return this.getStory$ (time, playerId, task$).pipe (
      expand (storyDoc => {
        this.endTemporaryState ();
        if (storyDoc) {
          this.storyTime = time;
          return EMPTY;
        } else {
          return this.getStory$ (time, playerId, task$);
        }
      }),
      last (),
      map (story => story!)
    );
  }

}

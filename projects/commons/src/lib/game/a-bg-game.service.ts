import {
  EMPTY,
  Observable,
  expand,
  filter,
  first,
  firstValueFrom,
  last,
  map,
  of,
  race,
  tap
} from "rxjs";
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

export interface BgStoryTask$<Pid extends string, St, PlSrv> {
  playerId: Pid;
  task$: (playerService: PlSrv) => Observable<St>;
}

export interface BgStoryTask<Pid extends string, St, PlSrv> {
  playerId: Pid;
  task: (playerService: PlSrv) => Promise<St>;
}

export function unexpectedStory<St>(actualStoryDoc: St, expected: string) {
  console.error("Unexpected story", actualStoryDoc, " Expected: ", expected);
  return new Error("Unexpected story");
}

export abstract class ABgGameService<Pid extends string, Pl extends BgPlayer<Pid>, St, PlSrv> {
  constructor() {}

  protected abstract auth: BgAuthService;
  protected abstract localPlayer: PlSrv;
  protected abstract aiPlayer: PlSrv;

  private storyTime: number = 0;
  protected abstract storyDocs: BgStoryDoc<Pid, St>[] | null;

  protected abstract getGameId(): string;
  protected abstract getPlayer(playerId: string): Pl;
  protected abstract getGameOwner(): BgUser;
  protected abstract getCurrentPlayerId(): Pid | null;
  protected abstract setCurrentPlayer(playerId: string): void;
  protected abstract currentPlayerChange$(): Observable<unknown>;
  protected abstract cancelChange$(): Observable<void>;

  protected abstract startTemporaryState(): void;
  protected abstract endTemporaryState(): void;
  protected abstract resetUi(playerId: string): void;

  clear() {
    this.storyTime = 0;
    this.storyDocs = null;
  }

  protected abstract insertStoryDoc$(
    storyId: string,
    storyDoc: BgStoryDoc<Pid, St>,
    gameId: string
  ): Observable<unknown>;
  protected abstract selectStoryDoc$(
    storyId: string,
    gameId: string
  ): Observable<BgStoryDoc<Pid, St> | undefined>;

  private isRemotePlayer(playerId: string) {
    const player = this.getPlayer(playerId);
    return player.isRemote;
  }

  private isLocalPlayer(playerId: string) {
    const user = this.auth.getUser();
    const player = this.getPlayer(playerId);
    return player.isAi ? false : player.controller.id === user.id;
  }

  private isOwnerUser() {
    const user = this.auth.getUser();
    const gameOwner = this.getGameOwner();
    return user.id === gameOwner.id;
  }

  private isCurrentPlayer(playerId: string) {
    const currentPlayerId = this.getCurrentPlayerId();
    return currentPlayerId === playerId;
  }

  private isAiPlayer(playerId: string) {
    const player = this.getPlayer(playerId);
    return player.isAi;
  }

  private autoRefreshCurrentPlayer(player: string) {
    if (this.isLocalPlayer(player)) {
      this.setCurrentPlayer(player);
      return true;
    }
    return false;
  }

  private getPlayerService(playerId: Pid) {
    if (this.isLocalPlayer(playerId) && this.isCurrentPlayer(playerId)) {
      return this.localPlayer;
    } else if (this.isAiPlayer(playerId) && this.isOwnerUser()) {
      return this.aiPlayer;
    } else {
      return null;
    }
  }

  private async getLocalStory<R extends St>(
    time: number,
    playerId: Pid,
    task: () => Promise<R>
  ): Promise<R | null> {
    this.startTemporaryState();
    const story = await task();
    await this.insertStory(story, time, playerId);
    this.endTemporaryState();
    return story;
  }

  private async insertStory(story: St, time: number, playerId: Pid) {
    const storyDoc: BgStoryDoc<Pid, St> = { ...story, time, playerId };
    const storyId = getStoryId(storyDoc.time, playerId);
    await firstValueFrom(this.insertStoryDoc$(storyId, storyDoc, this.getGameId()));
    return storyDoc;
  }

  private getRemoteStory$<R extends St>(
    time: number,
    playerId: Pid
  ): Observable<BgStoryDoc<Pid, R>> {
    const storyId = getStoryId(time, playerId);
    return this.selectStoryDoc$(storyId, this.getGameId()).pipe(
      filter(storyDoc => !!storyDoc),
      map(story => story as BgStoryDoc<Pid, R>),
      first()
    );
  }

  private getLocalStoryWrap$<R extends St>(
    time: number,
    playerId: Pid,
    task: (playerService: PlSrv) => Promise<R>
  ): Observable<R | null> {
    const playerService = this.getPlayerService(playerId);
    if (playerService) {
      return race(
        this.getLocalStory(time, playerId, () => task(playerService)),
        this.currentPlayerChange$().pipe(map(() => null)),
        this.cancelChange$().pipe(map(() => null))
      );
    } else {
      return this.currentPlayerChange$().pipe(map(() => null));
    }
  }

  private getStoryWrap$<R extends St>(
    time: number,
    playerId: Pid,
    task: (playerService: PlSrv) => Promise<R>
  ): Observable<R> {
    if (this.isRemotePlayer(playerId)) {
      this.resetUi(playerId);
      return this.getRemoteStory$<R>(time, playerId);
    } else {
      this.resetUi(playerId);
      return this.getLocalStoryWrap$(time, playerId, task).pipe(
        expand(storyDoc => {
          if (storyDoc) {
            return EMPTY;
          }
          this.resetUi(playerId);
          return this.getLocalStoryWrap$(time, playerId, task);
        }),
        last(),
        map(story => story!)
      );
    }
  }

  protected executeTask<R extends St>(
    playerId: Pid,
    task: (playerService: PlSrv) => Promise<R>
  ): Promise<R> {
    return firstValueFrom(this.executeTask$(playerId, p => task(p)));
  }

  private executeTask$<R extends St>(
    playerId: Pid,
    task: (playerService: PlSrv) => Promise<R>
  ): Observable<R> {
    const time = this.storyTime + 1;
    this.autoRefreshCurrentPlayer(playerId);
    if (this.storyDocs?.length) {
      const storyDoc = this.storyDocs.shift()!;
      this.storyTime = time;
      if (storyDoc.time !== time) {
        throw unexpectedStory(storyDoc, `time ${time}`);
      }
      if (storyDoc.playerId !== playerId) {
        throw unexpectedStory(storyDoc, `player ${playerId}`);
      }
      return of(storyDoc as R);
    }
    return this.getStoryWrap$(time, playerId, task).pipe(tap(() => (this.storyTime = time)));
  }

  protected async executeTasks(tasks: BgStoryTask<Pid, St, PlSrv>[]): Promise<St[]> {
    const time = this.storyTime + 1;

    const storyDocByPlayer = new Map<Pid, St>();
    const pastStoryDocByPlayer = new Map<Pid, BgStoryDoc<Pid, St>>();
    let i = 0;
    while (this.storyDocs?.length && i < tasks.length) {
      const storyDoc = this.storyDocs.shift()!;
      pastStoryDocByPlayer.set(storyDoc.playerId, storyDoc);
      i++;
    }

    const remoteTasks: BgStoryTask<Pid, St, PlSrv>[] = [];
    const localTasks: BgStoryTask<Pid, St, PlSrv>[] = [];
    const aiTasks: BgStoryTask<Pid, St, PlSrv>[] = [];
    for (const task of tasks) {
      const storyDoc = pastStoryDocByPlayer.get(task.playerId);
      if (storyDoc) {
        pastStoryDocByPlayer.delete(task.playerId);
        storyDocByPlayer.set(task.playerId, storyDoc);
        if (storyDoc.time !== time) {
          throw unexpectedStory(storyDoc, `time ${time}`);
        }
      } else {
        if (this.isLocalPlayer(task.playerId)) {
          localTasks.push(task);
        } else if (this.isAiPlayer(task.playerId) && this.isOwnerUser()) {
          aiTasks.push(task);
        } else {
          remoteTasks.push(task);
        }
      }
    }

    if (pastStoryDocByPlayer.size) {
      const next = pastStoryDocByPlayer.values().next();
      throw unexpectedStory(next, `player be ${tasks.map(t => t.playerId).join(" or ")}`);
    }

    for (const aiTask of aiTasks) {
      this.resetUi(aiTask.playerId);
      const playerService = this.getPlayerService(aiTask.playerId)!;
      const story = await aiTask.task(playerService);
      await this.insertStory(story, time, aiTask.playerId);
      storyDocByPlayer.set(aiTask.playerId, story);
    }

    while (localTasks.length) {
      let playerId = this.getCurrentPlayerId();
      let task: BgStoryTask<Pid, St, PlSrv>;
      const taskIndex = localTasks.findIndex(t => t.playerId === playerId);
      if (taskIndex >= 0) {
        task = localTasks.splice(taskIndex, 1)[0];
      } else {
        task = localTasks.shift()!;
        playerId = task.playerId;
        this.autoRefreshCurrentPlayer(playerId);
      }
      const playerService = this.getPlayerService(playerId!)!;
      this.resetUi(playerId!);
      const story = await firstValueFrom(
        race(
          this.getLocalStory(time, playerId!, () => task.task(playerService)),
          this.currentPlayerChange$().pipe(map(() => null)),
          this.cancelChange$().pipe(map(() => null))
        )
      );
      if (story) {
        storyDocByPlayer.set(task.playerId, story);
      } else {
        localTasks.push(task);
      }
    }

    for (const remoteTask of remoteTasks) {
      this.resetUi(remoteTask.playerId);
      const story = await firstValueFrom(this.getRemoteStory$(time, remoteTask.playerId));
      storyDocByPlayer.set(remoteTask.playerId, story);
    }

    const storyDocs: St[] = [];
    for (const task of tasks) {
      const story = storyDocByPlayer.get(task.playerId)!;
      storyDocs.push(story);
    }

    this.storyTime = time;
    return storyDocs;
  }
}

export function getStoryId(time: number, playerId: string) {
  const timeString = time.toString();
  const zerosToAdd = 4 - timeString.length;
  return `${"0".repeat(zerosToAdd)}${timeString}.${playerId}`;
}

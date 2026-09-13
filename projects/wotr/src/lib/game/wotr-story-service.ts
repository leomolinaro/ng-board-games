import { Injectable, inject } from '@angular/core';
import {
  ABgGameService,
  BgAuthService,
  type BgUser,
  getStoryId,
} from '@leobg/commons';
import { type Observable, Subject, firstValueFrom, from } from 'rxjs';
import { WotrActionRegistry } from '../commons/wotr-action-registry';
import type { WotrFrontId } from '../front/wotr-front-models';
import { WotrFrontStore } from '../front/wotr-front-store';
import type { WotrPlayerAi } from '../player/wotr-player-ai';
import type { WotrPlayerInfo } from '../player/wotr-player-info-models';
import { WotrPlayerInfoStore } from '../player/wotr-player-info-store';
import type { WotrPlayerStoryService } from '../player/wotr-player-story-service';
import type { WotrPlayerUi } from '../player/wotr-player-ui';
import { WotrRemoteService } from '../remote/wotr-remote';
import { WotrGameStore } from './wotr-game-store';
import { WotrGameUi } from './wotr-game-ui';
import type { WotrStory, WotrStoryDoc } from './wotr-story-models';

export interface WotrStoryTask {
  playerId: WotrFrontId;
  task: (playerService: WotrPlayerStoryService) => Promise<WotrStory>;
}

@Injectable()
export class WotrStoryService extends ABgGameService<
  WotrFrontId,
  WotrPlayerInfo,
  WotrStory,
  WotrPlayerStoryService
> {
  private store = inject(WotrGameStore);
  private ui = inject(WotrGameUi);
  private remote = inject(WotrRemoteService);
  private frontStore = inject(WotrFrontStore);
  private playerStore = inject(WotrPlayerInfoStore);
  protected override auth = inject(BgAuthService);
  protected override aiPlayer!: WotrPlayerAi;
  protected override localPlayer!: WotrPlayerUi;
  private actionRegistry = inject(WotrActionRegistry);

  init(localPlayer: WotrPlayerUi): void {
    this.localPlayer = localPlayer;
  }

  protected storyDocs: WotrStoryDoc[] | undefined = undefined;
  setStoryDocs(storyDocs: WotrStoryDoc[]): void {
    this.storyDocs = storyDocs;
  }

  protected override getGameId(): string {
    return this.store.getGameId();
  }
  protected override getPlayer(playerId: WotrFrontId): WotrPlayerInfo {
    return this.playerStore.player(playerId);
  }
  protected override getGameOwner(): BgUser {
    return this.store.getGameOwner();
  }
  protected override startTemporaryState(): void {
    this.store.startTemporaryState();
  }
  protected override endTemporaryState(): void {
    this.store.endTemporaryState();
  }
  protected override insertStoryDoc$(
    storyId: string,
    story: WotrStoryDoc,
    gameId: string,
  ): Observable<WotrStoryDoc> {
    return from(this.remote.insertStory(storyId, story, gameId));
  }
  protected override selectStoryDoc$(
    storyId: string,
    gameId: string,
  ): Observable<WotrStoryDoc | undefined> {
    return this.remote.selectStory$(storyId, gameId);
  }
  protected override getCurrentPlayerId(): WotrFrontId | undefined {
    return this.ui.currentPlayerId();
  }
  protected override setCurrentPlayer(playerId: WotrFrontId): void {
    this.ui.setCurrentPlayerId(playerId);
  }
  protected override currentPlayerChange$(): Observable<
    WotrFrontId | undefined
  > {
    return from(this.ui.player.get());
  }
  protected override cancelChange$(): Observable<void> {
    return from(this.ui.cancel.get());
  }

  private nReplayStories = 0;
  private replayToLastStory = true;
  private $replayCall = new Subject<void>();

  setReplayMode(isReplayMode: boolean): void {
    this.replayToLastStory = !isReplayMode;
  }

  private currentStory: WotrStory | undefined = undefined;
  getCurrentStory(): WotrStory | undefined {
    return this.currentStory;
  }

  private async executeTask2(
    playerId: WotrFrontId,
    task: (playerService: WotrPlayerStoryService) => Promise<WotrStory>,
  ): Promise<WotrStory> {
    await this.replayCall();
    return super.executeTask(playerId, (p) => task(p));
  }

  private async executeTasks2(tasks: WotrStoryTask[]): Promise<WotrStory[]> {
    await this.replayCall();
    return super.executeTasks(tasks);
  }

  private async replayCall(): Promise<void> {
    if (this.storyDocs?.length) {
      if (!this.replayToLastStory && this.nReplayStories <= 0) {
        await firstValueFrom(this.$replayCall);
      }
    } else {
      this.nReplayStories = 0;
      this.replayToLastStory = false;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 1);
    });
    this.nReplayStories--;
  }

  nextReplay(nReplayStories: number): void {
    if (nReplayStories > 0) {
      this.nReplayStories = nReplayStories;
      this.$replayCall.next();
    } else if (nReplayStories < 0) {
      throw new Error('Not implemented: negative replay stories');
    }
  }

  async eraseLast(): Promise<void> {
    await this.remote.deleteStory(
      getStoryId(this.storyTime, 'free-peoples'),
      this.getGameId(),
    );
  }

  lastReplay(): void {
    this.replayToLastStory = true;
    this.$replayCall.next();
  }

  protected override resetUi(turnPlayer: WotrFrontId): void {
    this.ui.resetUi(turnPlayer);
  }

  async parallelStories(
    getTask: (
      front: WotrFrontId,
    ) => (playerService: WotrPlayerStoryService) => Promise<WotrStory>,
  ): Promise<Record<WotrFrontId, WotrStory>> {
    const stories = await this.executeTasks2(
      this.frontStore
        .frontIds()
        .map((front) => ({ playerId: front, task: getTask(front) })),
    );
    const entries: [WotrFrontId, WotrStory][] = [];
    for (const [index, frontId] of this.frontStore.frontIds().entries()) {
      const story = stories[index];
      await this.applyStory(story, frontId);
      entries.push([frontId, story]);
    }
    return Object.fromEntries(entries) as Record<WotrFrontId, WotrStory>;
  }

  async story(
    front: WotrFrontId,
    task: (playerService: WotrPlayerStoryService) => Promise<WotrStory>,
  ): Promise<WotrStory> {
    const story = await this.executeTask2(front, task);
    await this.applyStory(story, front);
    return story;
  }

  private async applyStory(
    story: WotrStory,
    front: WotrFrontId,
  ): Promise<void> {
    this.currentStory = story;
    await this.actionRegistry.applyStory(story, front);
    this.currentStory = undefined;
  }
}

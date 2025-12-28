import { Injectable, inject } from "@angular/core";
import { ABgGameService, BgAuthService, getStoryId } from "@leobg/commons";
import { Subject, firstValueFrom, from } from "rxjs";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";
import { WotrPlayerAi } from "../player/wotr-player-ai";
import { WotrPlayerInfo } from "../player/wotr-player-info-models";
import { WotrPlayerInfoStore } from "../player/wotr-player-info-store";
import { WotrPlayerStoryService } from "../player/wotr-player-story-service";
import { WotrPlayerUi } from "../player/wotr-player-ui";
import { WotrRemoteService } from "../remote/wotr-remote";
import { WotrGameStore } from "./wotr-game-store";
import { WotrGameUi } from "./wotr-game-ui";
import { WotrStory, WotrStoryDoc } from "./wotr-story-models";

export interface WotrStoryTask {
  playerId: WotrFrontId;
  task: (playerService: WotrPlayerStoryService) => Promise<WotrStory>;
}

@Injectable({ providedIn: "root" })
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

  init(localPlayer: WotrPlayerUi) {
    this.localPlayer = localPlayer;
  }

  protected storyDocs: WotrStoryDoc[] | null = null;
  setStoryDocs(storyDocs: WotrStoryDoc[]) {
    this.storyDocs = storyDocs;
  }

  protected override getGameId() {
    return this.store.getGameId();
  }
  protected override getPlayer(playerId: WotrFrontId) {
    return this.playerStore.player(playerId);
  }
  protected override getGameOwner() {
    return this.store.getGameOwner();
  }
  protected override startTemporaryState() {
    this.store.startTemporaryState();
  }
  protected override endTemporaryState() {
    this.store.endTemporaryState();
  }
  protected override insertStoryDoc$(storyId: string, story: WotrStoryDoc, gameId: string) {
    return this.remote.insertStory$(storyId, story, gameId);
  }
  protected override selectStoryDoc$(storyId: string, gameId: string) {
    return this.remote.selectStory$(storyId, gameId);
  }
  protected override getCurrentPlayerId() {
    return this.ui.currentPlayerId();
  }
  protected override setCurrentPlayer(playerId: WotrFrontId) {
    this.ui.setCurrentPlayerId(playerId);
  }
  protected override currentPlayerChange$() {
    return from(this.ui.player.get());
  }
  protected override cancelChange$() {
    return from(this.ui.cancel.get());
  }

  private nReplayStories = 0;
  private replayToLastStory = false;
  private $replayCall = new Subject<void>();
  private currentStory: WotrStory | null = null;
  getCurrentStory() {
    return this.currentStory;
  }

  private async executeTask2(
    playerId: WotrFrontId,
    task: (playerService: WotrPlayerStoryService) => Promise<WotrStory>
  ): Promise<WotrStory> {
    await this.replayCall();
    return super.executeTask(playerId, p => task(p));
  }

  private async executeTasks2(tasks: WotrStoryTask[]): Promise<WotrStory[]> {
    await this.replayCall();
    return super.executeTasks(tasks);
  }

  private async replayCall() {
    if (this.storyDocs?.length) {
      if (!this.replayToLastStory && this.nReplayStories <= 0) {
        await firstValueFrom(this.$replayCall);
      }
    } else {
      this.nReplayStories = 0;
      this.replayToLastStory = false;
    }
    await new Promise(resolve => {
      setTimeout(resolve, 1);
    });
    this.nReplayStories--;
  }

  nextReplay(nReplayStories: number) {
    if (nReplayStories > 0) {
      this.nReplayStories = nReplayStories;
      this.$replayCall.next();
    } else if (nReplayStories < 0) {
      throw new Error("Not implemented: negative replay stories");
    }
  }

  eraseLast() {
    this.remote.deleteStory$(getStoryId(this.storyTime, "free-peoples"), this.getGameId());
    console.log("this", this);
  }

  lastReplay() {
    this.replayToLastStory = true;
    this.$replayCall.next();
  }

  protected override resetUi(turnPlayer: WotrFrontId) {
    this.ui.resetUi(turnPlayer);
  }

  async parallelStories(
    getTask: (front: WotrFrontId) => (playerService: WotrPlayerStoryService) => Promise<WotrStory>
  ) {
    const stories = await this.executeTasks2(
      this.frontStore.frontIds().map(front => ({ playerId: front, task: getTask(front) }))
    );
    let index = 0;
    const toReturn: Record<WotrFrontId, WotrStory> = {} as any;
    for (const frontId of this.frontStore.frontIds()) {
      const story = stories[index++];
      await this.applyStory(story, frontId);
      toReturn[frontId] = story;
    }
    return toReturn;
  }

  async story(
    front: WotrFrontId,
    task: (playerService: WotrPlayerStoryService) => Promise<WotrStory>
  ) {
    const story = await this.executeTask2(front, task);
    await this.applyStory(story, front);
    return story;
  }

  private async applyStory(story: WotrStory, front: WotrFrontId) {
    this.currentStory = story;
    await this.actionRegistry.applyStory(story, front);
    this.currentStory = null;
  }
}

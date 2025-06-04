import { Injectable, forwardRef, inject } from "@angular/core";
import { ABgGameService, BgAuthService } from "@leobg/commons";
import { Subject, firstValueFrom, from } from "rxjs";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrPlayerAiService } from "../player/wotr-player-ai.service";
import { WotrPlayerInfo } from "../player/wotr-player-info.models";
import { WotrPlayerInfoStore } from "../player/wotr-player-info.store";
import { WotrPlayerLocalService } from "../player/wotr-player-local.service";
import { WotrPlayerService } from "../player/wotr-player.service";
import { WotrRemoteService } from "../remote/wotr-remote.service";
import { WotrGameUiStore } from "./wotr-game-ui.store";
import { WotrGameStore } from "./wotr-game.store";
import { WotrGameStory, WotrStoryDoc } from "./wotr-story.models";

export interface WotrStoryTask {
  playerId: WotrFrontId;
  task: (playerService: WotrPlayerService) => Promise<WotrGameStory>;
}

@Injectable()
export class WotrStoryService extends ABgGameService<WotrFrontId, WotrPlayerInfo, WotrGameStory, WotrPlayerService> {
  private store = inject(WotrGameStore);
  private ui = inject(WotrGameUiStore);
  private remote = inject(WotrRemoteService);
  private frontStore = inject(WotrFrontStore);
  private playerStore = inject(WotrPlayerInfoStore);
  protected override auth = inject(BgAuthService);
  protected override aiPlayer = inject(forwardRef(() => WotrPlayerAiService));
  protected override localPlayer = inject(WotrPlayerLocalService);
  private actionService = inject(WotrActionService);

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

  private async executeTask2(
    playerId: WotrFrontId,
    task: (playerService: WotrPlayerService) => Promise<WotrGameStory>
  ): Promise<WotrGameStory> {
    await this.replayCall();
    return super.executeTask(playerId, p => task(p));
  }

  private async executeTasks2(tasks: WotrStoryTask[]): Promise<WotrGameStory[]> {
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
    this.nReplayStories = nReplayStories;
    this.$replayCall.next();
  }

  lastReplay() {
    this.replayToLastStory = true;
    this.$replayCall.next();
  }

  protected override resetUi(turnPlayer: WotrFrontId) {
    this.ui.resetUi(turnPlayer);
  }

  async parallelStories(getTask: (front: WotrFrontId) => (playerService: WotrPlayerService) => Promise<WotrGameStory>) {
    const stories = await this.executeTasks2(
      this.frontStore.frontIds().map(front => ({ playerId: front, task: getTask(front) }))
    );
    let index = 0;
    const toReturn: Record<WotrFrontId, WotrGameStory> = {} as any;
    for (const frontId of this.frontStore.frontIds()) {
      const story = stories[index++];
      await this.applyStory(story, frontId);
      toReturn[frontId] = story;
    }
    return toReturn;
  }

  async story(front: WotrFrontId, task: (playerService: WotrPlayerService) => Promise<WotrGameStory>) {
    const story = await this.executeTask2(front, task);
    await this.applyStory(story, front);
    return story;
  }

  private async applyStory(story: WotrGameStory, front: WotrFrontId) {
    await this.actionService.applyStory(story, front);
  }
}

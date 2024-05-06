import { Injectable, inject } from "@angular/core";
import { ABgGameService, BgAuthService } from "@leobg/commons";
import { delay, firstValueFrom, from } from "rxjs";
import { WotrFrontId } from "../wotr-elements/front/wotr-front.models";
import { WotrGameStore } from "../wotr-elements/wotr-game.store";
import { WotrPlayer } from "../wotr-elements/wotr-player.models";
import { WotrRemoteService } from "../wotr-remote.service";
import { WotrStory, WotrStoryDoc } from "../wotr-story.models";
import { WotrPlayerAiService } from "./wotr-player-ai.service";
import { WotrPlayerLocalService } from "./wotr-player-local.service";
import { WotrPlayerService } from "./wotr-player.service";
import { WotrUiStore } from "./wotr-ui.store";

export interface WotrStoryTask {
  playerId: WotrFrontId;
  task: (playerService: WotrPlayerService) => Promise<WotrStory>;
}

@Injectable ()
export class WotrStoryService extends ABgGameService<WotrFrontId, WotrPlayer, WotrStory, WotrPlayerService> {

  private store = inject (WotrGameStore);
  private ui = inject (WotrUiStore);
  private remote = inject (WotrRemoteService);
  protected override auth = inject (BgAuthService);
  protected override aiPlayer = inject (WotrPlayerAiService);
  protected override localPlayer = inject (WotrPlayerLocalService);

  protected storyDocs: WotrStoryDoc[] | null = null;
  setStoryDocs (storyDocs: WotrStoryDoc[]) { this.storyDocs = storyDocs; }

  protected override getGameId () { return this.store.getGameId (); }
  protected override getPlayer (playerId: WotrFrontId) { return this.store.getPlayer (playerId); }
  protected override getGameOwner () { return this.store.getGameOwner (); }
  protected override startTemporaryState () { this.store.startTemporaryState (); }
  protected override endTemporaryState () { this.store.endTemporaryState (); }
  protected override insertStoryDoc$ (storyId: string, story: WotrStoryDoc, gameId: string) { return this.remote.insertStory$ (storyId, story, gameId); }
  protected override selectStoryDoc$ (storyId: string, gameId: string) { return this.remote.selectStory$ (storyId, gameId); }
  protected override getCurrentPlayerId () { return this.ui.getCurrentPlayerId (); }
  protected override setCurrentPlayer (playerId: WotrFrontId) { this.ui.setCurrentPlayer (playerId); }
  protected override currentPlayerChange$ () { return this.ui.currentPlayerChange$ (); }
  protected override cancelChange$ () { return this.ui.cancelChange$ (); }
  
  async executeTask<R extends WotrStory> (playerId: WotrFrontId, task: (playerService: WotrPlayerService) => Promise<R>): Promise<R> {
    return firstValueFrom (super.executeTask$ (playerId, p => from (task (p))).pipe (delay (50)));
  }
  async executeTasks (tasks: WotrStoryTask[]): Promise<WotrStory[]> {
    return firstValueFrom (super.executeTasks$ (tasks.map (t => ({
      playerId: t.playerId,
      task$: p => from (t.task (p))
    }))).pipe (delay (50)));
  }

  protected override resetUi (turnPlayer: WotrFrontId) {
    this.ui.updateUi ("Reset UI", (s) => ({
      ...s,
      turnPlayer: turnPlayer,
      ...this.ui.resetUi (),
      canCancel: false,
      message: `${this.store.getPlayer (turnPlayer).name} is thinking...`,
    }));
  }

}

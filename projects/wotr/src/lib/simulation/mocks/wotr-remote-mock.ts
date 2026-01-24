import { Injectable, inject } from "@angular/core";
import { BgCloudCollectionQuery } from "@leobg/commons";
import { Observable, of } from "rxjs";
import { WotrStoryDoc } from "../../game/wotr-story-models";
import { WotrGameDoc, WotrPlayerDoc } from "../../remote/wotr-remote-models";
import { WotrSimulations } from "../wotr-simulations";
import { WotrStoriesBuilder } from "../wotr-story-builder";

@Injectable()
export class WotrRemoteMock {
  private examples = inject(WotrSimulations);

  async getGame(gameId: string): Promise<WotrGameDoc> {
    return { id: "123", name: "test", state: "closed", online: false, owner: {} as any };
  }
  selectGames$(queryFn?: BgCloudCollectionQuery<WotrGameDoc> | undefined): any {
    throw new Error("Mock remote");
  }
  insertGame$(game: WotrGameDoc): Observable<WotrGameDoc> {
    throw new Error("Mock remote");
  }
  updateGame$(patch: Partial<WotrGameDoc>, gameId: string): any {
    throw new Error("Mock remote");
  }
  deleteGame$(gameId: string): any {
    throw new Error("Mock remote");
  }

  async getPlayers(
    gameId: string,
    queryFn?: BgCloudCollectionQuery<WotrPlayerDoc> | undefined
  ): Promise<WotrPlayerDoc[]> {
    return [
      { id: "free-peoples", name: "FP", controller: { id: "me" } },
      { id: "shadow", name: "S", controller: { id: "me" } }
    ] as any;
  }
  selectPlayers$(gameId: string, queryFn?: BgCloudCollectionQuery<WotrPlayerDoc> | undefined): any {
    throw new Error("Mock remote");
  }
  selectPlayer$(playerId: string, gameId: string): any {
    throw new Error("Mock remote");
  }
  insertPlayer$(player: WotrPlayerDoc, gameId: string): any {
    throw new Error("Mock remote");
  }
  updatePlayer$(patch: Partial<WotrPlayerDoc>, playerId: string, gameId: string): any {
    throw new Error("Mock remote");
  }
  deletePlayer$(playerId: string, gameId: string): any {
    throw new Error("Mock remote");
  }
  deletePlayers$(gameId: string): any {
    throw new Error("Mock remote");
  }

  async getStories(
    gameId: string,
    queryFn?: BgCloudCollectionQuery<WotrStoryDoc> | undefined
  ): Promise<WotrStoryDoc[]> {
    return (await this.examples.getSimulation(gameId).loadDefinition()).stories(
      new WotrStoriesBuilder()
    );
  }
  getStory$(storyId: number, gameId: string): any {
    throw new Error("Mock remote");
  }
  selectStories$(gameId: string, queryFn?: BgCloudCollectionQuery<WotrStoryDoc> | undefined): any {
    throw new Error("Mock remote");
  }
  selectStory$(storyId: string, gameId: string): any {
    throw new Error("Mock remote");
  }
  insertStory$(storyId: string, story: WotrStoryDoc, gameId: string): any {
    // throw new Error("Mock remote");
    return of(null);
  }
  deleteStory$(storyId: string, gameId: string): any {
    throw new Error("Mock remote");
  }
  deleteStories$(gameId: string): any {
    throw new Error("Mock remote");
  }
}

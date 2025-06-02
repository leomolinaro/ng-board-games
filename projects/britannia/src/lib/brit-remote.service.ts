import { Injectable, inject } from "@angular/core";
import { BgCloudCollectionQuery, BgCloudService, BgStoryDoc, BgUser } from "@leobg/commons";
import { Observable } from "rxjs";
import { BritColor } from "./brit-components.models";
import { BritStory } from "./brit-story.models";

export interface BritGameDoc {
  id: string;
  name: string;
  owner: BgUser;
  online: boolean;
  state: "open" | "closed";
} // BritGameDoc

export interface ABritPlayerDoc {
  id: BritColor;
  name: string;
  sort: number;
} // ABritPlayerDoc

export interface BritAiPlayerDoc extends ABritPlayerDoc {
  isAi: true;
} // BritAiPlayerDoc

export interface BritReadPlayerDoc extends ABritPlayerDoc {
  isAi: false;
  controller: BgUser;
} // BritReadPlayerDoc

export type BritPlayerDoc = BritAiPlayerDoc | BritReadPlayerDoc;

export type BritStoryDoc = BgStoryDoc<BritColor, BritStory>;

@Injectable({
  providedIn: "root"
})
export class BritRemoteService {
  private cloud = inject(BgCloudService);

  private games() {
    return this.cloud.collection<BritGameDoc>("brit-games");
  }
  getGame$(gameId: string) {
    return this.cloud.get$(gameId, this.games());
  }
  selectGames$(queryFn?: BgCloudCollectionQuery<BritGameDoc> | undefined) {
    return this.cloud.selectAll$(this.games(), queryFn);
  }
  insertGame$(game: BritGameDoc) {
    return this.cloud.set$(game.id, game, this.games());
  }
  updateGame$(patch: Partial<BritGameDoc>, gameId: string) {
    return this.cloud.update$(gameId, patch, this.games());
  }
  deleteGame$(gameId: string) {
    return this.cloud.delete$(gameId, this.games());
  }

  private players(gameId: string) {
    return this.cloud.collection<BritPlayerDoc>(`brit-games/${gameId}/players`);
  }
  getPlayers$(gameId: string, queryFn?: BgCloudCollectionQuery<BritPlayerDoc> | undefined) {
    return this.cloud.getAll$(this.players(gameId), queryFn);
  }
  selectPlayers$(gameId: string, queryFn?: BgCloudCollectionQuery<BritPlayerDoc> | undefined) {
    return this.cloud.selectAll$(this.players(gameId), queryFn);
  }
  selectPlayer$(playerId: string, gameId: string) {
    return this.cloud.select$(playerId, this.players(gameId));
  }
  insertPlayer$(player: BritPlayerDoc, gameId: string): Observable<BritPlayerDoc> {
    return this.cloud.set$(player.id, player, this.players(gameId));
  }
  updatePlayer$(patch: Partial<BritPlayerDoc>, playerId: string, gameId: string) {
    return this.cloud.update$(playerId, patch, this.players(gameId));
  }
  deletePlayer$(playerId: string, gameId: string) {
    return this.cloud.delete$(playerId, this.players(gameId));
  }
  deletePlayers$(gameId: string) {
    return this.cloud.deleteAll$(this.players(gameId));
  }

  private stories(gameId: string) {
    return this.cloud.collection<BritStoryDoc>(`brit-games/${gameId}/stories`);
  }
  getStories$(gameId: string, queryFn?: BgCloudCollectionQuery<BritStoryDoc> | undefined) {
    return this.cloud.getAll$(this.stories(gameId), queryFn);
  }
  getStory$(storyId: number, gameId: string) {
    return this.cloud.get$(storyId + "", this.stories(gameId));
  }
  selectStories$(gameId: string, queryFn?: BgCloudCollectionQuery<BritStoryDoc> | undefined) {
    return this.cloud.selectAll$(this.stories(gameId), queryFn);
  }
  selectStory$(storyId: string, gameId: string) {
    return this.cloud.select$(storyId, this.stories(gameId));
  }
  insertStory$(storyId: string, story: BritStoryDoc, gameId: string) {
    return this.cloud.set$(storyId, story, this.stories(gameId));
  }
  updateStory$(patch: Partial<BritStoryDoc>, storyId: string, gameId: string) {
    return this.cloud.update$(storyId, patch, this.stories(gameId));
  }
  deleteStory$(storyId: string, gameId: string) {
    return this.cloud.delete$(storyId, this.stories(gameId));
  }
  deleteStories$(gameId: string) {
    return this.cloud.deleteAll$(this.stories(gameId));
  }
} // BritRemoteService

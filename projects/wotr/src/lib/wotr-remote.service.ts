import { Injectable } from "@angular/core";
import { BgCloudCollectionQuery, BgCloudService, BgUser } from "@leobg/commons";
import { Observable } from "rxjs";
import { WotrFront } from "./wotr-components.models";
import { WotrStory } from "./wotr-story.models";

export interface WotrGameDoc {
  id: string;
  name: string;
  owner: BgUser;
  online: boolean;
  state: "open" | "closed";
} // WotrGameDoc

export interface AWotrPlayerDoc {
  id: string;
  name: string;
  sort: number;
  front: WotrFront;
} // ABritPlayerDoc

export interface WotrAiPlayerDoc extends AWotrPlayerDoc {
  isAi: true;
} // BritAiPlayerDoc

export interface WotrReadPlayerDoc extends AWotrPlayerDoc {
  isAi: false;
  controller: BgUser;
} // BritReadPlayerDoc

export type WotrPlayerDoc = WotrAiPlayerDoc | WotrReadPlayerDoc;

export type WotrStoryDoc = WotrStory & { id: number };

@Injectable ({
  providedIn: "root"
})
export class WotrRemoteService {

  constructor (private cloud: BgCloudService) {}

  private games () { return this.cloud.collection<WotrGameDoc> ("wotr-games"); }
  getGame$ (gameId: string) { return this.cloud.get$ (gameId, this.games ()); }
  selectGames$ (queryFn?: BgCloudCollectionQuery<WotrGameDoc> | undefined) { return this.cloud.selectAll$ (this.games (), queryFn); }
  insertGame$ (game: WotrGameDoc): Observable<WotrGameDoc> { return this.cloud.set$<WotrGameDoc> (game, game.id, this.games ()); }
  updateGame$ (patch: Partial<WotrGameDoc>, gameId: string) { return this.cloud.update$ (patch, gameId, this.games ()); }
  deleteGame$ (gameId: string) { return this.cloud.delete$ (gameId, this.games ()); }

  private players (gameId: string) { return this.cloud.collection<WotrPlayerDoc> (`wotr-games/${gameId}/players`); }
  getPlayers$ (gameId: string, queryFn?: BgCloudCollectionQuery<WotrPlayerDoc> | undefined) { return this.cloud.getAll$ (this.players (gameId), queryFn); }
  selectPlayers$ (gameId: string, queryFn?: BgCloudCollectionQuery<WotrPlayerDoc> | undefined) { return this.cloud.selectAll$ (this.players (gameId), queryFn); }
  selectPlayer$ (playerId: string, gameId: string) { return this.cloud.select$ (playerId, this.players (gameId)); }
  insertPlayer$ (player: Omit<WotrPlayerDoc, "id">, gameId: string): Observable<WotrPlayerDoc> { return this.cloud.insert$ ((id) => ({ id: id, ...player } as WotrPlayerDoc), this.players (gameId)); }
  updatePlayer$ (patch: Partial<WotrPlayerDoc>, playerId: string, gameId: string) { return this.cloud.update$ (patch, playerId, this.players (gameId)); }
  deletePlayer$ (playerId: string, gameId: string) { return this.cloud.delete$ (playerId, this.players (gameId)); }
  deletePlayers$ (gameId: string) { return this.cloud.deleteAll$ (this.players (gameId)); }

  private stories (gameId: string) { return this.cloud.collection</* WotrStoryDoc */any> (`wotr-games/${gameId}/stories`); }
  getStories$ (gameId: string, queryFn?: BgCloudCollectionQuery<WotrStoryDoc> | undefined) { return this.cloud.getAll$ (this.stories (gameId), queryFn); }
  getStory$ (storyId: number, gameId: string) { return this.cloud.get$ (storyId + "", this.stories (gameId)); }
  selectStories$ (gameId: string, queryFn?: BgCloudCollectionQuery<WotrStoryDoc> | undefined) { return this.cloud.selectAll$ (this.stories (gameId), queryFn); }
  selectStory$ (storyId: number, gameId: string) { return this.cloud.select$ (storyId + "", this.stories (gameId)); }
  insertStory$ (story: WotrStoryDoc, gameId: string): Observable<WotrStoryDoc> { return this.cloud.set$ (story, story.id + "", this.stories (gameId)); }
  updateStory$ (patch: Partial<WotrStoryDoc>, storyId: string, gameId: string) { return this.cloud.update$ (patch, storyId, this.stories (gameId)); }
  deleteStory$ (storyId: string, gameId: string) { return this.cloud.delete$ (storyId, this.stories (gameId)); }
  deleteStories$ (gameId: string) { return this.cloud.deleteAll$ (this.stories (gameId)); }

} // BritRemoteService

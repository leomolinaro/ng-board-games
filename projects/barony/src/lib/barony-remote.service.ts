import { Injectable, inject } from "@angular/core";
import { BgCloudCollectionQuery, BgCloudService, BgStoryDoc, BgUser } from "@leobg/commons";
import { Observable } from "rxjs";
import { BaronyColor, BaronyLandType, BaronyStory } from "./barony-models";

export interface BaronyGameDoc {
  id: string;
  name: string;
  owner: BgUser;
  online: boolean;
  state: "open" | "closed";
}

export interface ABaronyPlayerDoc {
  id: BaronyColor;
  name: string;
  sort: number;
}

export interface BaronyAiPlayerDoc extends ABaronyPlayerDoc {
  isAi: true;
}

export interface BaronyReadPlayerDoc extends ABaronyPlayerDoc {
  isAi: false;
  controller: BgUser;
}

export type BaronyPlayerDoc = BaronyAiPlayerDoc | BaronyReadPlayerDoc;

export interface BaronyMapDoc {
  lands: {
    x: number;
    y: number;
    type: BaronyLandType;
  }[];
}

export type BaronyStoryDoc = BgStoryDoc<BaronyColor, BaronyStory>;

@Injectable ({
  providedIn: "root",
})
export class BaronyRemoteService {
  
  private cloud = inject (BgCloudService);

  private games () { return this.cloud.collection<BaronyGameDoc> ("barony-games"); }
  getGame$ (gameId: string) { return this.cloud.get$ (gameId, this.games ()); }
  selectGames$ () { return this.cloud.selectAll$ (this.games ()); }
  insertGame$ (game: BaronyGameDoc): Observable<BaronyGameDoc> { return this.cloud.set$<BaronyGameDoc> (game.id, game, this.games ()); }
  updateGame$ (patch: Partial<BaronyGameDoc>, gameId: string) { return this.cloud.update$ (gameId, patch, this.games ()); }
  deleteGame$ (gameId: string) { return this.cloud.delete$ (gameId, this.games ()); }

  private players (gameId: string) { return this.cloud.collection<BaronyPlayerDoc> (`barony-games/${gameId}/players`); }
  getPlayers$ (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyPlayerDoc> | undefined) { return this.cloud.getAll$ (this.players (gameId), queryFn); }
  selectPlayers$ (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyPlayerDoc> | undefined) { return this.cloud.selectAll$ (this.players (gameId), queryFn); }
  selectPlayer$ (playerId: string, gameId: string) { return this.cloud.select$ (playerId, this.players (gameId)); }
  insertPlayer$ (player: BaronyPlayerDoc, gameId: string): Observable<BaronyPlayerDoc> { return this.cloud.set$ (player.id, player, this.players (gameId)); }
  updatePlayer$ (patch: Partial<BaronyPlayerDoc>, playerId: string, gameId: string) { return this.cloud.update$ (playerId, patch, this.players (gameId)); }
  deletePlayer$ (playerId: string, gameId: string) { return this.cloud.delete$ (playerId, this.players (gameId)); }
  deletePlayers$ (gameId: string) { return this.cloud.deleteAll$ (this.players (gameId)); }

  private maps (gameId: string) { return this.cloud.collection<BaronyMapDoc> (`barony-games/${gameId}/maps`); }
  getMap$ (gameId: string) { return this.cloud.get$ ("map", this.maps (gameId)); }
  insertMap$ (map: BaronyMapDoc, gameId: string): Observable<BaronyMapDoc> { return this.cloud.set$ ("map", map, this.maps (gameId)); }
  deleteMap$ (gameId: string) { return this.cloud.delete$ ("map", this.maps (gameId)); }

  private stories (gameId: string) { return this.cloud.collection<BaronyStoryDoc> (`barony-games/${gameId}/stories`); }
  getStories$ (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyStoryDoc> | undefined) { return this.cloud.getAll$ (this.stories (gameId), queryFn); }
  getStory$ (storyId: string, gameId: string) { return this.cloud.get$ (storyId, this.stories (gameId)); }
  selectStories$ (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyStoryDoc> | undefined) { return this.cloud.selectAll$ (this.stories (gameId), queryFn); }
  selectStory$ (storyId: string, gameId: string) { return this.cloud.select$ (storyId, this.stories (gameId)); }
  insertStory$ (storyId: string, story: BaronyStoryDoc, gameId: string) { return this.cloud.set$ (storyId, story, this.stories (gameId)); }
  deleteStory$ (storyId: string, gameId: string) { return this.cloud.delete$ (storyId, this.stories (gameId)); }
  deleteStories$ (gameId: string) { return this.cloud.deleteAll$ (this.stories (gameId)); }
  
}

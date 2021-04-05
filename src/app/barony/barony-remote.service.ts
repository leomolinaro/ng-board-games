import { Injectable } from "@angular/core";
import { BgUser } from "@bg-services";
import { Observable } from "rxjs";
import { BgCloudCollectionQuery, BgCloudService } from "../bg-services/bg-cloud.service";
import { BaronyColor, BaronyLandType } from "./models";
import { BaronyStory } from "./process";

export interface BaronyGameDoc {
  id: string;
  name: string;
  owner: BgUser;
  online: boolean;
  state: "open" | "closed";
} // BaronyGameDoc

export interface ABaronyPlayerDoc {
  id: string;
  name: string;
  sort: number;
  color: BaronyColor;
} // ABaronyPlayerDoc

export interface BaronyAiPlayerDoc extends ABaronyPlayerDoc {
  isAi: true;
} // BaronyAiPlayerDoc

export interface BaronyReadPlayerDoc extends ABaronyPlayerDoc {
  isAi: false;
  controller: BgUser;
} // BaronyReadPlayerDoc

export type BaronyPlayerDoc = BaronyAiPlayerDoc | BaronyReadPlayerDoc;

export interface BaronyMapDoc {
  lands: {
    x: number;
    y: number;
    type: BaronyLandType;
  }[];
} // BaronyLandDoc

export type BaronyStoryDoc = BaronyStory & { id: number };

@Injectable ({
  providedIn: "root"
})
export class BaronyRemoteService {

  constructor (
    private cloud: BgCloudService
  ) { }

  private games (queryFn?: BgCloudCollectionQuery<BaronyGameDoc> | undefined) { return this.cloud.collection<BaronyGameDoc> ("barony-games"); }
  getGame$ (gameId: string) { return this.cloud.get$ (gameId, this.games ()); }
  selectGames$ (queryFn?: BgCloudCollectionQuery<BaronyGameDoc> | undefined) { return this.cloud.selectAll$ (this.games (queryFn)); }
  insertGame$ (game: BaronyGameDoc): Observable<BaronyGameDoc> { return this.cloud.insert$<BaronyGameDoc> (game, game.id, this.games ()); }
  updateGame$ (patch: Partial<BaronyGameDoc>, gameId: string) { return this.cloud.update$ (patch, gameId, this.games ()); }
  deleteGame$ (gameId: string) { return this.cloud.delete$ (gameId, this.games ()); }
  
  private players (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyPlayerDoc> | undefined) { return this.cloud.collection<BaronyPlayerDoc> (`barony-games/${gameId}/players`, queryFn); }
  getPlayers$ (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyPlayerDoc> | undefined) { return this.cloud.getAll$ (this.players (gameId, queryFn)); }
  selectPlayers$ (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyPlayerDoc> | undefined) { return this.cloud.selectAll$ (this.players (gameId, queryFn)); }
  selectPlayer$ (playerId: string, gameId: string) { return this.cloud.select$ (playerId, this.players (gameId)); }
  insertPlayer$ (player: Omit<BaronyPlayerDoc, "id">, gameId: string): Observable<BaronyPlayerDoc> { return this.cloud.insert$ (id => ({ id: id, ...player } as BaronyPlayerDoc), this.players (gameId)); } 
  updatePlayer$ (patch: Partial<BaronyPlayerDoc>, playerId: string, gameId: string) { return this.cloud.update$ (patch, playerId, this.players (gameId)); }
  deletePlayer$ (playerId: string, gameId: string) { return this.cloud.delete$ (playerId, this.players (gameId)); }
  deletePlayers$ (gameId: string) { return this.cloud.deleteAll$ (this.players (gameId)); }
  
  // private lands (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyLandDoc> | undefined) { return this.cloud.collection<BaronyLandDoc> (`barony-games/${gameId}/lands`, queryFn); }
  // getLands$ (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyLandDoc> | undefined) { return this.cloud.getAll$ (this.lands (gameId, queryFn)); }
  // selectLands$ (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyLandDoc> | undefined) { return this.cloud.selectAll$ (this.lands (gameId, queryFn)); }
  // selectLand$ (landId: string, gameId: string) { return this.cloud.select$ (landId, this.lands (gameId)); }
  // insertLand$ (land: BaronyLandDoc, gameId: string): Observable<BaronyLandDoc> { return this.cloud.insert$ (land, land.id, this.lands (gameId)); }
  // updateLand$ (patch: Partial<BaronyLandDoc>, landId: string, gameId: string) { return this.cloud.update$ (patch, landId, this.lands (gameId)); }
  // deleteLand$ (landId: string, gameId: string) { return this.cloud.delete$ (landId, this.lands (gameId)); }
  // deleteLands$ (gameId: string) { return this.cloud.deleteAll$ (this.lands (gameId)); }
  
  private maps (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyMapDoc> | undefined) { return this.cloud.collection<BaronyMapDoc> (`barony-games/${gameId}/maps`, queryFn); }
  getMap$ (gameId: string) { return this.cloud.get$ ("map", this.maps (gameId)); }
  insertMap$ (map: BaronyMapDoc, gameId: string): Observable<BaronyMapDoc> { return this.cloud.insert$ (map, "map", this.maps (gameId)); }
  deleteMap$ (gameId: string) { return this.cloud.delete$ ("map", this.maps (gameId)); }
  
  private stories (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyStoryDoc> | undefined) { return this.cloud.collection<BaronyStoryDoc> (`barony-games/${gameId}/stories`, queryFn); }
  getStories$ (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyStoryDoc> | undefined) { return this.cloud.getAll$ (this.stories (gameId, queryFn)); }
  getStory$ (storyId: number, gameId: string) { return this.cloud.get$ (storyId + "", this.stories (gameId)); }
  selectStories$ (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyStoryDoc> | undefined) { return this.cloud.selectAll$ (this.stories (gameId, queryFn)); }
  selectStory$ (storyId: number, gameId: string) { return this.cloud.select$ (storyId + "", this.stories (gameId)); }
  insertStory$ (story: BaronyStoryDoc, gameId: string): Observable<BaronyStoryDoc> { return this.cloud.insert$ (story, story.id + "", this.stories (gameId)); } 
  updateStory$ (patch: Partial<BaronyStoryDoc>, storyId: string, gameId: string) { return this.cloud.update$ (patch, storyId, this.stories (gameId)); }
  deleteStory$ (storyId: string, gameId: string) { return this.cloud.delete$ (storyId, this.stories (gameId)); }
  deleteStories$ (gameId: string) { return this.cloud.deleteAll$ (this.stories (gameId)); }

} // BaronyRemoteService

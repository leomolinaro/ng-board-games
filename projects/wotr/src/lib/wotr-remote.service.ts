import { Injectable } from "@angular/core";
import { BgCloudCollectionQuery, BgCloudService, BgStoryDoc, BgUser } from "@leobg/commons";
import { WotrFrontId } from "./wotr-components/wotr-front.models";
import { WotrStory } from "./wotr-story.models";

export interface WotrGameDoc {
  id: string;
  name: string;
  owner: BgUser;
  online: boolean;
  state: "open" | "closed";
} // WotrGameDoc

export interface AWotrPlayerDoc {
  id: WotrFrontId;
  name: string;
  sort: number;
} // ABritPlayerDoc

export interface WotrAiPlayerDoc extends AWotrPlayerDoc {
  isAi: true;
} // BritAiPlayerDoc

export interface WotrReadPlayerDoc extends AWotrPlayerDoc {
  isAi: false;
  controller: BgUser;
} // BritReadPlayerDoc

export type WotrPlayerDoc = WotrAiPlayerDoc | WotrReadPlayerDoc;

export type WotrStoryDoc = BgStoryDoc<WotrFrontId, WotrStory>;

@Injectable ({
  providedIn: "root"
})
export class WotrRemoteService {

  constructor (private cloud: BgCloudService) {}

  private games () { return this.cloud.collection<WotrGameDoc> ("wotr-games"); }
  getGame$ (gameId: string) { return this.cloud.get$ (gameId, this.games ()); }
  selectGames$ (queryFn?: BgCloudCollectionQuery<WotrGameDoc> | undefined) { return this.cloud.selectAll$ (this.games (), queryFn); }
  insertGame$ (game: WotrGameDoc) { return this.cloud.set$ (game.id, game, this.games ()); }
  updateGame$ (patch: Partial<WotrGameDoc>, gameId: string) { return this.cloud.update$ (gameId, patch, this.games ()); }
  deleteGame$ (gameId: string) { return this.cloud.delete$ (gameId, this.games ()); }

  private players (gameId: string) { return this.cloud.collection<WotrPlayerDoc> (`wotr-games/${gameId}/players`); }
  getPlayers$ (gameId: string, queryFn?: BgCloudCollectionQuery<WotrPlayerDoc> | undefined) { return this.cloud.getAll$ (this.players (gameId), queryFn); }
  selectPlayers$ (gameId: string, queryFn?: BgCloudCollectionQuery<WotrPlayerDoc> | undefined) { return this.cloud.selectAll$ (this.players (gameId), queryFn); }
  selectPlayer$ (playerId: string, gameId: string) { return this.cloud.select$ (playerId, this.players (gameId)); }
  insertPlayer$ (player: WotrPlayerDoc, gameId: string) { return this.cloud.set$ (player.id, player, this.players (gameId)); }
  updatePlayer$ (patch: Partial<WotrPlayerDoc>, playerId: string, gameId: string) { return this.cloud.update$ (playerId, patch, this.players (gameId)); }
  deletePlayer$ (playerId: string, gameId: string) { return this.cloud.delete$ (playerId, this.players (gameId)); }
  deletePlayers$ (gameId: string) { return this.cloud.deleteAll$ (this.players (gameId)); }

  private stories (gameId: string) { return this.cloud.collection<WotrStoryDoc> (`wotr-games/${gameId}/stories`); }
  getStories$ (gameId: string, queryFn?: BgCloudCollectionQuery<WotrStoryDoc> | undefined) { return this.cloud.getAll$ (this.stories (gameId), queryFn); }
  getStory$ (storyId: number, gameId: string) { return this.cloud.get$ (storyId + "", this.stories (gameId)); }
  selectStories$ (gameId: string, queryFn?: BgCloudCollectionQuery<WotrStoryDoc> | undefined) { return this.cloud.selectAll$ (this.stories (gameId), queryFn); }
  selectStory$ (storyId: string, gameId: string) { return this.cloud.select$ (storyId + "", this.stories (gameId)); }
  insertStory$ (storyId: string, story: WotrStoryDoc, gameId: string) { return this.cloud.set$ (storyId, story, this.stories (gameId)); }
  deleteStory$ (storyId: string, gameId: string) { return this.cloud.delete$ (storyId, this.stories (gameId)); }
  deleteStories$ (gameId: string) { return this.cloud.deleteAll$ (this.stories (gameId)); }

} // BritRemoteService

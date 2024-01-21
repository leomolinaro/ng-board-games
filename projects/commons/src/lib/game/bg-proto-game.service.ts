import { Injectable } from "@angular/core";
import { BgUser } from "../authentication/bg-auth.service";
import { BgCloudCollectionQuery, BgCloudService } from "../cloud/bg-cloud.service";

export type BgBoardGame = "barony" | "britannia" | "wotr";

export interface BgArcheoGame {
  name: string;
  online: boolean;
} // BgArcheoGame

export interface BgProtoGame {
  id: string;
  name: string;
  boardGame: BgBoardGame;
  owner: BgUser;
  online: boolean;
  state: BgProtoGameState;
} // BgProtoGame

export interface BgProtoPlayer<Pid extends string = string> {
  id: Pid;
  controller: BgUser | null;
  type: BgProtoPlayerType;
  name: string;
  ready: boolean;
} // BgProtoPlayer

export type BgProtoGameState = "open" | "running" | "ended";
export type BgProtoPlayerType = "user" | "open" | "closed" | "ai";

@Injectable ({
  providedIn: "root",
})
export class BgProtoGameService {
  constructor (private cloud: BgCloudService) {}

  private protoGames () {
    return this.cloud.collection<BgProtoGame> ("proto-games");
  }
  getProtoGame$ (gameId: string) { this.cloud.get$ (gameId, this.protoGames ()); }
  selectProtoGames$ (queryFn?: BgCloudCollectionQuery<BgProtoGame> | undefined) { return this.cloud.selectAll$ (this.protoGames (), queryFn); }
  selectProtoGame$ (gameId: string) { return this.cloud.select$ (gameId, this.protoGames ()); }
  insertProtoGame$ (protoGame: Omit<BgProtoGame, "id">) { return this.cloud.insert$<BgProtoGame> (id => ({ id: id, ...protoGame }), this.protoGames ()); }
  updateProtoGame$ (patch: Partial<BgProtoGame>, gameId: string) { return this.cloud.update$ (gameId, patch, this.protoGames ()); }
  deleteProtoGame$ (gameId: string) { return this.cloud.delete$ (gameId, this.protoGames ()); }

  private protoPlayers<Pid extends string> (gameId: string) { return this.cloud.collection<BgProtoPlayer<Pid>> (`proto-games/${gameId}/proto-players`); }
  getProtoPlayers$ (gameId: string, queryFn?: BgCloudCollectionQuery<BgProtoPlayer> | undefined) { return this.cloud.getAll$ (this.protoPlayers (gameId), queryFn); }
  selectProtoPlayers$<Pid extends string> (gameId: string, queryFn?: BgCloudCollectionQuery<BgProtoPlayer<Pid>> | undefined) { return this.cloud.selectAll$ (this.protoPlayers<Pid> (gameId), queryFn); }
  selectProtoPlayer$ (playerId: string, gameId: string) { return this.cloud.select$ (playerId, this.protoPlayers (gameId)); }
  insertProtoPlayer$<Pid extends string> (protoPlayer: BgProtoPlayer<Pid>, gameId: string) { return this.cloud.set$ (protoPlayer.id, protoPlayer, this.protoPlayers (gameId)); }
  updateProtoPlayer$ (patch: Partial<BgProtoPlayer>, playerId: string, gameId: string) { return this.cloud.update$ (playerId, patch, this.protoPlayers (gameId)); }
  deleteProtoPlayer$ (playerId: string, gameId: string) { return this.cloud.delete$ (playerId, this.protoPlayers (gameId)); }
  deleteProtoPlayers$ (gameId: string) { return this.cloud.deleteAll$ (this.protoPlayers (gameId)); }

}

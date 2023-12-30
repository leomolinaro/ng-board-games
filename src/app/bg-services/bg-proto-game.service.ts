import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BgUser } from "./bg-auth.service";
import { BgCloudCollectionQuery, BgCloudService } from "./bg-cloud.service";

export type BgBoardGame = "barony" | "britannia";

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

export interface BgProtoPlayer<R extends string = string> {
  id: string;
  controller: BgUser | null;
  type: BgProtoPlayerType;
  name: string;
  ready: boolean;
  role: R;
} // BgProtoPlayer

export type BgProtoGameState = "open" | "running" | "ended";
export type BgProtoPlayerType = "user" | "open" | "closed" | "ai";

@Injectable ({
  providedIn: "root"
})
export class BgProtoGameService {

  constructor (
    private cloud: BgCloudService
  ) { }

  private protoGames () { return this.cloud.collection<BgProtoGame> (`proto-games`); }
  getProtoGame$ (gameId: string) { this.cloud.get$ (gameId, this.protoGames ()); }
  selectProtoGames$ (queryFn?: BgCloudCollectionQuery<BgProtoGame> | undefined) { return this.cloud.selectAll$ (this.protoGames (), queryFn); }
  selectProtoGame$ (gameId: string) { return this.cloud.select$ (gameId, this.protoGames ()); }
  insertProtoGame$ (protoGame: Omit<BgProtoGame, "id">): Observable<BgProtoGame> { return this.cloud.insert$<BgProtoGame> (id => ({ id: id, ...protoGame }), this.protoGames ()); }
  updateProtoGame$ (patch: Partial<BgProtoGame>, gameId: string) { return this.cloud.update$ (patch, gameId, this.protoGames ()); }
  deleteProtoGame$ (gameId: string) { return this.cloud.delete$ (gameId, this.protoGames ()); }
  
  private protoPlayers (gameId: string) { return this.cloud.collection<BgProtoPlayer> (`proto-games/${gameId}/proto-players`); }
  getProtoPlayers$ (gameId: string, queryFn?: BgCloudCollectionQuery<BgProtoPlayer> | undefined) { return this.cloud.getAll$ (this.protoPlayers (gameId), queryFn); }
  selectProtoPlayers$ (gameId: string, queryFn?: BgCloudCollectionQuery<BgProtoPlayer> | undefined) { return this.cloud.selectAll$ (this.protoPlayers (gameId), queryFn); }
  selectProtoPlayer$ (playerId: string, gameId: string) { return this.cloud.select$ (playerId, this.protoPlayers (gameId)); }
  insertProtoPlayer$ (protoPlayer: BgProtoPlayer, gameId: string): Observable<BgProtoPlayer> { return this.cloud.insert$ (protoPlayer, protoPlayer.id, this.protoPlayers (gameId)); } 
  updateProtoPlayer$ (patch: Partial<BgProtoPlayer>, playerId: string, gameId: string) { return this.cloud.update$ (patch, playerId, this.protoPlayers (gameId)); }
  deleteProtoPlayer$ (playerId: string, gameId: string) { return this.cloud.delete$ (playerId, this.protoPlayers (gameId)); }
  deleteProtoPlayers$ (gameId: string) { return this.cloud.deleteAll$ (this.protoPlayers (gameId)); }

} // BgProtoGameService

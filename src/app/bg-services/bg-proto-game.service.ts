import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BgUser } from "./bg-auth.service";
import { BgCloudCollectionQuery, BgCloudService } from "./bg-cloud.service";

export type BgBoardGame = "barony" | "britannia";

export type ABgArcheoGame = Omit<ABgProtoGame, "id" | "owner" | "state" | "boardGame">;

export interface ABgProtoGame {
  id: string;
  name: string;
  boardGame: BgBoardGame;
  owner: BgUser;
  online: boolean;
  state: ABgProtoGameState;
} // ABgProtoGame

export interface ABgProtoPlayer {
  id: string;
  controller: BgUser | null;
  type: ABgProtoPlayerType;
} // ABgProtoPlayer

export type ABgProtoGameState = "open" | "closed";
export type ABgProtoPlayerType = "me" | "other" | "open" | "closed" | "ai";

@Injectable ({
  providedIn: "root"
})
export class BgProtoGameService {

  constructor (
    private cloud: BgCloudService
  ) { }

  private protoGames (queryFn?: BgCloudCollectionQuery<ABgProtoGame> | undefined) { return this.cloud.collection<ABgProtoGame> (`proto-games`, queryFn); }
  getProtoGame$ (gameId: string) { this.cloud.get$ (gameId, this.protoGames ()); }
  selectProtoGames$ (queryFn?: BgCloudCollectionQuery<ABgProtoGame> | undefined) { return this.cloud.selectAll$ (this.protoGames (queryFn)); }
  insertProtoGame$ (protoGame: Omit<ABgProtoGame, "id">): Observable<ABgProtoGame> { return this.cloud.insert$<ABgProtoGame> (id => ({ id: id, ...protoGame }), this.protoGames ()); }
  updateProtoGame$ (patch: Partial<ABgProtoGame>, gameId: string) { return this.cloud.update$ (patch, gameId, this.protoGames ()); }
  deleteProtoGame$ (gameId: string) { return this.cloud.delete$ (gameId, this.protoGames ()); }
  
  private protoPlayers (gameId: string, queryFn?: BgCloudCollectionQuery<ABgProtoPlayer> | undefined) { return this.cloud.collection<ABgProtoPlayer> (`proto-games/${gameId}/proto-players`, queryFn); }
  getProtoPlayers$ (gameId: string, queryFn?: BgCloudCollectionQuery<ABgProtoPlayer> | undefined) { return this.cloud.getAll$ (this.protoPlayers (gameId, queryFn)); }
  selectProtoPlayers$ (gameId: string, queryFn?: BgCloudCollectionQuery<ABgProtoPlayer> | undefined) { return this.cloud.selectAll$ (this.protoPlayers (gameId, queryFn)); }
  selectProtoPlayer$ (playerId: string, gameId: string) { return this.cloud.select$ (playerId, this.protoPlayers (gameId)); }
  insertProtoPlayer$ (protoPlayer: ABgProtoPlayer, gameId: string): Observable<ABgProtoPlayer> { return this.cloud.insert$ (protoPlayer, protoPlayer.id, this.protoPlayers (gameId)); } 
  updateProtoPlayer$ (patch: Partial<ABgProtoPlayer>, playerId: string, gameId: string) { return this.cloud.update$ (patch, playerId, this.protoPlayers (gameId)); }
  deleteProtoPlayer$ (playerId: string, gameId: string) { return this.cloud.delete$ (playerId, this.protoPlayers (gameId)); }
  deleteProtoPlayers$ (gameId: string) { return this.cloud.deleteAll$ (this.protoPlayers (gameId)); }

} // BgProtoGameService

import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
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

  private getProtoGames (queryFn?: BgCloudCollectionQuery<ABgProtoGame> | undefined) { return this.cloud.collection<ABgProtoGame> (`proto-games`, queryFn); }
  private getProtoPlayers<P extends ABgProtoPlayer = ABgProtoPlayer> (gameId: string, queryFn?: BgCloudCollectionQuery<ABgProtoPlayer> | undefined) {
    return this.cloud.collection<P> (`proto-games/${gameId}/proto-games`, queryFn);
  } // getProtoPlayers

  selectProtoGames$ (queryFn?: BgCloudCollectionQuery<ABgProtoGame> | undefined): Observable<ABgProtoGame[]> {
    return this.getProtoGames (queryFn).valueChanges ();
  } // selectProtoGames$

  seletProtoPlayers$<P extends ABgProtoPlayer = ABgProtoPlayer> (gameId: string, queryFn?: BgCloudCollectionQuery<ABgProtoPlayer> | undefined): Observable<P[]> {
    return this.getProtoPlayers<P> (gameId, queryFn).valueChanges ();
  } // seletProtoPlayers$

  seletProtoPlayer$ (playerId: string, gameId: string): Observable<ABgProtoPlayer | undefined> {
    const playerDoc = this.getProtoPlayers (gameId).doc (playerId);
    return playerDoc.valueChanges ();
  } // seletProtoPlayer$

  getProtoGame$ (gameId: string): Observable<ABgProtoGame | undefined> {
    const gameDoc = this.getProtoGames ().doc (gameId);
    return gameDoc.get ().pipe (map (snapshot => snapshot.data ()));
  } // getProtoGame$

  deleteProtoGame$ (gameId: string): Observable<void> {
    const gameDoc = this.getProtoGames ().doc (gameId);
    return from (gameDoc.delete ());
  } // deleteProtoGame$

  deleteProtoPlayers$ (playerId: string, gameId: string): Observable<void> {
    const playerDoc = this.getProtoPlayers (gameId).doc (playerId);
    return from (playerDoc.delete ());
  } // deleteProtoPlayers$

  insertProtoGame$ (protoGame: Omit<ABgProtoGame, "id">): Observable<ABgProtoGame> {
    return this.cloud.insert$<ABgProtoGame> (id => ({
      id: id,
      ...protoGame
    }), this.getProtoGames ());
  } // insertProtoGame$

  insertProtoPlayer$ (protoPlayer: ABgProtoPlayer, gameId: string): Observable<ABgProtoPlayer> {
    return this.cloud.insert$<ABgProtoPlayer> (id => protoPlayer, this.getProtoPlayers (gameId), protoPlayer.id);
  } // insertProtoPlayer$

  updateProtoPlayer$ (protoPlayer: Partial<ABgProtoPlayer>, playerId: string, gameId: string): Observable<void> {
    return this.cloud.update$<ABgProtoPlayer> (protoPlayer, playerId, this.getProtoPlayers (gameId));
  } // updateProtoPlayer$

} // BgProtoGameService

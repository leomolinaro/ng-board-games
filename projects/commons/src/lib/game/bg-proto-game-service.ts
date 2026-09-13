import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import type { BgUser } from '../authentication/bg-auth.service';
import type {
  BgCloudCollection,
  BgCloudCollectionQuery,
} from '../cloud/bg-cloud-service';
import { BgCloudService } from '../cloud/bg-cloud-service';

export type BgBoardGame = 'barony' | 'britannia' | 'wotr';

export interface NewGame {
  name: string;
  online: boolean;
}

export interface BgProtoGame<Opt = unknown> {
  id: string;
  name: string;
  boardGame: BgBoardGame;
  owner: BgUser;
  online: boolean;
  state: BgProtoGameState;
  options?: Opt;
}

export interface BgProtoPlayer<Pid extends string = string> {
  id: Pid;
  controller: BgUser | null;
  type: BgProtoPlayerType;
  name: string;
  ready: boolean;
}

export type BgProtoGameState = 'open' | 'running' | 'ended';
export type BgProtoPlayerType = 'user' | 'open' | 'closed' | 'ai';

@Injectable({
  providedIn: 'root',
})
export class BgProtoGameService {
  private cloud = inject(BgCloudService);

  private protoGames(): BgCloudCollection<BgProtoGame> {
    return this.cloud.collection<BgProtoGame>('proto-games');
  }
  getProtoGame(gameId: string): Promise<BgProtoGame | undefined> {
    return this.cloud.get(gameId, this.protoGames());
  }
  selectProtoGames$(
    queryFn?: BgCloudCollectionQuery<BgProtoGame>,
  ): Observable<BgProtoGame[]> {
    return this.cloud.selectAll$(this.protoGames(), queryFn);
  }
  selectProtoGame$(gameId: string): Observable<BgProtoGame | undefined> {
    return this.cloud.select$(gameId, this.protoGames());
  }
  insertProtoGame(protoGame: Omit<BgProtoGame, 'id'>): Promise<BgProtoGame> {
    return this.cloud.insert<BgProtoGame>(
      (id) => ({ id: id, ...protoGame }),
      this.protoGames(),
    );
  }
  updateProtoGame(patch: Partial<BgProtoGame>, gameId: string): Promise<void> {
    return this.cloud.update(gameId, patch, this.protoGames());
  }
  deleteProtoGame(gameId: string): Promise<void> {
    return this.cloud.delete(gameId, this.protoGames());
  }

  private protoPlayers<Pid extends string>(
    gameId: string,
  ): BgCloudCollection<BgProtoPlayer<Pid>> {
    return this.cloud.collection<BgProtoPlayer<Pid>>(
      `proto-games/${gameId}/proto-players`,
    );
  }
  getProtoPlayers(
    gameId: string,
    queryFn?: BgCloudCollectionQuery<BgProtoPlayer>,
  ): Promise<BgProtoPlayer[]> {
    return this.cloud.getAll(this.protoPlayers(gameId), queryFn);
  }
  selectProtoPlayers$<Pid extends string>(
    gameId: string,
    queryFn?: BgCloudCollectionQuery<BgProtoPlayer<Pid>>,
  ): Observable<BgProtoPlayer<Pid>[]> {
    return this.cloud.selectAll$(this.protoPlayers<Pid>(gameId), queryFn);
  }
  selectProtoPlayer$(
    playerId: string,
    gameId: string,
  ): Observable<BgProtoPlayer | undefined> {
    return this.cloud.select$(playerId, this.protoPlayers(gameId));
  }
  insertProtoPlayer<Pid extends string>(
    protoPlayer: BgProtoPlayer<Pid>,
    gameId: string,
  ): Promise<BgProtoPlayer<Pid>> {
    return this.cloud.set(
      protoPlayer.id,
      protoPlayer,
      this.protoPlayers(gameId),
    );
  }
  updateProtoPlayer(
    patch: Partial<BgProtoPlayer>,
    playerId: string,
    gameId: string,
  ): Promise<void> {
    return this.cloud.update(playerId, patch, this.protoPlayers(gameId));
  }
  deleteProtoPlayer(playerId: string, gameId: string): Promise<void> {
    return this.cloud.delete(playerId, this.protoPlayers(gameId));
  }
  deleteProtoPlayers(gameId: string): Promise<void> {
    return this.cloud.deleteAll(this.protoPlayers(gameId));
  }
}

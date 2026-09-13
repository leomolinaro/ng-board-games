import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import type {
  BgHomeConfig,
  BgProtoGame,
  BgProtoPlayer,
  BgUser,
} from '@leobg/commons';
import { BgHome } from '@leobg/commons';
import type { BritColor } from './brit-components.models';
import { BritComponents } from './brit-components.service';
import type {
  ABritPlayerDoc,
  BritAiPlayerDoc,
  BritPlayerDoc,
  BritReadPlayerDoc,
} from './brit-remote.service';
import { BritRemoteService } from './brit-remote.service';

@Component({
  selector: 'brit-home',
  imports: [BgHome],
  template: ` <bg-home [config]="config"></bg-home> `,
  styles: [
    `
      @use 'brit-variables' as *;

      ::ng-deep {
        .brit-player-blue {
          --bg-player-color: #{$blue};
        }
        .brit-player-red {
          --bg-player-color: #{$red};
        }
        .brit-player-green {
          --bg-player-color: #{$green};
        }
        .brit-player-yellow {
          --bg-player-color: #{$yellow};
        }
      }
    `,
  ],
})
export class BritHome {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private gameService = inject(BritRemoteService);
  private components = inject(BritComponents);

  config: BgHomeConfig<BritColor> = {
    boardGame: 'britannia',
    boardGameName: 'Britannia',
    startGame: async (gameId: string) => {
      await this.router.navigate(['game', gameId], {
        relativeTo: this.activatedRoute,
      });
    },
    deleteGame: async (gameId: string) => {
      await this.gameService.deleteStories(gameId);
      await this.gameService.deletePlayers(gameId);
      await this.gameService.deleteGame(gameId);
    },
    createGame: (protoGame, protoPlayers) =>
      this.createGame$(protoGame, protoPlayers),
    playerIds: () => this.components.COLORS,
    playerIdCssClass: (color: BritColor) => {
      switch (color) {
        case 'blue':
          return 'brit-player-blue';
        case 'green':
          return 'brit-player-green';
        case 'red':
          return 'brit-player-red';
        case 'yellow':
          return 'brit-player-yellow';
      }
    },
  };

  private async createGame$(
    protoGame: BgProtoGame,
    protoPlayers: BgProtoPlayer<BritColor>[],
  ): Promise<void> {
    const game = await this.gameService.insertGame({
      id: protoGame.id,
      owner: protoGame.owner,
      name: protoGame.name,
      online: protoGame.online,
      state: 'open',
    });
    for (const [index, p] of protoPlayers.entries()) {
      if (p.type === 'ai') {
        await this.insertAiPlayer(p.id, p.name, index + 1, game.id);
      } else {
        await this.insertRealPlayer(
          p.id,
          p.name,
          index + 1,
          p.controller!,
          game.id,
        );
      }
    }
  }

  private insertAiPlayer(
    playerId: BritColor,
    name: string,
    sort: number,
    gameId: string,
  ): Promise<BritPlayerDoc> {
    const player: BritAiPlayerDoc = {
      ...this.aPlayerDoc(playerId, name, sort),
      isAi: true,
    };
    return this.gameService.insertPlayer(player, gameId);
  }

  private insertRealPlayer(
    playerId: BritColor,
    name: string,
    sort: number,
    controller: BgUser,
    gameId: string,
  ): Promise<BritPlayerDoc> {
    const player: BritReadPlayerDoc = {
      ...this.aPlayerDoc(playerId, name, sort),
      isAi: false,
      controller: controller,
    };
    return this.gameService.insertPlayer(player, gameId);
  }

  private aPlayerDoc(
    playerId: BritColor,
    name: string,
    sort: number,
  ): ABritPlayerDoc {
    return { id: playerId, name: name, sort: sort };
  }
}

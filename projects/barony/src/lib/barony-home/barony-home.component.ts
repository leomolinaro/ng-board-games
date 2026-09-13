import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import type {
  BgHomeConfig,
  BgProtoGame,
  BgProtoPlayer,
  BgUser,
} from '@leobg/commons';
import { BgHome } from '@leobg/commons';
import { BARONY_COLORS } from '../barony-constants';
import type {
  BaronyColor,
  BaronyLandCoordinates,
  BaronyLandType,
} from '../barony-models';
import type {
  ABaronyPlayerDoc,
  BaronyAiPlayerDoc,
  BaronyMapDoc,
  BaronyPlayerDoc,
  BaronyReadPlayerDoc,
} from '../barony-remote.service';
import { BaronyRemoteService } from '../barony-remote.service';
import { getRandomLands } from './barony-initializer';

@Component({
  selector: 'barony-home',
  imports: [BgHome],
  template: ` <bg-home [config]="config"></bg-home> `,
  styles: [
    `
      @use 'barony-variables' as *;

      ::ng-deep {
        .barony-player-blue {
          --bg-player-color: #{$blue};
        }
        .barony-player-red {
          --bg-player-color: #{$red};
        }
        .barony-player-green {
          --bg-player-color: #{$green};
        }
        .barony-player-yellow {
          --bg-player-color: #{$yellow};
        }
      }
    `,
  ],
})
export class BaronyHomeComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private gameService = inject(BaronyRemoteService);

  config: BgHomeConfig<BaronyColor> = {
    boardGame: 'barony',
    boardGameName: 'Barony',
    startGame: async (gameId: string) => {
      await this.router.navigate(['game', gameId], {
        relativeTo: this.activatedRoute,
      });
    },
    deleteGame: async (gameId: string) => {
      await this.gameService.deleteStories(gameId);
      await this.gameService.deleteMap(gameId);
      await this.gameService.deletePlayers(gameId);
      await this.gameService.deleteGame(gameId);
    },
    createGame: (protoGame, protoPlayers) =>
      this.createGame(protoGame, protoPlayers),
    playerIds: () => BARONY_COLORS,
    playerIdCssClass: (color: BaronyColor) => {
      switch (color) {
        case 'blue':
          return 'barony-player-blue';
        case 'green':
          return 'barony-player-green';
        case 'red':
          return 'barony-player-red';
        case 'yellow':
          return 'barony-player-yellow';
      }
    },
  };

  private async createGame(
    protoGame: BgProtoGame,
    protoPlayers: BgProtoPlayer<BaronyColor>[],
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
    await this.insertMap(getRandomLands(protoPlayers.length), game.id);
  }

  private insertMap(
    lands: { coordinates: BaronyLandCoordinates; type: BaronyLandType }[],
    gameId: string,
  ): Promise<BaronyMapDoc> {
    const baronyMap: BaronyMapDoc = {
      lands: lands.map((l) => ({
        x: l.coordinates.x,
        y: l.coordinates.y,
        type: l.type,
      })),
    };
    return this.gameService.insertMap(baronyMap, gameId);
  }

  private insertAiPlayer(
    playerId: BaronyColor,
    name: string,
    sort: number,
    gameId: string,
  ): Promise<BaronyPlayerDoc> {
    const player: BaronyAiPlayerDoc = {
      ...this.aPlayerDoc(playerId, name, sort),
      isAi: true,
    };
    return this.gameService.insertPlayer(player, gameId);
  }

  private insertRealPlayer(
    playerId: BaronyColor,
    name: string,
    sort: number,
    controller: BgUser,
    gameId: string,
  ): Promise<BaronyPlayerDoc> {
    const player: BaronyReadPlayerDoc = {
      ...this.aPlayerDoc(playerId, name, sort),
      isAi: false,
      controller: controller,
    };
    return this.gameService.insertPlayer(player, gameId);
  }

  private aPlayerDoc(
    playerId: BaronyColor,
    name: string,
    sort: number,
  ): ABaronyPlayerDoc {
    return { id: playerId, name: name, sort: sort };
  }
}

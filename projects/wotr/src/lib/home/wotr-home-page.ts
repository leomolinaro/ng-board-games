import {
  Component,
  computed,
  inject,
  Injector,
  isDevMode,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import type {
  BgHomeAction,
  BgHomeConfig,
  BgProtoGame,
  BgProtoPlayer,
  BgUser,
} from '@leobg/commons';
import { BgAuthService, BgDialogService, BgHome } from '@leobg/commons';
import type { WotrFrontId } from '../front/wotr-front-models';
import type { WotrGameOptions } from '../game/options/wotr-game-options';
import { WotrGameOptionsFormComponent } from '../game/options/wotr-game-options-form';
import { WotrRemoteService } from '../remote/wotr-remote';
import type {
  AWotrPlayerDoc,
  WotrAiPlayerDoc,
  WotrGameDoc,
  WotrPlayerDoc,
  WotrReadPlayerDoc,
} from '../remote/wotr-remote-models';
import { WotrScenarioSelectorDialog } from '../scenario/wotr-scenario-selector';

@Component({
  selector: 'wotr-home-page',
  imports: [BgHome],
  template: `
    <bg-home
      [config]="config"
      [actions]="devMode && isAdmin() ? [scenarioAction] : []"
    />
  `,
  styles: [
    `
      @use 'wotr-variables' as *;

      ::ng-deep {
        .wotr-player-free-peoples {
          --bg-player-color: #{$blue};
        }
        .wotr-player-shadow {
          --bg-player-color: #{$red};
        }
      }
      .load-example {
        position: absolute;
        bottom: 50px;
        left: 50px;
      }
    `,
  ],
})
export class WotrHomePage {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private remote = inject(WotrRemoteService);

  protected devMode = isDevMode();

  protected config: BgHomeConfig<WotrFrontId, WotrGameOptions> = {
    boardGame: 'wotr',
    boardGameName: 'War of the Ring (2nd Edition)',
    startGame: async (gameId: string) => {
      await this.router.navigate(['game', gameId], {
        relativeTo: this.activatedRoute,
      });
    },
    deleteGame: async (gameId: string) => {
      await this.remote.deleteStories(gameId);
      await this.remote.deletePlayers(gameId);
      await this.remote.deleteGame(gameId);
    },
    createGame: (protoGame, protoPlayers) =>
      this.createGame(protoGame, protoPlayers),
    playerIds: () => ['free-peoples', 'shadow'],
    playerIdCssClass: (front: WotrFrontId) => {
      switch (front) {
        case 'free-peoples':
          return 'wotr-player-free-peoples';
        case 'shadow':
          return 'wotr-player-shadow';
      }
    },
    optionsComponent: () => WotrGameOptionsFormComponent,
  };

  private async createGame(
    protoGame: BgProtoGame,
    protoPlayers: BgProtoPlayer<WotrFrontId>[],
  ) {
    const game: WotrGameDoc = {
      id: protoGame.id,
      owner: protoGame.owner,
      name: protoGame.name,
      online: protoGame.online,
      state: 'open',
    };
    if (protoGame.options) game.options = protoGame.options as WotrGameOptions;
    const { id } = await this.remote.insertGame(game);
    for (const [index, p] of protoPlayers.entries()) {
      if (p.type === 'ai') {
        await this.insertAiPlayer(p.name, p.id, index + 1, id);
      } else {
        await this.insertRealPlayer(p.name, p.id, index + 1, p.controller!, id);
      }
    }
  }

  private insertAiPlayer(
    name: string,
    front: WotrFrontId,
    sort: number,
    gameId: string,
  ): Promise<WotrPlayerDoc> {
    const player: WotrAiPlayerDoc = {
      ...this.aPlayerDoc(name, front, sort),
      isAi: true,
    };
    return this.remote.insertPlayer(player, gameId);
  }

  private insertRealPlayer(
    name: string,
    front: WotrFrontId,
    sort: number,
    controller: BgUser,
    gameId: string,
  ): Promise<WotrPlayerDoc> {
    const player: WotrReadPlayerDoc = {
      ...this.aPlayerDoc(name, front, sort),
      isAi: false,
      controller: controller,
    };
    return this.remote.insertPlayer(player, gameId);
  }

  private aPlayerDoc(
    name: string,
    front: WotrFrontId,
    sort: number,
  ): AWotrPlayerDoc {
    return { name: name, id: front, sort: sort };
  }

  private auth = inject(BgAuthService);
  protected user = toSignal(this.auth.getUser$());
  protected isAdmin = computed(
    () => this.user()?.email === 'rhapsody.leo@gmail.com',
  );
  private readonly dialogs = inject(BgDialogService);
  private injector = inject(Injector);

  protected scenarioAction: BgHomeAction = {
    id: 'scenario',
    label: 'Scenario',
    action: () => {
      void this.dialogs.open(WotrScenarioSelectorDialog, {
        injector: this.injector,
        size: 'l',
      });
    },
    icon: '@tui.bookmark',
  };
}

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import type { OnInit, Type } from '@angular/core';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BgDialogService } from '@leobg/commons';
import type { BgTransformFn } from '@leobg/commons/utils';
import { BgTransformPipe } from '@leobg/commons/utils';
import { TuiTabBar } from '@taiga-ui/addon-mobile';
import { TuiTable, TuiTableControl } from '@taiga-ui/addon-table';
import { TuiButton, TuiDropdown, TuiTitle } from '@taiga-ui/core';
import { TuiCell } from '@taiga-ui/core/components/cell';
import {
  TuiAutoColorPipe,
  TuiAvatar,
  TuiInitialsPipe,
  TuiItemsWithMore,
  TuiProgress,
  TuiStatus,
} from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';
import type { Observable } from 'rxjs';
import { map, of } from 'rxjs';
import { BgAuthService } from '../../authentication';
import { BgAccountButton } from '../../authentication/bg-account-button';
import { BgIfUserDirective } from '../../authentication/bg-if-user-of.directive';
import type {
  BgBoardGame,
  BgProtoGame,
  BgProtoGameState,
  BgProtoPlayer,
  NewGame,
} from '../bg-proto-game-service';
import { BgProtoGameService } from '../bg-proto-game-service';
import type {
  BgRoomDialogInput,
  BgRoomDialogOutput,
} from './bg-game-room-dialog';
import { BgGameRoomDialog } from './bg-game-room-dialog';
import type { BgGameOptionsComponent } from './bg-home-game-options';
import { BgNewGameDialog } from './bg-new-game-dialog';

export interface BgHomeConfig<Pid extends string, Opt = unknown> {
  boardGame: BgBoardGame;
  boardGameName: string;
  startGame: (gameId: string) => Promise<void>;
  deleteGame: (gameId: string) => Promise<void>;
  createGame: (
    protoGame: BgProtoGame,
    protoPlayers: BgProtoPlayer<Pid>[],
  ) => Promise<void>;
  playerIds: () => Pid[];
  playerIdCssClass: (playerId: Pid) => string;
  optionsComponent?: () => Type<BgGameOptionsComponent<Opt>>;
}

export interface BgHomeAction {
  id: string;
  label: string;
  action: () => void;
  icon: string;
}

interface GameStateDecode {
  color: string;
  label: string;
}

@Component({
  selector: 'bg-home',
  templateUrl: './bg-home.html',
  styleUrls: ['./bg-home.scss'],
  imports: [
    AsyncPipe,
    BgAccountButton,
    BgIfUserDirective,
    BgTransformPipe,
    TuiAutoColorPipe,
    TuiAvatar,
    TuiAvatar,
    TuiButton,
    TuiCell,
    TuiCell,
    TuiDropdown,
    TuiInitialsPipe,
    TuiItemsWithMore,
    TuiNavigation,
    TuiProgress,
    TuiStatus,
    TuiTabBar,
    TuiTable,
    TuiTableControl,
    TuiTitle,
    RouterLink,
  ],
})
export class BgHome<Pid extends string, Opt> implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private protoGameService = inject(BgProtoGameService);
  private authService = inject(BgAuthService);
  private readonly dialogs = inject(BgDialogService);

  config = input.required<BgHomeConfig<Pid, Opt>>();
  actions = input<BgHomeAction[]>();

  private stateDecodes: Record<BgProtoGameState, GameStateDecode> = {
    open: { color: '#4caf50', label: 'Open' },
    running: { color: '#2196f3', label: 'Running' },
    ended: { color: '#9e9e9e', label: 'Ended' },
  };
  protected stateDecode: BgTransformFn<BgProtoGameState, GameStateDecode> = (
    state: BgProtoGameState,
  ) => this.stateDecodes[state];

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  protoGames$!: Observable<BgProtoGame[]>;
  gameColumns = ['run', 'name', 'state', 'owner', 'delete'];

  ngOnInit(): void {
    this.protoGames$ = this.protoGameService.selectProtoGames$((ref) =>
      ref.where('boardGame', '==', this.config().boardGame),
    );
  }

  protected async openNewGameDialog() {
    const game = await this.dialogs.open<void, NewGame>(BgNewGameDialog, {
      label: 'New Game',
      size: 's',
    });
    if (!game) return;
    await this.createGame(game);
  }

  private async createGame(game: NewGame) {
    const user = this.authService.getUser();
    const protoGame: Omit<BgProtoGame, 'id'> = {
      ...game,
      boardGame: this.config().boardGame,
      owner: user,
      state: 'open',
    };
    const savedProtoGame =
      await this.protoGameService.insertProtoGame(protoGame);
    for (const id of this.config().playerIds())
      await this.insertProtoPlayer(id, savedProtoGame.id);
    await this.playersRoom(savedProtoGame);
  }

  private insertProtoPlayer(id: Pid, gameId: string) {
    const player: BgProtoPlayer<Pid> = {
      id: id,
      name: '',
      controller: null,
      type: 'closed',
      ready: false,
    };
    return this.protoGameService.insertProtoPlayer(player, gameId);
  }

  deleteGame(game: BgProtoGame) {
    void this.deleteGameId(game.id);
  }

  async enterGame(game: BgProtoGame) {
    if (game.state === 'running') {
      return this.config().startGame(game.id);
    } else {
      return this.playersRoom(game);
    }
  }

  private async playersRoom(game: BgProtoGame) {
    const output = await this.dialogs.open<
      BgRoomDialogInput<Pid, Opt>,
      BgRoomDialogOutput
    >(BgGameRoomDialog, {
      label: game.name,
      data: {
        protoGame: game,
        createGame: (protoGame, protoPlayers) =>
          this.createGame$(protoGame, protoPlayers),
        deleteGame: (gameId) => this.deleteGameId(gameId),
        playerIdToCssClass: (role) => this.config().playerIdCssClass(role),
        optionsComponent: this.config().optionsComponent?.(),
      },
    });
    if (output?.startGame) return this.config().startGame(output.gameId);
    return of(void 0);
  }

  private async createGame$(
    protoGame: BgProtoGame,
    protoPlayers: BgProtoPlayer<Pid>[],
  ) {
    const activeProtoPlayers = protoPlayers.filter(
      (p) => p.type === 'user' || p.type === 'ai',
    );
    await this.config().createGame(protoGame, activeProtoPlayers);
    await this.protoGameService.updateProtoGame(
      { state: 'running' },
      protoGame.id,
    );
  }

  private async deleteGameId(gameId: string) {
    await this.config().deleteGame(gameId);
    await this.protoGameService.deleteProtoPlayers(gameId);
    await this.protoGameService.deleteProtoGame(gameId);
  }
}

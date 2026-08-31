import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  Type,
  ViewChild,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BgTransformFn,
  BgTransformPipe,
  ExhaustingEvent,
  Loading,
  UntilDestroy,
  concatJoin,
} from '@leobg/commons/utils';
import { TuiTabBar } from '@taiga-ui/addon-mobile';
import { TuiTable, TuiTableControl } from '@taiga-ui/addon-table';
import {
  TuiButton,
  TuiDialogService,
  TuiDropdown,
  TuiTitle,
} from '@taiga-ui/core';
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
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { Observable, firstValueFrom, map, mapTo, of, switchMap } from 'rxjs';
import { BgAuthService } from '../../authentication';
import { BgAccountButton } from '../../authentication/bg-account-button';
import { BgIfUserDirective } from '../../authentication/bg-if-user-of.directive';
import {
  BgBoardGame,
  BgProtoGame,
  BgProtoGameService,
  BgProtoGameState,
  BgProtoPlayer,
  NewGame,
} from '../bg-proto-game-service';
import {
  BgGameRoomDialog,
  BgRoomDialogInput,
  BgRoomDialogOutput,
} from './bg-game-room-dialog';
import { BgGameOptionsComponent } from './bg-home-game-options';
import { BgNewGameDialog } from './bg-new-game-dialog';

export interface BgHomeConfig<Pid extends string, Opt = any> {
  boardGame: BgBoardGame;
  boardGameName: string;
  startGame$: (gameId: string) => Observable<any>;
  deleteGame$: (gameId: string) => Observable<any>;
  createGame$: (
    protoGame: BgProtoGame,
    protoPlayers: BgProtoPlayer<Pid>[],
  ) => Observable<any>;
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
@UntilDestroy
export class BgHome<Pid extends string> implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private protoGameService = inject(BgProtoGameService);
  private authService = inject(BgAuthService);
  private readonly dialogs = inject(TuiDialogService);

  config = input.required<BgHomeConfig<Pid>>();
  actions = input<BgHomeAction[]>();
  @ViewChild('newGameDialog') newGameDialog!: TemplateRef<void>;

  private stateDecodes: Record<BgProtoGameState, GameStateDecode> = {
    open: { color: '#4caf50', label: 'Open' },
    running: { color: '#2196f3', label: 'Running' },
    ended: { color: '#9e9e9e', label: 'Ended' },
  };
  protected stateDecode: BgTransformFn<BgProtoGameState, GameStateDecode> = (
    state: BgProtoGameState,
  ) => this.stateDecodes[state];

  @Loading() loading$!: Observable<boolean>;
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

  ngOnDestroy() {}

  protected async openNewGameDialog() {
    const game = await firstValueFrom(
      this.dialogs.open<NewGame | null>(
        new PolymorpheusComponent(BgNewGameDialog),
        {
          label: 'New Game',
          size: 's',
        },
      ),
    );
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
    const savedProtoGame = await firstValueFrom(
      this.protoGameService.insertProtoGame$(protoGame),
    );
    const inserts: Observable<BgProtoPlayer<Pid>>[] = this.config()
      .playerIds()
      .map((id) => this.insertProtoPlayer$(id, savedProtoGame.id));
    await firstValueFrom(concatJoin(inserts));
    await this.playersRoom(savedProtoGame);
  }

  private insertProtoPlayer$(id: Pid, gameId: string) {
    const player: BgProtoPlayer<Pid> = {
      id: id,
      name: '',
      controller: null,
      type: 'closed',
      ready: false,
    };
    return this.protoGameService.insertProtoPlayer$(player, gameId);
  }

  @ExhaustingEvent()
  deleteGame(game: BgProtoGame) {
    return this.deleteGame$(game.id);
  }

  async enterGame(game: BgProtoGame) {
    if (game.state === 'running') {
      return firstValueFrom(this.config().startGame$(game.id));
    } else {
      return this.playersRoom(game);
    }
  }

  private async playersRoom(game: BgProtoGame) {
    const output = await firstValueFrom(
      this.dialogs.open<BgRoomDialogOutput | null>(
        new PolymorpheusComponent(BgGameRoomDialog),
        {
          label: game.name,
          // width: "1000px",
          data: {
            protoGame: game,
            createGame$: (protoGame, protoPlayers) =>
              this.createGame$(protoGame, protoPlayers),
            deleteGame$: (gameId) => this.deleteGame$(gameId),
            playerIdToCssClass: (role) => this.config().playerIdCssClass(role),
            optionsComponent: this.config().optionsComponent?.(),
          } satisfies BgRoomDialogInput<Pid, any>,
        },
      ),
    );
    if (output?.startGame)
      return firstValueFrom(this.config().startGame$(output.gameId));
    return of(void 0);
  }

  private createGame$(
    protoGame: BgProtoGame,
    protoPlayers: BgProtoPlayer<Pid>[],
  ) {
    const activeProtoPlayers = protoPlayers.filter(
      (p) => p.type === 'user' || p.type === 'ai',
    );
    return this.config()
      .createGame$(protoGame, activeProtoPlayers)
      .pipe(
        switchMap(() =>
          this.protoGameService.updateProtoGame$(
            { state: 'running' },
            protoGame.id,
          ),
        ),
      );
  }

  private deleteGame$(gameId: string) {
    return concatJoin([
      this.config().deleteGame$(gameId),
      this.protoGameService.deleteProtoPlayers$(gameId),
      this.protoGameService.deleteProtoGame$(gameId),
    ]).pipe(mapTo(void 0));
  }
}

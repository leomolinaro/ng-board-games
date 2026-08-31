import {
  AfterViewInit,
  Component,
  OnDestroy,
  Type,
  ViewContainerRef,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  ConcatingEvent,
  ExhaustingEvent,
  UntilDestroy,
} from '@leobg/commons/utils';
import { TuiButton, TuiDialogContext } from '@taiga-ui/core';
import { TuiForm } from '@taiga-ui/layout';
import { injectContext } from '@taiga-ui/polymorpheus';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BgTransformPipe } from '../../../../utils/src/lib/bg-transform.pipe';
import { BgAuthService } from '../../authentication';
import { BgIfUserDirective } from '../../authentication/bg-if-user-of.directive';
import { BgIfUserPipe } from '../../authentication/bg-if-user.pipe';
import {
  BgProtoGame,
  BgProtoGameService,
  BgProtoPlayer,
} from '../bg-proto-game-service';
import { BgGameOptionsComponent } from './bg-home-game-options';
import { BgPlayerForm } from './bg-player-form';

export interface BgRoomDialogInput<Pid extends string, Opt = any> {
  protoGame: BgProtoGame;
  createGame$: (
    protoGame: BgProtoGame,
    protoPlayers: BgProtoPlayer<Pid>[],
  ) => Observable<void>;
  deleteGame$: (gameId: string) => Observable<void>;
  playerIdToCssClass: (id: Pid) => string;
  optionsComponent?: Type<BgGameOptionsComponent<Opt>>;
}

export interface BgRoomDialogOutput {
  gameId: string;
  startGame: boolean;
}

@Component({
  selector: 'bg-game-room-dialog',
  imports: [
    BgPlayerForm,
    BgIfUserDirective,
    TuiButton,
    BgIfUserPipe,
    BgTransformPipe,
    TuiForm,
  ],
  template: `
    <div tuiForm>
      <section class="players">
        @for (player of players(); let i = $index; track i) {
          <bg-player-form
            [onlineGame]="onlineGame"
            [player]="player"
            (playerChange)="changePlayer($event, player.id)"
            [isOwner]="isOwner()"
            [isPlayer]="player.controller && (player.controller | bgIfUser)"
            [class]="player.id | bgTransform: roleToCssClass"
          />
        }
      </section>
      @if (optionsComponent) {
        <ng-container #options></ng-container>
      }
      <footer *bgIfUser="protoGame().owner">
        <button
          tuiButton
          appearance="secondary-destructive"
          (click)="deleteGame()"
        >
          Delete game
        </button>
        <button
          tuiButton
          color="primary"
          [disabled]="!validPlayers()"
          (click)="startGame()"
        >
          Start game
        </button>
      </footer>
    </div>
  `,
  styles: `
    .players {
      display: grid;
      grid-template-columns:
        max-content max-content minmax(12rem, 1fr)
        max-content;
      align-items: center;
      column-gap: 1rem;
      row-gap: 0.5rem;
    }
  `,
})
@UntilDestroy
export class BgGameRoomDialog<Pid extends string, Opt = any>
  implements AfterViewInit, OnDestroy
{
  constructor() {
    effect(() => this.autoStartGame());
  }

  protected readonly context =
    injectContext<
      TuiDialogContext<BgRoomDialogOutput | null, BgRoomDialogInput<Pid, Opt>>
    >();

  private protoGameService = inject(BgProtoGameService);
  private authService = inject(BgAuthService);

  protected onlineGame = this.context.data.protoGame.online;
  protected protoGame = rxResource<BgProtoGame<any>, void>({
    stream: () =>
      this.protoGameService.selectProtoGame$(
        this.context.data.protoGame.id,
      ) as Observable<BgProtoGame<any>>,
    defaultValue: this.context.data.protoGame,
  }).value;
  protected optionsComponent = this.context.data.optionsComponent;
  protected isOwner = computed(() => {
    const user = this.authService.getUser();
    return user && this.protoGame().owner.id === user.id;
  });

  protected optionsRef = viewChild('options', { read: ViewContainerRef });
  roleToCssClass = (role: Pid) => this.context.data.playerIdToCssClass(role);

  protected players = rxResource({
    stream: () =>
      this.protoGameService.selectProtoPlayers$<Pid>(
        this.context.data.protoGame.id,
      ),
  }).value;

  protected validPlayers = computed(() => {
    const players = this.players();
    if (!players) return undefined;
    let nPlayers = 0;
    for (const player of players) {
      switch (player.type) {
        case 'user':
          if (!player.name || !player.ready) {
            return false;
          }
          nPlayers++;
          break;
        case 'ai':
          if (!player.name) {
            return false;
          }
          nPlayers++;
          break;
        case 'open':
          return false;
      }
    }
    if (nPlayers < 2) {
      return false;
    }
    return true;
  });

  private autoStartGame() {
    if (this.protoGame()?.state === 'running') {
      this.closeDialog(true);
    }
  }

  ngOnDestroy() {}

  ngAfterViewInit() {
    const optionsRef = this.optionsRef();
    if (this.optionsComponent && optionsRef) {
      const componentRef = optionsRef.createComponent(this.optionsComponent);
      componentRef.setInput('isOwner', this.isOwner());
      if (this.context.data.protoGame.options) {
        componentRef.setInput('options', this.context.data.protoGame.options);
      }
      const subscription = componentRef.instance.options.subscribe(
        (options) => {
          this.updateOptions(options);
        },
      );
      componentRef.onDestroy(() => subscription.unsubscribe());
    }
  }

  @ConcatingEvent()
  private updateOptions(options: Opt) {
    return this.protoGameService.updateProtoGame$(
      { options: options },
      this.protoGame().id,
    );
  }

  @ConcatingEvent()
  changePlayer(player: BgProtoPlayer<string>, playerId: string) {
    return this.protoGameService.updateProtoPlayer$(
      player,
      playerId,
      this.protoGame().id,
    );
  }

  @ExhaustingEvent()
  startGame() {
    if (this.protoGame().state === 'open') {
      const protoPlayers = this.players()!;
      return this.context.data
        .createGame$(this.protoGame(), protoPlayers)
        .pipe(tap(() => this.closeDialog(true)));
    } else {
      this.closeDialog(true);
      return of(void 0);
    }
  }

  private closeDialog(startGame: boolean) {
    this.context.completeWith({
      startGame: startGame,
      gameId: this.protoGame().id,
    });
  }

  @ExhaustingEvent()
  deleteGame() {
    return this.context.data
      .deleteGame$(this.protoGame().id)
      .pipe(tap(() => this.closeDialog(false)));
  }
}

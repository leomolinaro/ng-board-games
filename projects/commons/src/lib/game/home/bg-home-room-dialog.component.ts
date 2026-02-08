import { CdkScrollable } from "@angular/cdk/scrolling";
import { NgClass } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  Type,
  ViewContainerRef,
  computed,
  effect,
  inject,
  viewChild
} from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { MatButton } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { ConcatingEvent, ExhaustingEvent, UntilDestroy } from "@leobg/commons/utils";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { BgTransformPipe } from "../../../../utils/src/lib/bg-transform.pipe";
import { BgAuthService } from "../../authentication";
import { BgIfUserDirective } from "../../authentication/bg-if-user-of.directive";
import { BgIfUserPipe } from "../../authentication/bg-if-user.pipe";
import { BgProtoGame, BgProtoGameService, BgProtoPlayer } from "../bg-proto-game.service";
import { BgGameOptionsComponent } from "./bg-home-game-options";
import { BgHomePlayerFormComponent } from "./bg-home-player-form.component";

export interface BgRoomDialogInput<Pid extends string, Opt = any> {
  protoGame: BgProtoGame;
  createGame$: (protoGame: BgProtoGame, protoPlayers: BgProtoPlayer<Pid>[]) => Observable<void>;
  deleteGame$: (gameId: string) => Observable<void>;
  playerIdToCssClass: (id: Pid) => string;
  optionsComponent?: Type<BgGameOptionsComponent<Opt>>;
}

export interface BgRoomDialogOutput {
  gameId: string;
  startGame: boolean;
}

@Component({
  selector: "bg-home-room-dialog",
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    BgHomePlayerFormComponent,
    NgClass,
    BgIfUserDirective,
    MatDialogActions,
    MatButton,
    BgIfUserPipe,
    BgTransformPipe
  ],
  template: `
    <h1 mat-dialog-title>Players</h1>
    <div
      mat-dialog-content
      class="bg-players">
      @for (player of players(); let i = $index; track i) {
        <bg-home-player-form
          [onlineGame]="onlineGame"
          [player]="player"
          (playerChange)="onPlayerChange($event, player.id)"
          [isOwner]="isOwner()"
          [isPlayer]="player.controller && (player.controller | bgIfUser)"
          [ngClass]="player.id | bgTransform: roleToCssClass">
        </bg-home-player-form>
      }
      @if (optionsComponent) {
        <div class="bg-options">
          <ng-container #options></ng-container>
        </div>
      }
    </div>
    <div
      mat-dialog-actions
      *bgIfUser="protoGame().owner">
      <button
        mat-button
        color="warn"
        (click)="onDeleteGameClick()">
        Delete game
      </button>
      <button
        class="bg-game-start-button"
        mat-button
        color="accent"
        [disabled]="!validPlayers()"
        (click)="onStartGameClick()">
        Start game
      </button>
    </div>
  `,
  styles: [
    `
      @use "bg-variables" as bg;
      :host {
        background: bg.$surface;
        display: block;
      }
      .bg-players {
        display: flex;
        flex-direction: column;
        bg-home-player-form {
          width: 100%;
        }
      }

      .bg-options {
        margin-top: 1vmin;
      }

      .bg-game-start-button {
        margin-left: auto !important;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BgHomeRoomDialogComponent<Pid extends string, Opt = any>
  implements AfterViewInit, OnDestroy
{
  private dialogRef =
    inject<MatDialogRef<BgHomeRoomDialogComponent<Pid, Opt>, BgRoomDialogOutput>>(MatDialogRef);
  private input = inject<BgRoomDialogInput<Pid, Opt>>(MAT_DIALOG_DATA);
  private protoGameService = inject(BgProtoGameService);
  private authService = inject(BgAuthService);

  protected onlineGame = this.input.protoGame.online;
  protected protoGame = rxResource<BgProtoGame<any>, void>({
    loader: () =>
      this.protoGameService.selectProtoGame$(this.input.protoGame.id) as Observable<
        BgProtoGame<any>
      >,
    defaultValue: this.input.protoGame
  }).value;
  protected optionsComponent = this.input.optionsComponent;
  protected isOwner = computed(() => {
    const user = this.authService.getUser();
    return user && this.protoGame().owner.id === user.id;
  });

  protected optionsRef = viewChild("options", { read: ViewContainerRef });
  roleToCssClass = (role: Pid) => this.input.playerIdToCssClass(role);

  protected players = rxResource({
    loader: () => this.protoGameService.selectProtoPlayers$<Pid>(this.input.protoGame.id)
  }).value;

  protected validPlayers = computed(() => {
    const players = this.players();
    if (!players) return undefined;
    let nPlayers = 0;
    for (const player of players) {
      switch (player.type) {
        case "user":
          if (!player.name || !player.ready) {
            return false;
          }
          nPlayers++;
          break;
        case "ai":
          if (!player.name) {
            return false;
          }
          nPlayers++;
          break;
        case "open":
          return false;
      }
    }
    if (nPlayers < 2) {
      return false;
    }
    return true;
  });

  private startGame = effect(() => {
    if (this.protoGame()?.state === "running") {
      this.closeDialog(true);
    }
  });

  ngOnDestroy() {}

  ngAfterViewInit() {
    const optionsRef = this.optionsRef();
    if (this.optionsComponent && optionsRef) {
      const componentRef = optionsRef.createComponent(this.optionsComponent);
      componentRef.setInput("isOwner", this.isOwner());
      if (this.input.protoGame.options) {
        componentRef.setInput("options", this.input.protoGame.options);
      }
      const subscription = componentRef.instance.options.subscribe(options => {
        this.updateOptions(options);
      });
      componentRef.onDestroy(() => subscription.unsubscribe());
    }
  }

  @ConcatingEvent()
  private updateOptions(options: Opt) {
    return this.protoGameService.updateProtoGame$({ options: options }, this.protoGame().id);
  }

  @ConcatingEvent()
  onPlayerChange(player: BgProtoPlayer<string>, playerId: string) {
    return this.protoGameService.updateProtoPlayer$(player, playerId, this.protoGame().id);
  }

  @ExhaustingEvent()
  onStartGameClick() {
    if (this.protoGame().state === "open") {
      const protoPlayers = this.players()!;
      return this.input
        .createGame$(this.protoGame(), protoPlayers)
        .pipe(tap(() => this.closeDialog(true)));
    } else {
      this.closeDialog(true);
      return of(void 0);
    }
  }

  private closeDialog(startGame: boolean) {
    this.dialogRef.close({
      startGame: startGame,
      gameId: this.protoGame().id
    });
  }

  @ExhaustingEvent()
  onDeleteGameClick() {
    return this.input.deleteGame$(this.protoGame().id).pipe(tap(() => this.closeDialog(false)));
  }
}

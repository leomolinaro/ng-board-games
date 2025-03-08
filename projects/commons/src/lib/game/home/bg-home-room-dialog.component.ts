import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, TrackByFunction } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ChangeListener, ConcatingEvent, ExhaustingEvent, UntilDestroy } from "@leobg/commons/utils";
import { BehaviorSubject, Observable, of } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { BgProtoGame, BgProtoGameService, BgProtoPlayer } from "../bg-proto-game.service";

export interface BgRoomDialogInput<Pid extends string> {
  protoGame: BgProtoGame;
  createGame$: (protoGame: BgProtoGame, protoPlayers: BgProtoPlayer<Pid>[]) => Observable<void>;
  deleteGame$: (gameId: string) => Observable<void>;
  playerIdToCssClass: (id: Pid) => string;
}

export interface BgRoomDialogOutput {
  gameId: string;
  startGame: boolean;
}

@Component ({
  selector: "bg-home-room-dialog",
  template: `
    <h1 mat-dialog-title>Players</h1>
    <div mat-dialog-content class="bg-players">
      <bg-home-player-form
        *ngFor="let player of players$ | async; index as i; trackBy: playerTrackBy"
        [onlineGame]="onlineGame"
        [player]="player"
        (playerChange)="onPlayerChange($event, player.id)"
        [isOwner]="game.owner | bgIfUser"
        [isPlayer]="player.controller && (player.controller | bgIfUser)"
        [ngClass]="player.id | bgTransform : roleToCssClass">
      </bg-home-player-form>
    </div>
    <div mat-dialog-actions *bgIfUser="game.owner">
      <button mat-button color="warn" (click)="onDeleteGameClick()">
        Delete game
      </button>
      <button class="bg-game-start-button" mat-button
        color="accent" [disabled]="!(validPlayers$ | async)"
        (click)="onStartGameClick()">
        Start game
      </button>
    </div>
  `,
  styles: [`
    .bg-players {
      display: flex;
      flex-direction: column;
      bg-home-player-form {
        width: 100%;
      }
    }
    
    .bg-game-start-button {
      margin-left: auto !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
@UntilDestroy
export class BgHomeRoomDialogComponent<Pid extends string> implements OnInit, OnDestroy {

  constructor (
    private dialogRef: MatDialogRef<BgHomeRoomDialogComponent<Pid>, BgRoomDialogOutput>,
    @Inject (MAT_DIALOG_DATA) private input: BgRoomDialogInput<Pid>,
    private protoGameService: BgProtoGameService
  ) {}

  onlineGame = this.input.protoGame.online;
  game = this.input.protoGame;
  playerTrackBy: TrackByFunction<BgProtoPlayer<Pid>> = (index, player) => index;
  private $players = new BehaviorSubject<BgProtoPlayer<Pid>[]> ([]);
  players$ = this.$players.asObservable ();

  roleToCssClass = (role: Pid) => this.input.playerIdToCssClass (role);

  validPlayers$ = this.players$.pipe (
    map ((players) => {
      let nPlayers = 0;
      for (const player of players) {
        switch (player.type) {
          case "user":
            if (!player.name || !player.ready) { return false; }
            nPlayers++;
            break;
          case "ai":
            if (!player.name) { return false; }
            nPlayers++;
            break;
          case "open":
            return false;
        }
      }
      if (nPlayers < 2) { return false; }
      return true;
    })
  );

  @ChangeListener ()
  private listenToPlayersChange () {
    return this.protoGameService.selectProtoPlayers$<Pid> (this.game.id)
      .pipe (tap (protoPlayers => this.$players.next (protoPlayers)));
  }

  @ChangeListener ()
  private listenToGameStart () {
    return this.protoGameService.selectProtoGame$ (this.game.id).pipe (
      filter ((game) => game?.state === "running"),
      tap (() => this.closeDialog (true))
    );
  }

  ngOnInit () {
    this.listenToPlayersChange ();
    this.listenToGameStart ();
  }

  ngOnDestroy () {}

  @ConcatingEvent ()
  onPlayerChange (player: BgProtoPlayer<string>, playerId: string) {
    return this.protoGameService.updateProtoPlayer$ (player, playerId, this.game.id);
  }

  @ExhaustingEvent ()
  onStartGameClick () {
    if (this.game.state === "open") {
      const protoPlayers = this.$players.getValue ();
      return this.input.createGame$ (this.game, protoPlayers)
        .pipe (tap (() => this.closeDialog (true)));
    } else {
      this.closeDialog (true);
      return of (void 0);
    }
  }

  private closeDialog (startGame: boolean) {
    this.dialogRef.close ({
      startGame: startGame,
      gameId: this.game.id,
    });
  }

  @ExhaustingEvent ()
  onDeleteGameClick () {
    return this.input.deleteGame$ (this.game.id)
      .pipe (tap (() => this.closeDialog (false)));
  }

}

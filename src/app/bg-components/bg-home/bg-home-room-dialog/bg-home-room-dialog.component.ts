import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BgProtoGame, BgProtoGameService, BgProtoPlayer } from "@bg-services";
import { ChangeListener, ConcatingEvent, ExhaustingEvent, UntilDestroy } from "@bg-utils";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";

export interface BgRoomDialogInput {
  protoGame: BgProtoGame;
  createGame$: (protoGame: BgProtoGame, protoPlayers: BgProtoPlayer[]) => Observable<void>;
  deleteGame$: (gameId: string) => Observable<void>;
} // BgRoomDialogInput

export interface BgRoomDialogOutput {
  gameId: string;
  startGame: boolean;
} // BgRoomDialogOutput

@Component({
  selector: 'bg-home-room-dialog',
  templateUrl: './bg-home-room-dialog.component.html',
  styleUrls: ['./bg-home-room-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BgHomeRoomDialogComponent implements OnInit, OnDestroy {

  constructor (
    private dialogRef: MatDialogRef<BgHomeRoomDialogComponent, BgRoomDialogOutput>,
    @Inject (MAT_DIALOG_DATA) private input: BgRoomDialogInput,
    private protoGameService: BgProtoGameService
  ) { }

  onlineGame = this.input.protoGame.online;
  game = this.input.protoGame;
  playerTrackBy: TrackByFunction<BgProtoPlayer> = (index, player) => index;
  private $players = new BehaviorSubject<BgProtoPlayer[]> ([]);
  players$ = this.$players.asObservable ();

  validPlayers$ = this.players$.pipe (map (players => {
    let nPlayers = 0;
    for (const player of players) {
      switch (player.type) {
        case "me":
        case "other": if (!player.name || !player.ready) { return false; } nPlayers++; break;
        case "ai": if (!player.name) { return false; } nPlayers++; break;
        case "open": return false;
      } // switch
    } // while
    if (nPlayers < 2) { return false; }
    return true;
  }));

  @ChangeListener ()
  private listenToPlayersChange () {
    return this.protoGameService.selectProtoPlayers$ (this.game.id).pipe (
      tap (protoPlayers => this.$players.next (protoPlayers))
    );
  } // listenToPlayersChange
  
  ngOnInit () {
    this.listenToPlayersChange ();
  } // ngOnInit

  ngOnDestroy () { }

  @ConcatingEvent ()
  onPlayerChange (player: BgProtoPlayer, playerId: string) {
    return this.protoGameService.updateProtoPlayer$ (player, playerId, this.game.id);
  } // onPlayerChange

  @ExhaustingEvent ()
  onStartGameClick () {
    if (this.game.state === "open") {
      const protoPlayers = this.$players.getValue ();
      return this.input.createGame$ (this.game, protoPlayers).pipe (
        tap (() => this.closeDialog (true))
      );
    } else {
      this.closeDialog (true);
      return of (void 0);
    } // if - else
  } // onStartGameClick

  private closeDialog (startGame: boolean) {
    this.dialogRef.close ({
      startGame: startGame,
      gameId: this.game.id,
    });
  } // closeDialog

  @ExhaustingEvent ()
  onDeleteGameClick () {
    return this.input.deleteGame$ (this.game.id).pipe (
      tap (() => this.closeDialog (false))
    );
  } // onDeleteGameClick

}

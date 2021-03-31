import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConcatingEvent, ExhaustingEvent, InitEvent, UntilDestroy } from "@bg-utils";
import { forkJoin, of } from "rxjs";
import { first, map, switchMap, tap } from "rxjs/operators";
import { ABgRoomDialogInput, ABgRoomDialogOutput } from "src/app/bg-components/bg-home";
import { ABgProtoPlayerType, BgProtoGameService } from "src/app/bg-services/bg-proto-game.service";
import { BritColor } from "../../brit.models";
import { BritProtoPlayer } from "../brit-home.models";

@Component ({
  selector: "brit-room-dialog",
  templateUrl: "./brit-room-dialog.component.html",
  styleUrls: ["./brit-room-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BritRoomDialogComponent implements OnInit, OnDestroy {

  constructor (
    private dialogRef: MatDialogRef<BritRoomDialogComponent, ABgRoomDialogOutput>,
    @Inject (MAT_DIALOG_DATA) private data: ABgRoomDialogInput,
    private protoGameService: BgProtoGameService
  ) { }

  onlineGame = this.data.protoGame.online;
  game = this.data.protoGame;
  playerTrackBy = (index: number, player: BritProtoPlayer) => index;

  players$ = this.protoGameService.selectProtoPlayers$ (this.game.id);
  validPlayers$ = this.players$.pipe (map (players => false));

  @InitEvent ()
  ngOnInit () {
    return this.players$.pipe (
      first (),
      switchMap (players => {
        if (players && players.length) {
          return of (void 0);
        } else {
          return forkJoin ([
            this.insertProtoPlayer$ ("1", "yellow"),
            this.insertProtoPlayer$ ("2", "blue"),
            this.insertProtoPlayer$ ("3", "red"),
            this.insertProtoPlayer$ ("4", "green")
          ]);
        } // if - else
      })
    );
  } // ngOnInit

  private insertProtoPlayer$ (id: string, color: BritColor) {
    const player: BritProtoPlayer = {
      id: id,
      color: color,
      name: "",
      controller: null,
      type: "closed"
    };
    return this.protoGameService.insertProtoPlayer$ (player, this.game.id);
  } // insertProtoPlayer$

  ngOnDestroy () { }

  @ConcatingEvent ()
  onPlayerChange (player: BritProtoPlayer, playerId: string) {
    return this.protoGameService.updateProtoPlayer$ (player, playerId, this.game.id);
  } // onPlayerChange

  @ConcatingEvent ()
  onNextPlayerType (currentType: ABgProtoPlayerType, playerId: string) {
    const nextPlayerType = this.getNextPlayerType (currentType);
    return this.protoGameService.updateProtoPlayer$ ({ type: nextPlayerType }, playerId, this.game.id);
  } // onNextPlayerType

  private getNextPlayerType (currentType: ABgProtoPlayerType): ABgProtoPlayerType {
    switch (currentType) {
      case "closed": return "me";
      case "me": return this.onlineGame ? "open" : "ai";
      case "open": return "ai";
      case "ai": return "closed";
      case "other": return "closed";
    } // switch
  } // getNextPlayerType

  onStartGameClick () {
    this.dialogRef.close ({
      startGame: true,
      gameId: this.game.id,
      deleteGame: false
    });
  } // onStartGameClick

  @ExhaustingEvent ()
  onDeleteGameClick () {
    return forkJoin ([
      this.protoGameService.deleteProtoPlayer$ ("1", this.game.id),
      this.protoGameService.deleteProtoPlayer$ ("2", this.game.id),
      this.protoGameService.deleteProtoPlayer$ ("3", this.game.id),
      this.protoGameService.deleteProtoPlayer$ ("4", this.game.id)
    ]).pipe (
      tap (() => {
        this.dialogRef.close ({
          startGame: false,
          gameId: this.game.id,
          deleteGame: true
        });
      })
    );
  } // onDeleteGameClick

} // BritRoomDialogComponent

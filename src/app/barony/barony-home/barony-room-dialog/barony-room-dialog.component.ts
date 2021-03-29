import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BgAuthService, BgUser } from "@bg-services";
import { ConcatingEvent, InitEvent, UntilDestroy } from "@bg-utils";
import { forkJoin, of } from "rxjs";
import { first, map, switchMap } from "rxjs/operators";
import { ABgRoomDialogInput, ABgRoomDialogOutput } from "src/app/bg-components/bg-home";
import { ABgProtoPlayerType, BgProtoGameService } from "src/app/bg-services/bg-proto-game.service";
import { BaronyColor } from "../../models";
import { BaronyProtoPlayer } from "../barony-home.models";

@Component ({
  selector: "barony-room-dialog",
  templateUrl: "./barony-room-dialog.component.html",
  styleUrls: ["./barony-room-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BaronyRoomDialogComponent implements OnInit, OnDestroy {

  constructor (
    private dialogRef: MatDialogRef<BaronyRoomDialogComponent, ABgRoomDialogOutput>,
    @Inject (MAT_DIALOG_DATA) private data: ABgRoomDialogInput,
    private protoGameService: BgProtoGameService,
    private authService: BgAuthService
  ) { }

  onlineGame = this.data.protoGame.online;
  game = this.data.protoGame;
  playerTrackBy = (index: number, player: BaronyProtoPlayer) => index;

  players$ = this.protoGameService.seletProtoPlayers$<BaronyProtoPlayer> (this.game.id);
  validPlayers$ = this.players$.pipe (map (players => {
    let nPlayers = 0;
    players.forEach (p => {

    });
  }));

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

  private insertProtoPlayer$ (id: string, color: BaronyColor) {
    const player: BaronyProtoPlayer = {
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
  onPlayerChange (player: BaronyProtoPlayer, playerId: string) {
    return this.protoGameService.updateProtoPlayer$ (player, playerId, this.game.id);
  } // onPlayerChange

  @ConcatingEvent ()
  onNextPlayerType (currentType: ABgProtoPlayerType, playerId: string) {
    const nextPlayerType = this.getNextPlayerType (currentType);
    const controllerPatch: { controller?: BgUser | null } = { };
    if (nextPlayerType === "me") {
      controllerPatch.controller = this.authService.getUser ();
    } else if (nextPlayerType !== "other") {
      controllerPatch.controller = null;
    } // if - else
    const namePatch: { name?: string | "" } = { };
    if (nextPlayerType === "me") {
      namePatch.name = this.authService.getUser ().displayName;
    } else if (nextPlayerType === "closed") {
      namePatch.name = "";
    } else if (nextPlayerType === "ai") {
      namePatch.name = "AI";
    } // if - else
    return this.protoGameService.updateProtoPlayer$ ({
      type: nextPlayerType,
      ...controllerPatch,
      ...namePatch
    }, playerId, this.game.id);
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

  onDeleteGameClick () {
    this.dialogRef.close ({
      startGame: false,
      gameId: this.game.id,
      deleteGame: true
    });
  } // onDeleteGameClick

} // BaronyRoomDialogComponent

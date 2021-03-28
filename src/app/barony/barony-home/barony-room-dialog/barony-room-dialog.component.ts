import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BgAuthService } from "@bg-services";
import { BaronyGameDoc } from "../../barony-remote.service";
import { BaronyNewPlayer } from "../barony-home.models";

export interface BaronyRoomDialogInput {
  game: BaronyGameDoc;
} // BaronyRoomDialogInput

export interface BaronyRoomDialogOutput {
  nPlayers?: number;
  deleteGame?: boolean;
  startGame?: boolean;
  gameId: string;
} // BaronyRoomDialogOutput

@Component ({
  selector: "barony-room-dialog",
  templateUrl: "./barony-room-dialog.component.html",
  styleUrls: ["./barony-room-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyRoomDialogComponent implements OnInit {

  constructor (
    private dialogRef: MatDialogRef<BaronyRoomDialogComponent, BaronyRoomDialogOutput>,
    @Inject (MAT_DIALOG_DATA) private data: BaronyRoomDialogInput,
    private authService: BgAuthService
  ) { }

  localGame = this.data.game.local;
  game = this.data.game;
  players: BaronyNewPlayer[] = [
    { userId: null, name: "", color: "blue", type: "closed" },
    { userId: null, name: "", color: "red", type: "closed" },
    { userId: null, name: "", color: "green", type: "closed" },
    { userId: null, name: "", color: "yellow", type: "closed" },
  ];

  ngOnInit (): void {
  } // ngOnInit

  onStartGameClick () {
    this.dialogRef.close ({
      gameId: this.data.game.id,
      startGame: true,
      nPlayers: 4
    });
  } // onStartGameClick

  onDeleteGameClick () {
    this.dialogRef.close ({
      gameId: this.data.game.id,
      deleteGame: true
    });
  } // onDeleteGameClick

} // BaronyRoomDialogComponent

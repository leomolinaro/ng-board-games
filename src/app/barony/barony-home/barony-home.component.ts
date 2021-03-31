import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BgHomeConfig } from "@bg-components/home";
import { forkJoin, from } from "rxjs";
import { BaronyRemoteService } from "../barony-remote.service";
import { BaronyArcheoGameFormComponent } from "./barony-archeo-game-form/barony-archeo-game-form.component";
import { BaronyArcheoGame } from "./barony-home.models";
import { BaronyRoomDialogComponent } from "./barony-room-dialog/barony-room-dialog.component";

@Component ({
  selector: "barony-home",
  templateUrl: "./barony-home.component.html",
  styleUrls: ["./barony-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyHomeComponent implements OnInit {

  constructor (
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private gameService: BaronyRemoteService
  ) { }

  config: BgHomeConfig = {
    boardGame: "barony",
    boardGameName: "Barony",
    archeoGameForm: BaronyArcheoGameFormComponent,
    roomDialog: BaronyRoomDialogComponent,
    isGameValid: (game: BaronyArcheoGame) => !!game.name,
    getDefaultGame: () => ({
      name: "",
      online: false
    }),
    startGame$: (gameId: string) => from (this.router.navigate (["game", gameId], { relativeTo: this.activatedRoute })),
    deleteGame$: (gameId: string) => forkJoin ([
      this.gameService.deleteStories$ (gameId),
      this.gameService.deleteLands$ (gameId),
      this.gameService.deletePlayers$ (gameId),
      this.gameService.deleteGame$ (gameId)
    ])
  };

  ngOnInit (): void {
  } // ngOnInit

} // BaronyHomeComponent

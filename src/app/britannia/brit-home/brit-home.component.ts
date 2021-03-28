import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { from } from "rxjs";
import { BgHomeConfig } from "src/app/bg-home/bg-home.component";
import { BritArcheoGameFormComponent } from "./brit-archeo-game-form/brit-archeo-game-form.component";
import { BritArcheoGame } from "./brit-home.models";
import { BritRoomDialogComponent } from "./brit-room-dialog/brit-room-dialog.component";

@Component ({
  selector: "brit-home",
  templateUrl: "./brit-home.component.html",
  styleUrls: ["./brit-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritHomeComponent implements OnInit {

  constructor (
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  config: BgHomeConfig = {
    boardGame: "britannia",
    boardGameName: "Britannia",
    archeoGameForm: BritArcheoGameFormComponent,
    roomDialog: BritRoomDialogComponent,
    isGameValid: (game: BritArcheoGame) => !!game.name,
    getDefaultGame: () => ({
      name: "",
      online: false
    }),
    startGame$: (gameId: string) => from (this.router.navigate (["game", gameId], { relativeTo: this.activatedRoute }))
  };

  ngOnInit (): void {
  } // ngOnInit

} // BritHomeComponent

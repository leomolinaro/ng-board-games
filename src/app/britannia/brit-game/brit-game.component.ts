import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BritPlayer } from "../brit-models";
import { BritGameService } from "./brit-game.service";
import { BritGameStore } from "./brit-game.store";

@Component ({
  selector: "brit-game",
  templateUrl: "./brit-game.component.html",
  styleUrls: ["./brit-game.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    BritGameStore,
    // BaronyUiStore,
    // BaronyPlayerAiService,
    // BaronyPlayerLocalService,
    BritGameService
  ]
})
export class BritGameComponent implements OnInit {

  constructor (
    private game: BritGameStore,
    // private ui: BaronyUiStore,
    // private remote: BaronyRemoteService,
    // private route: ActivatedRoute,
    // private authService: BgAuthService,
    private gameService: BritGameService
  ) { }

  ngOnInit (): void {

    const players: BritPlayer[] = [];
    // this.game.setInitialState (
    //   players,
    //   nations
    // );

  } // ngOnInit

} // BritGameComponent

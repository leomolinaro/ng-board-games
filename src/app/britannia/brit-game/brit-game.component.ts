import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { arrayUtil } from "@bg-utils";
import { BritPlayer } from "../brit-models";
import { BritGameService } from "./brit-game.service";
import { BritGameStore } from "./brit-game.store";
import * as britRules from "./brit-rules";

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

  areas$ = this.game.selectAreas$ ();

  ngOnInit (): void {

    const players: BritPlayer[] = [];
    const nations = britRules.createNationsAndUnits ();
    const areas = britRules.createAreas ();
    this.game.setInitialState (
      players,
      nations.map (n => n.nation),
      areas,
      arrayUtil.flattify (nations.map (n => n.units)),
      "",
      null as any
    );

  } // ngOnInit

} // BritGameComponent

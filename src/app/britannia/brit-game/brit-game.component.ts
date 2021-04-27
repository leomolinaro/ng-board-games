import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BgAuthService, BgUser } from "@bg-services";
import { arrayUtil, InitEvent, UntilDestroy } from "@bg-utils";
import { forkJoin } from "rxjs";
import { tap } from "rxjs/operators";
import { ABritPlayer, BritPlayer } from "../brit-models";
import { BritPlayerDoc, BritRemoteService } from "../brit-remote.service";
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
    // BritUiStore,
    // BritPlayerAiService,
    // BritPlayerLocalService,
    BritGameService
  ]
})
@UntilDestroy
export class BritGameComponent implements OnInit, OnDestroy {

  constructor (
    private game: BritGameStore,
    // private ui: BritUiStore,
    private remote: BritRemoteService,
    private route: ActivatedRoute,
    private authService: BgAuthService,
    private gameService: BritGameService
  ) { }

  private gameId: string = this.route.snapshot.paramMap.get ("gameId")!;

  areas$ = this.game.selectAreas$ ();
  players$ = this.game.selectPlayers$ ();

  @InitEvent ()
  ngOnInit () {
    return forkJoin ([
      this.remote.getGame$ (this.gameId),
      this.remote.getPlayers$ (this.gameId, ref => ref.orderBy ("sort")),
      this.remote.getStories$ (this.gameId, ref => ref.orderBy ("id"))
    ]).pipe (
      tap (([
        game,
        players,
        stories
      ]) => {
        const user = this.authService.getUser ();
        const nations = britRules.createNationsAndUnits ();
        const areas = britRules.createAreas ();
        this.game.setInitialState (
          players.map (p => this.playerDocToPlayer (p, user)),
          nations.map (n => n.nation),
          areas,
          arrayUtil.flattify (nations.map (n => n.units)),
          "",
          null as any
        );
      })
    );
  } // ngOnInit

  private playerDocToPlayer (playerDoc: BritPlayerDoc, user: BgUser): BritPlayer {
    if (playerDoc.isAi) {
      return {
        ...this.playerDocToAPlayerInit (playerDoc),
        isAi: true,
        isLocal: false,
        isRemote: false
      };
    } else {
      return {
        ...this.playerDocToAPlayerInit (playerDoc),
        isAi: false,
        controller: playerDoc.controller,
        isLocal: user.id === playerDoc.controller.id,
        isRemote: user.id !== playerDoc.controller.id
      };
    } // if - else
  } // playerDocToPlayer

  private playerDocToAPlayerInit (playerDoc: BritPlayerDoc): ABritPlayer {
    return {
      id: playerDoc.id,
      color: playerDoc.color,
      name: playerDoc.name,
      nations: britRules.getNationIdsOfColor (playerDoc.color)
    };
  } // playerDocToAPlayerInit

  ngOnDestroy () { }

} // BritGameComponent

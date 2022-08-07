import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BgAuthService, BgUser } from "@bg-services";
import { arrayUtil, ChangeListener, SingleEvent, UntilDestroy } from "@bg-utils";
import { forkJoin } from "rxjs";
import { tap } from "rxjs/operators";
import { ABritPlayer, BritAreaId, BritPlayer, BritUnitId } from "../brit-models";
import { BritPlayerDoc, BritRemoteService, BritStoryDoc } from "../brit-remote.service";
import { BritGameService } from "./brit-game.service";
import { BritGameStore } from "./brit-game.store";
import { BritPlayerAiService } from "./brit-player-ai.service";
import { BritPlayerLocalService } from "./brit-player-local.service";
import * as britRules from "./brit-rules";
import { BritUiStore } from "./brit-ui.store";

@Component ({
  selector: "brit-game",
  templateUrl: "./brit-game.component.html",
  styleUrls: ["./brit-game.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    BritGameStore,
    BritUiStore,
    BritPlayerAiService,
    BritPlayerLocalService,
    BritGameService
  ]
})
@UntilDestroy
export class BritGameComponent implements OnInit, OnDestroy {

  constructor (
    private game: BritGameStore,
    private ui: BritUiStore,
    private remote: BritRemoteService,
    private route: ActivatedRoute,
    private authService: BgAuthService,
    private gameService: BritGameService
  ) { }

  private gameId: string = this.route.snapshot.paramMap.get ("gameId")!;

  areas$ = this.game.selectAreas$ ();
  nations$ = this.game.selectNations$ ();
  nationsMap$ = this.game.selectNationsMap$ ();
  rounds$ = this.game.selectRounds$ ();
  unitsMap$ = this.game.selectUnitsMap$ ();
  players$ = this.game.selectPlayers$ ();
  logs$ = this.game.selectLogs$ ();
  // endGame$ = this.game.selectEndGame$ ();

  turnPlayer$ = this.ui.selectTurnPlayer$ ();
  currentPlayer$ = this.ui.selectCurrentPlayer$ ();
  // players$ = this.ui.selectPlayers$ ();
  message$ = this.ui.selectMessage$ ();
  validAreas$ = this.ui.selectValidAreas$ ();
  validUnits$ = this.ui.selectValidUnits$ ();
  // validActions$ = this.ui.selectValidActions$ ();
  // validBuildings$ = this.ui.selectValidBuildings$ ();
  // validResources$ = this.ui.selectValidResources$ ();
  // canPass$ = this.ui.selectCanPass$ ();
  // canCancel$ = this.ui.selectCanCancel$ ();
  // maxNumberOfKnights$ = this.ui.selectMaxNumberOfKnights$ ();

  @SingleEvent ()
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
        if (game) {
          const user = this.authService.getUser ();
          const nations = britRules.createNationsAndUnits ();
          const areas = britRules.createAreas ();
          const rounds = britRules.createRounds ();
          this.game.setInitialState (
            players.map (p => this.playerDocToPlayer (p, user)),
            nations.map (n => n.nation),
            areas,
            arrayUtil.flattify (nations.map (n => n.units)),
            rounds,
            this.gameId,
            game.owner
          );
          this.listenToGame (stories);
        } // if
      })
    );
  } // ngOnInit

  @ChangeListener ()
  private listenToGame (stories: BritStoryDoc[]) {
    return this.gameService.game$ (stories);
  } // listenToGame

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
      nations: britRules.getNationIdsOfColor (playerDoc.color),
      score: 0
    };
  } // playerDocToAPlayerInit

  ngOnDestroy () { }

  // onPlayerSelect (player: BaronyPlayer) { this.ui.setCurrentPlayer (player.id); }
  // onBuildingSelect (building: BaronyBuilding) { this.ui.buildingChange (building); }
  onAreaClick (areaId: BritAreaId) { this.ui.areaChange (areaId); }
  onUnitClick (unitId: BritUnitId) { this.ui.unitChange (unitId); }
  // onActionClick (action: BaronyAction) { this.ui.actionChange (action); }
  // onPassClick () { this.ui.passChange (); }
  // onCancelClick () { this.ui.cancelChange (); }
  // onKnightsConfirm (numberOfKnights: number) { this.ui.numberOfKnightsChange (numberOfKnights); }
  // onResourceSelect (resource: BaronyResourceType) { this.ui.resourceChange (resource); }

} // BritGameComponent

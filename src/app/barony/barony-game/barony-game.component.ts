import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BgAuthService } from "@bg-services";
import { subscribeTo, UntilDestroy } from "@bg-utils";
import { forkJoin } from "rxjs";
import { tap } from "rxjs/operators";
import { BaronyRemoteService } from "../barony-remote.service";
import { BaronyGameStore } from "../logic";
import { BaronyAction, BaronyBuilding, BaronyLand, BaronyPlayer, BaronyResourceType } from "../models";
import { BaronyGameService } from "./barony-game.service";
import { BaronyPlayerAiService } from "./barony-player-ai.service";
import { BaronyPlayerLocalService } from "./barony-player-local.service";
import { BaronyPlayerObserverService } from "./barony-player-observer.service";
import { BaronyUiStore } from "./barony-ui.store";

@Component ({
  selector: "barony-game",
  templateUrl: "./barony-game.component.html",
  styleUrls: ["./barony-game.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    BaronyGameStore,
    BaronyUiStore,
    BaronyPlayerAiService,
    BaronyPlayerLocalService,
    BaronyPlayerObserverService,
    BaronyGameService
  ]
})
@UntilDestroy
export class BaronyGameComponent implements OnInit, OnDestroy {

  constructor (
    private game: BaronyGameStore,
    private ui: BaronyUiStore,
    private service: BaronyGameService,
    private remote: BaronyRemoteService,
    private route: ActivatedRoute,
    private authService: BgAuthService
  ) { }

  private gameId = this.route.snapshot.paramMap.get ("gameId") as string;

  lands$ = this.game.selectLands$ ();
  logs$ = this.game.selectLogs$ ();
  turnPlayer$ = this.ui.selectTurnPlayer$ ();
  currentPlayer$ = this.ui.selectCurrentPlayer$ ();
  otherPlayers$ = this.ui.selectOtherPlayers$ ();
  message$ = this.ui.selectMessage$ ();
  validLands$ = this.ui.selectValidLands$ ();
  validActions$ = this.ui.selectValidActions$ ();
  validBuildings$ = this.ui.selectValidBuildings$ ();
  validResources$ = this.ui.selectValidResources$ ();
  canPass$ = this.ui.selectCanPass$ ();
  canCancel$ = this.ui.selectCanCancel$ ();
  maxNumberOfKnights$ = this.ui.selectMaxNumberOfKnights$ ();

  ngOnInit (): void {
    subscribeTo (forkJoin ([
      this.remote.getGame$ (this.gameId),
      this.remote.getPlayers$ (this.gameId),
      this.remote.getLands$ (this.gameId),
      this.remote.getStories$ (this.gameId)
    ]).pipe (
      tap (([game, players, lands, stories]) => {
        if (game) {
          this.game.setInitialState (
            players.map (p => ({
              id: p.id,
              color: p.color,
              isAi: p.isAi,
              name: p.name,
              isRemote: !!p.userId && !this.authService.isUserId (p.userId),
              score: 0,
              pawns: {
                city: 5,
                stronghold: 2,
                knight: 7,
                village: 14
              },
              resources: {
                forest: 0,
                mountain: 0,
                plain: 0,
                fields: 0
              }
            })),
            lands.map (l => ({
              id: l.id,
              coordinates: l.coordinates,
              type: l.type,
              pawns: []
            })),
            this.gameId,
          );
          subscribeTo (this.service.resolveTasks$ (stories), this);
        } // if
      })
    ), this);
  } // ngOnInit

  ngOnDestroy () {
  } // ngOnDestroy

  onPlayerSelect (player: BaronyPlayer) { this.ui.setCurrentPlayer (player.id); }
  onBuildingSelect (building: BaronyBuilding) { this.ui.buildingChange (building); }
  onLandTileClick (landTile: BaronyLand) { this.ui.landTileChange (landTile); }
  onActionClick (action: BaronyAction) { this.ui.actionChange (action); }
  onPassClick () { this.ui.passChange (); }
  onCancelClick () { this.ui.cancelChange (); }
  onKnightsConfirm (numberOfKnights: number) { this.ui.numberOfKnightsChange (numberOfKnights); }
  onResourceSelect (resource: BaronyResourceType) { this.ui.resourceChange (resource); }

} // BaronyGameComponent

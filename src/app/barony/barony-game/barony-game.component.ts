import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BgAuthService, BgUser } from "@bg-services";
import { ChangeListener, InitEvent, UntilDestroy } from "@bg-utils";
import { forkJoin } from "rxjs";
import { tap } from "rxjs/operators";
import { ABaronyPlayer, BaronyAction, BaronyBuilding, BaronyLand, BaronyLandCoordinates, BaronyPlayer, BaronyResourceType, landCoordinatesToId } from "../barony-models";
import { BaronyPlayerDoc, BaronyRemoteService, BaronyStoryDoc } from "../barony-remote.service";
import { BaronyGameService } from "./barony-game.service";
import { BaronyGameStore } from "./barony-game.store";
import { BaronyPlayerAiService } from "./barony-player-ai.service";
import { BaronyPlayerLocalService } from "./barony-player-local.service";
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
    BaronyGameService
  ]
})
@UntilDestroy
export class BaronyGameComponent implements OnInit, OnDestroy {

  constructor (
    private game: BaronyGameStore,
    private ui: BaronyUiStore,
    private remote: BaronyRemoteService,
    private route: ActivatedRoute,
    private authService: BgAuthService,
    private gameService: BaronyGameService
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

  @InitEvent ()
  ngOnInit () {
    return forkJoin ([
      this.remote.getGame$ (this.gameId),
      this.remote.getPlayers$ (this.gameId, ref => ref.orderBy ("sort")),
      this.remote.getMap$ (this.gameId),
      this.remote.getStories$ (this.gameId, ref => ref.orderBy ("id"))
    ]).pipe (
      tap (([
        game,
        players,
        baronyMap,
        stories
      ]) => {
        if (game && baronyMap) {
          const user = this.authService.getUser ();
          this.game.setInitialState (
            players.map (p => this.playerDocToPlayerInit (p, user)),
            baronyMap.lands.map (l => {
              const x = l.x;
              const y = l.y;
              const z = -1 * (x + y);
              const coordinates: BaronyLandCoordinates = { x, y, z };
              return {
                id: landCoordinatesToId (coordinates),
                coordinates: coordinates,
                type: l.type,
                pawns: []
              };
            }),
            this.gameId,
            game.owner
          );
          this.listenToTasks (stories);
        } // if
      })
    );
  } // ngOnInit

  @ChangeListener ()
  private listenToTasks (stories: BaronyStoryDoc[]) {
    return this.gameService.game$ (stories);
  } // listenToTasks

  private playerDocToPlayerInit (playerDoc: BaronyPlayerDoc, user: BgUser): BaronyPlayer {
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
  } // playerDocToPlayerInit

  private playerDocToAPlayerInit (playerDoc: BaronyPlayerDoc): ABaronyPlayer {
    return {
      id: playerDoc.id,
      color: playerDoc.color,
      name: playerDoc.name,
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
    };
  } // playerDocToAPlayerInit

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

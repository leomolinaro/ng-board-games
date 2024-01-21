import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ChangeListener, SingleEvent, UntilDestroy } from "@leobg/commons/utils";
import { tap } from "rxjs/operators";
import {
  BaronyAction,
  BaronyBuilding,
  BaronyLand,
  BaronyPlayer,
  BaronyResourceType,
} from "../barony-models";
import { BaronyStoryDoc } from "../barony-remote.service";
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
    BaronyGameService,
  ],
})
@UntilDestroy
export class BaronyGameComponent implements OnInit, OnDestroy {
  constructor (
    private game: BaronyGameStore,
    private ui: BaronyUiStore,
    private route: ActivatedRoute,
    private gameService: BaronyGameService
  ) {}

  private gameId = this.route.snapshot.paramMap.get ("gameId") as string;

  lands$ = this.game.selectLands$ ();
  logs$ = this.game.selectLogs$ ();
  endGame$ = this.game.selectEndGame$ ();

  turnPlayer$ = this.ui.selectTurnPlayer$ ();
  currentPlayer$ = this.ui.selectCurrentPlayer$ ();
  players$ = this.ui.selectPlayers$ ();
  message$ = this.ui.selectMessage$ ();
  validLands$ = this.ui.selectValidLands$ ();
  validActions$ = this.ui.selectValidActions$ ();
  validBuildings$ = this.ui.selectValidBuildings$ ();
  validResources$ = this.ui.selectValidResources$ ();
  canPass$ = this.ui.selectCanPass$ ();
  canCancel$ = this.ui.selectCanCancel$ ();
  maxNumberOfKnights$ = this.ui.selectMaxNumberOfKnights$ ();

  @SingleEvent ()
  ngOnInit () {
    return this.gameService.loadGame$ (this.gameId)
      .pipe (tap ((stories) => this.listenToGame (stories)));
  } // ngOnInit

  @ChangeListener ()
  private listenToGame (stories: BaronyStoryDoc[]) {
    return this.gameService.game$ (stories);
  } // listenToGame

  ngOnDestroy () {} // ngOnDestroy

  onPlayerSelect (player: BaronyPlayer) {
    this.ui.setCurrentPlayer (player.id);
  }
  onBuildingSelect (building: BaronyBuilding) {
    this.ui.buildingChange (building);
  }
  onLandTileClick (landTile: BaronyLand) {
    this.ui.landTileChange (landTile);
  }
  onActionClick (action: BaronyAction) {
    this.ui.actionChange (action);
  }
  onPassClick () {
    this.ui.passChange ();
  }
  onCancelClick () {
    this.ui.cancelChange ();
  }
  onKnightsConfirm (numberOfKnights: number) {
    this.ui.numberOfKnightsChange (numberOfKnights);
  }
  onResourceSelect (resource: BaronyResourceType) {
    this.ui.resourceChange (resource);
  }
} // BaronyGameComponent

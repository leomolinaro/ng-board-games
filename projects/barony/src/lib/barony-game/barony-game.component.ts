import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UntilDestroy } from "@leobg/commons/utils";
import { firstValueFrom } from "rxjs";
import { BaronyBoardComponent } from "../barony-board/barony-board.component";
import {
  BaronyAction,
  BaronyBuilding,
  BaronyLand,
  BaronyPlayer,
  BaronyResourceType,
} from "../barony-models";
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
  imports: [BaronyBoardComponent, AsyncPipe]
})
@UntilDestroy
export class BaronyGameComponent implements OnInit, OnDestroy {
  
  private game = inject (BaronyGameStore);
  private ui = inject (BaronyUiStore);
  private route = inject (ActivatedRoute);
  private gameService = inject (BaronyGameService);

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

  async ngOnInit () {
    const stories = await firstValueFrom (this.gameService.loadGame$ (this.gameId));
    await this.gameService.game (stories);
  } // ngOnInit

  ngOnDestroy () {} // ngOnDestroy

  onPlayerSelect (player: BaronyPlayer) { this.ui.setCurrentPlayer (player.id); }
  onBuildingSelect (building: BaronyBuilding) { this.ui.buildingChange (building); }
  onLandTileClick (landTile: BaronyLand) { this.ui.landTileChange (landTile); }
  onActionClick (action: BaronyAction) { this.ui.actionChange (action); }
  onPassClick () { this.ui.passChange (); }
  onCancelClick () { this.ui.cancelChange (); }
  onKnightsConfirm (numberOfKnights: number) { this.ui.numberOfKnightsChange (numberOfKnights); }
  onResourceSelect (resource: BaronyResourceType) { this.ui.resourceChange (resource); }
  
} // BaronyGameComponent

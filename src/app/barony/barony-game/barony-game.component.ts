import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { BaronyGameService } from "./barony-game.service";
import { BaronyPlayer, BaronyBuilding, BaronyLand, BaronyAction, BaronyResourceType } from "../models";
import { BaronyUiStore } from "./barony-ui.store";
import { BaronyContext } from "../logic";

@Component ({
  selector: "barony-game",
  templateUrl: "./barony-game.component.html",
  styleUrls: ["./barony-game.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BaronyContext, BaronyUiStore, BaronyGameService]
})
export class BaronyGameComponent implements OnInit, OnDestroy {

  constructor (
    private context: BaronyContext,
    private ui: BaronyUiStore,
    private service: BaronyGameService
  ) {
  } // constructor

  lands$ = this.context.selectLands$ ();
  logs$ = this.context.selectLogs$ ();
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

  resolveTasksSubscription!: Subscription;

  ngOnInit (): void {
    this.ui.setCurrentPlayer ("leo");
    this.ui.setAiPlayers (["nico", "rob", "salvatore"]);
    this.resolveTasksSubscription = this.service.resolveTasks$ ().subscribe ();
  } // ngOnInit

  ngOnDestroy () {
    this.resolveTasksSubscription.unsubscribe ();
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

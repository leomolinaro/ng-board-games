import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { BaronyAction, BaronyBuilding, BaronyLand, BaronyPawnType, BaronyPlayer, BaronyResourceType } from "../models";
import { BaronyBoardService } from "./barony-board.service";

@Component ({
  selector: "barony-board",
  templateUrl: "./barony-board.component.html",
  styleUrls: ["./barony-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyBoardComponent implements OnInit, OnDestroy {

  constructor (
    private service: BaronyBoardService
  ) { }

  lands$ = this.service.selectLands$ ();
  currentPlayer$ = this.service.selectCurrentPlayer$ ();
  otherPlayers$ = this.service.selectOtherPlayers$ ();
  message$ = this.service.selectMessage$ ();
  validLands$ = this.service.selectValidLands$ ();
  validActions$ = this.service.selectValidActions$ ();
  validBuildings$ = this.service.selectValidBuildings$ ();
  validResources$ = this.service.selectValidResources$ ();
  canPass$ = this.service.selectCanPass$ ();
  canCancel$ = this.service.selectCanCancel$ ();
  maxNumberOfKnights$ = this.service.selectMaxNumberOfKnights$ ().pipe (tap (max => this.numberOfKnights = max ? max : 0));

  numberOfKnights = 1;

  resolveTasksSubscription!: Subscription;

  playerTrackBy = (player: BaronyPlayer) => player.id;

  ngOnInit (): void {
    this.service.setCurrentPlayer ("leo");
    this.service.setAiPlayers (["nico"]);
    this.resolveTasksSubscription = this.service.resolveTasks$ ().subscribe ();
  } // ngOnInit

  ngOnDestroy () {
    this.resolveTasksSubscription.unsubscribe ();
  } // ngOnDestroy

  onPlayerSelect (player: BaronyPlayer) {
    this.service.setCurrentPlayer (player.id);
  } // onPlayerSelect

  onPlayerBuildingClick (pawnType: BaronyPawnType) {
    this.service.buildingChange (pawnType as BaronyBuilding);
  } // onPlayerBuildingClick

  onLandTileClick (landTile: BaronyLand) {
    this.service.landTileChange (landTile);
  } // onLandTileClick

  onActionClick (action: BaronyAction) {
    this.service.actionChange (action);
  } // onActionClick

  onPassClick () {
    this.service.passChange ();
  } // onPassClick

  onCancelClick () {
    this.service.cancelChange ();
  } // onCancelClick

  onKnightsConfirm () {
    this.service.numberOfKnightsChange (this.numberOfKnights);
    this.numberOfKnights = 1;
  } // onKnightsConfirm

  onPlayerResourceClick (resource: BaronyResourceType, player: BaronyPlayer) {
    this.service.resourceChange (resource, player);
  } // onPlayerResourceClick

} // BaronyBoardComponent

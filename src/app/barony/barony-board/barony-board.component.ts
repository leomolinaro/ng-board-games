import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { of, Subject, Subscription } from "rxjs";
import { first, switchMap, tap } from "rxjs/operators";
import { BaronyAction, BaronyBuilding, BaronyLandTile, BaronyPawnType, BaronyPlayer } from "../models";
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

  landTiles$ = this.service.selectLandTiles$ ();
  validLandTiles$ = this.service.selectValidLandTiles$ ();
  validActions$ = this.service.selectValidActions$ ();
  validBuildings$ = this.service.selectValidBuildings$ ();
  canPass$ = this.service.selectCanPass$ ();
  maxNumberOfKnights$ = this.service.selectMaxNumberOfKnights$ ().pipe (tap (max => this.numberOfKnights = max ? max : 0));
  otherPlayers$ = this.service.selectOtherPlayers$ ();
  currentPlayer$ = this.service.selectCurrentPlayer$ ();
  message$ = this.service.selectMessage$ ();

  numberOfKnights = 1;

  resolveTasksSubscription!: Subscription;

  ngOnInit (): void {
    this.service.setCurrentPlayer (0);
    this.service.setAiPlayers ([1]);
    this.resolveTasksSubscription = this.service.resolveTasks$ ().subscribe ();
  } // ngOnInit

  ngOnDestroy () {
    this.resolveTasksSubscription.unsubscribe ();
  } // ngOnDestroy

  onSelectPlayerChange (player: BaronyPlayer) {
    this.service.setCurrentPlayer (player.index);
  } // onSelectPlayerChange

  onPlayerBuildingClick (pawnType: BaronyPawnType) {
    this.service.selectBuilding (pawnType as BaronyBuilding);
  } // onPlayerBuildingClick

  onLandTileClick (landTile: BaronyLandTile) {
    this.service.selectLandTile (landTile);
  } // onLandTileClick

  onActionClick (action: BaronyAction) {
    this.service.selectAction (action);
  } // onActionClick

  onPassClick () {
    this.service.selectPass ();
  } // onPassClick

  onKnightsConfirm () {
    this.service.selectNumberOfKnights (this.numberOfKnights);
    this.numberOfKnights = 1;
  } // onKnightsConfirm

} // BaronyBoardComponent

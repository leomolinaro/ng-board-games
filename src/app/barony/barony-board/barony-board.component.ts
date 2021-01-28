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


    this.do ();
  } // ngOnInit

  ngOnDestroy () {
    this.resolveTasksSubscription.unsubscribe ();
  } // ngOnDestroy

  onSelectPlayerChange (player: BaronyPlayer) {
    this.service.setCurrentPlayer (player.index);
  } // onSelectPlayerChange

  onPlayerBuildingClick (pawnType: BaronyPawnType) {
    console.log ("QUI")
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






  $click = new Subject ();
  click$ () { return this.$click.asObservable ().pipe (first ()); }
  wrapClick$ () { return of (1).pipe (switchMap (() => this.click$ ())); }

  do () {
    this.wrapClick$ ().pipe (
      switchMap (() => {
        console.log ("1")
        return this.wrapClick$ ();
      })
    ).subscribe (() => console.log ("2"));
  }

} // BaronyBoardComponent

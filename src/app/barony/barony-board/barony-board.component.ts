import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { BaronyLandTile, BaronyPlayer } from "../models";
import { BaronyBoardService } from "./barony-board.service";
import { BaronyAiService } from "./barony-ia.service";

@Component ({
  selector: "barony-board",
  templateUrl: "./barony-board.component.html",
  styleUrls: ["./barony-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyBoardComponent implements OnInit, OnDestroy {

  constructor (
    private service: BaronyBoardService,
    private aiService: BaronyAiService
  ) { }

  landTiles$ = this.service.selectLandTiles$ ();
  candidateLandTiles$ = this.service.selectCandidateLandTiles$ ();
  candidateActions$ = this.service.selectCandidateActions$ ();
  otherPlayers$ = this.service.selectOtherPlayers$ ();
  currentPlayer$ = this.service.selectCurrentPlayer$ ();
  message$ = this.service.selectMessage$ ();

  aiSubscription!: Subscription;

  ngOnInit (): void {
    this.aiSubscription = this.aiService.resolveActions$ ([1]).subscribe ();
    this.service.startGame ();
  } // ngOnInit

  ngOnDestroy () {
    this.aiSubscription.unsubscribe ();
  } // ngOnDestroy

  onSelectPlayerChange (player: BaronyPlayer) {
    this.service.setCurrentPlayer (player);
  } // onSelectPlayerChange

  onLandTileClick (landTile: BaronyLandTile) {
    this.service.selectLandTile (landTile);
  } // onLandTileClick

} // BaronyBoardComponent

import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BaronyLandTile, BaronyPlayer } from "../models";
import { BaronyBoardService } from "./barony-board.service";

@Component ({
  selector: "barony-board",
  templateUrl: "./barony-board.component.html",
  styleUrls: ["./barony-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyBoardComponent implements OnInit {

  constructor (
    private service: BaronyBoardService
  ) { }

  landTiles$ = this.service.selectLandTiles$ ();
  otherPlayers$ = this.service.selectOtherPlayers$ ();
  currentPlayer$ = this.service.selectCurrentPlayer$ ();
  message$ = this.service.selectMessage$ ();

  ngOnInit (): void {
    this.service.startGame ();
  } // ngOnInit

  onSelectPlayerChange (player: BaronyPlayer) {
    this.service.setCurrentPlayer (player);
  } // onSelectPlayerChange

  onLandTileClick (landTile: BaronyLandTile) {
    this.service.selectLandTile (landTile);
  } // onLandTileClick

} // BaronyBoardComponent

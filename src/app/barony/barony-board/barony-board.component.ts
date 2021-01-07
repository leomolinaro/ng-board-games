import { Component, OnInit } from "@angular/core";
import { BaronyBoardService } from "./barony-board.service";

@Component ({
  selector: "barony-board",
  templateUrl: "./barony-board.component.html",
  styleUrls: ["./barony-board.component.scss"]
})
export class BaronyBoardComponent implements OnInit {

  constructor (
    private service: BaronyBoardService
  ) { }

  landTiles$ = this.service.selectLandTiles$ ();
  otherPlayers$ = this.service.selectOtherPlayers$ ();
  currentPlayer$ = this.service.selectCurrentPlayer$ ();

  ngOnInit (): void {
    this.service.startGame ();
  } // ngOnInit

} // BaronyBoardComponent

import { Component, OnInit } from "@angular/core";
import { BaronyContext, BaronyPlayService } from "../services";

@Component ({
  selector: "barony-board",
  templateUrl: "./barony-board.component.html",
  styleUrls: ["./barony-board.component.scss"]
})
export class BaronyBoardComponent implements OnInit {

  constructor (
    private playService: BaronyPlayService
  ) { }

  private context = new BaronyContext ();

  landTiles$ = this.context.selectLandTiles$ ();

  ngOnInit (): void {
    const tasks = this.playService.startGame (this.context);
  } // ngOnInit

} // BaronyBoardComponent

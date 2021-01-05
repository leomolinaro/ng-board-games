import { Component, Input, OnInit } from "@angular/core";
import { BaronyLandTile } from "../models";

@Component ({
  selector: "barony-map",
  templateUrl: "./barony-map.component.html",
  styleUrls: ["./barony-map.component.scss"]
})
export class BaronyMapComponent implements OnInit {

  constructor () { }

  @Input () landTiles!: BaronyLandTile[];

  ngOnInit (): void {
  } // ngOnInit

} // BaronyMapComponent

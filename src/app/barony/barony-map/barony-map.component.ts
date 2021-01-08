import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BaronyLandTile } from "../models";

@Component ({
  selector: "barony-map",
  templateUrl: "./barony-map.component.html",
  styleUrls: ["./barony-map.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyMapComponent implements OnInit {

  constructor () { }

  @Input () landTiles!: BaronyLandTile[];
  @Output () landTileClick = new EventEmitter<BaronyLandTile> ();

  ngOnInit (): void {
  } // ngOnInit

  onLandTileClick (landTile: BaronyLandTile) {
    this.landTileClick.next (landTile);
  } // onLandTileClick

} // BaronyMapComponent

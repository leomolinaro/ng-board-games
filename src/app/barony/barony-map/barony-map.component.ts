import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { arrayUtil } from "@bg-utils";
import { BaronyLandTile, BaronyLandTileCoordinates, getLandTileCoordinateKey } from "../models";

@Component ({
  selector: "barony-map",
  templateUrl: "./barony-map.component.html",
  styleUrls: ["./barony-map.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyMapComponent implements OnChanges {

  constructor () { }

  @Input () landTiles!: BaronyLandTile[];
  @Input () availableLandTiles: BaronyLandTileCoordinates[] | null = null;
  @Output () landTileClick = new EventEmitter<BaronyLandTile> ();

  isAvailable: { [key: string]: boolean } | null = null;

  ngOnChanges (changes: SimpleChanges): void {
    if (changes.availableLandTiles) {
      if (this.availableLandTiles) {
        this.isAvailable = arrayUtil.toMap (this.availableLandTiles, lt => getLandTileCoordinateKey (lt), () => true);
      } else {
        this.isAvailable = null;
      } // if - else
    } // if
  } // ngOnChanges

  onLandTileClick (landTile: BaronyLandTile) {
    if (this.isAvailable && this.isAvailable[landTile.key]) {
      this.landTileClick.next (landTile);
    } // if
  } // onLandTileClick

} // BaronyMapComponent

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
  @Input () validLandTiles: BaronyLandTileCoordinates[] | null = null;
  @Output () landTileClick = new EventEmitter<BaronyLandTile> ();

  isValid: { [key: string]: boolean } | null = null;

  ngOnChanges (changes: SimpleChanges): void {
    if (changes.validLandTiles) {
      if (this.validLandTiles) {
        this.isValid = arrayUtil.toMap (this.validLandTiles, lt => getLandTileCoordinateKey (lt), () => true);
      } else {
        this.isValid = null;
      } // if - else
    } // if
  } // ngOnChanges

  onLandTileClick (landTile: BaronyLandTile) {
    if (this.isValid && this.isValid[landTile.key]) {
      this.landTileClick.next (landTile);
    } // if
  } // onLandTileClick

} // BaronyMapComponent

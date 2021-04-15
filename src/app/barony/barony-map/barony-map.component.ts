import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { arrayUtil, SimpleChanges } from "@bg-utils";
import { BaronyLand, BaronyLandCoordinates, landCoordinatesToId } from "../barony-models";

@Component ({
  selector: "barony-map",
  templateUrl: "./barony-map.component.html",
  styleUrls: ["./barony-map.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyMapComponent implements OnChanges {

  constructor () { }

  @Input () lands!: BaronyLand[];
  @Input () validLands: BaronyLandCoordinates[] | null = null;
  @Output () landTileClick = new EventEmitter<BaronyLand> ();

  isValid: { [key: string]: boolean } | null = null;

  landTrackBy = (land: BaronyLand) => land.id;

  ngOnChanges (changes: SimpleChanges<BaronyMapComponent>): void {
    if (changes.validLands) {
      if (this.validLands) {
        this.isValid = arrayUtil.toMap (this.validLands, lt => landCoordinatesToId (lt), () => true);
      } else {
        this.isValid = null;
      } // if - else
    } // if
  } // ngOnChanges

  onLandTileClick (landTile: BaronyLand) {
    if (this.isValid && this.isValid[landTile.id]) {
      this.landTileClick.next (landTile);
    } // if
  } // onLandTileClick

} // BaronyMapComponent

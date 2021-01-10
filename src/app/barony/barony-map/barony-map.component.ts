import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { arrayUtil } from "@bg-utils";
import { BaronyLandTile } from "../models";

@Component ({
  selector: "barony-map",
  templateUrl: "./barony-map.component.html",
  styleUrls: ["./barony-map.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyMapComponent implements OnChanges {

  constructor () { }

  @Input () landTiles!: BaronyLandTile[];
  @Input () candidateLandTiles: BaronyLandTile[] | null = null;
  @Output () landTileClick = new EventEmitter<BaronyLandTile> ();

  isCandidate: { [key: string]: boolean } | null = null;

  ngOnChanges (changes: SimpleChanges): void {
    if (changes.candidateLandTiles) {
      if (this.candidateLandTiles) {
        this.isCandidate = arrayUtil.toMap (this.candidateLandTiles, lt => lt.key, () => true);
      } else {
        this.isCandidate = null;
      } // if - else
    } // if
  } // ngOnChanges

  onLandTileClick (landTile: BaronyLandTile) {
    if (this.isCandidate && this.isCandidate[landTile.key]) {
      this.landTileClick.next (landTile);
    } // if
  } // onLandTileClick

} // BaronyMapComponent

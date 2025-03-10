import { NgFor } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from "@angular/core";
import { BgMapZoomDirective, BgSvgComponent } from "@leobg/commons";
import { SimpleChanges, arrayUtil } from "@leobg/commons/utils";
import {
  BaronyLand,
  BaronyLandCoordinates,
  landCoordinatesToId,
} from "../../barony-models";
import { BaronyLandComponent } from "../barony-land-tile/barony-land-tile.component";

@Component ({
  selector: "barony-map",
  templateUrl: "./barony-map.component.html",
  styleUrls: ["./barony-map.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BgSvgComponent, BgMapZoomDirective, NgFor, BaronyLandComponent]
})
export class BaronyMapComponent implements OnChanges {
  constructor () {}

  @Input () lands!: BaronyLand[];
  @Input () validLands: BaronyLandCoordinates[] | null = null;
  @Output () landTileClick = new EventEmitter<BaronyLand> ();

  @ViewChild (BgMapZoomDirective, { static: true })
    bgMapZoom!: BgMapZoomDirective;

  isValid: { [key: string]: boolean } | null = null;

  landTrackBy = (land: BaronyLand) => land.id;

  ngOnChanges (changes: SimpleChanges<BaronyMapComponent>): void {
    if (changes.validLands) {
      if (this.validLands) {
        this.isValid = arrayUtil.toMap (
          this.validLands,
          (lt) => landCoordinatesToId (lt),
          () => true
        );
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

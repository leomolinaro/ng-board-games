import { Component, OnChanges, ViewChild, input, output } from "@angular/core";
import { BgMapZoom, BgSvg } from "@leobg/commons";
import { SimpleChanges, arrayUtil } from "@leobg/commons/utils";
import { BaronyLand, BaronyLandCoordinates, landCoordinatesToId } from "../barony-models";
import { BaronyLandComponent } from "./barony-land-tile";

@Component({
  selector: "barony-map",
  imports: [BgSvg, BgMapZoom, BaronyLandComponent],
  template: `
    <svg
      bgSvg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="100%"
      height="100%"
      viewBox="0 0 1000 500"
      preserveAspectratio="xMinYMin">
      <defs>
        <pattern
          id="mountain"
          height="100%"
          width="100%"
          patternContentUnits="objectBoundingBox">
          <image
            width="1"
            height="1"
            preserveAspectRatio="none"
            xlink:href="assets/barony/land-tiles/mountain.png"></image>
        </pattern>
        <pattern
          id="lake"
          height="100%"
          width="100%"
          patternContentUnits="objectBoundingBox">
          <image
            width="1"
            height="1"
            preserveAspectRatio="none"
            xlink:href="assets/barony/land-tiles/lake.png"></image>
        </pattern>
        <pattern
          id="plain"
          height="100%"
          width="100%"
          patternContentUnits="objectBoundingBox">
          <image
            width="1"
            height="1"
            preserveAspectRatio="none"
            xlink:href="assets/barony/land-tiles/plain.png"></image>
        </pattern>
        <pattern
          id="fields"
          height="100%"
          width="100%"
          patternContentUnits="objectBoundingBox">
          <image
            width="1"
            height="1"
            preserveAspectRatio="none"
            xlink:href="assets/barony/land-tiles/fields.png"></image>
        </pattern>
        <pattern
          id="forest"
          height="100%"
          width="100%"
          patternContentUnits="objectBoundingBox">
          <image
            width="1"
            height="1"
            preserveAspectRatio="none"
            xlink:href="assets/barony/land-tiles/forest.png"></image>
        </pattern>
      </defs>
      <svg:g
        [bgMapZoom]="{
          translateX: 500,
          translateY: 200,
          scale: 20
        }">
        @for (land of lands(); track land.id) {
          <svg:g
            baronyLandTile
            [type]="land.type"
            [coordinates]="land.coordinates"
            [pawns]="land.pawns"
            [active]="isValid ? isValid[land.id] : false"
            [disabled]="isValid ? !isValid[land.id] : false"
            (landTileClick)="onLandTileClick(land)"></svg:g>
        }
      </svg:g>
    </svg>
  `
})
export class BaronyMap implements OnChanges {
  constructor() {}

  readonly lands = input.required<BaronyLand[]>();
  readonly validLands = input<BaronyLandCoordinates[] | null>(null);
  readonly landTileClick = output<BaronyLand>();

  @ViewChild(BgMapZoom, { static: true })
  bgMapZoom!: BgMapZoom;

  isValid: { [key: string]: boolean } | null = null;

  ngOnChanges(changes: SimpleChanges<BaronyMap>): void {
    if (changes.validLands) {
      const validLands = this.validLands();
      if (validLands) {
        this.isValid = arrayUtil.toMap(
          validLands,
          lt => landCoordinatesToId(lt),
          () => true
        );
      } else {
        this.isValid = null;
      }
    }
  }

  onLandTileClick(landTile: BaronyLand) {
    if (this.isValid && this.isValid[landTile.id]) {
      this.landTileClick.emit(landTile);
    }
  }
}

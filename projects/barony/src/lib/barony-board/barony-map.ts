import { Component, computed, input, output, viewChild } from '@angular/core';
import { BgMapZoom, BgSvg } from '@leobg/commons';
import { arrayUtil } from '@leobg/commons/utils';
import type { BaronyLand, BaronyLandCoordinates } from '../barony-models';
import { landCoordinatesToId } from '../barony-models';
import { BaronyLandComponent } from './barony-land-tile';

@Component({
  selector: 'barony-map',
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
      preserveAspectratio="xMinYMin"
    >
      <defs>
        <pattern
          id="mountain"
          height="100%"
          width="100%"
          patternContentUnits="objectBoundingBox"
        >
          <image
            width="1"
            height="1"
            preserveAspectRatio="none"
            xlink:href="assets/barony/land-tiles/mountain.png"
          ></image>
        </pattern>
        <pattern
          id="lake"
          height="100%"
          width="100%"
          patternContentUnits="objectBoundingBox"
        >
          <image
            width="1"
            height="1"
            preserveAspectRatio="none"
            xlink:href="assets/barony/land-tiles/lake.png"
          ></image>
        </pattern>
        <pattern
          id="plain"
          height="100%"
          width="100%"
          patternContentUnits="objectBoundingBox"
        >
          <image
            width="1"
            height="1"
            preserveAspectRatio="none"
            xlink:href="assets/barony/land-tiles/plain.png"
          ></image>
        </pattern>
        <pattern
          id="fields"
          height="100%"
          width="100%"
          patternContentUnits="objectBoundingBox"
        >
          <image
            width="1"
            height="1"
            preserveAspectRatio="none"
            xlink:href="assets/barony/land-tiles/fields.png"
          ></image>
        </pattern>
        <pattern
          id="forest"
          height="100%"
          width="100%"
          patternContentUnits="objectBoundingBox"
        >
          <image
            width="1"
            height="1"
            preserveAspectRatio="none"
            xlink:href="assets/barony/land-tiles/forest.png"
          ></image>
        </pattern>
      </defs>
      <svg:g
        [bgMapZoom]="{
          translateX: 500,
          translateY: 200,
          scale: 20,
        }"
      >
        @let isVal = isValid();
        @for (land of lands(); track land.id) {
          <svg:g
            baronyLandTile
            [type]="land.type"
            [coordinates]="land.coordinates"
            [pawns]="land.pawns"
            [active]="isVal ? isVal[land.id] : false"
            [disabled]="isVal ? !isVal[land.id] : false"
            (landTileClick)="onLandTileClick(land)"
          ></svg:g>
        }
      </svg:g>
    </svg>
  `,
})
export class BaronyMap {
  readonly lands = input.required<BaronyLand[]>();
  readonly validLands = input<BaronyLandCoordinates[] | undefined>(undefined);
  readonly landTileClick = output<BaronyLand>();

  bgMapZoom = viewChild.required(BgMapZoom);

  protected isValid = computed<Record<string, boolean> | undefined>(() => {
    const validLands = this.validLands();
    return validLands
      ? arrayUtil.toMap(
          validLands,
          (lt) => landCoordinatesToId(lt),
          () => true,
        )
      : undefined;
  });

  onLandTileClick(landTile: BaronyLand): void {
    const isValid = this.isValid();
    if (isValid?.[landTile.id]) this.landTileClick.emit(landTile);
  }
}

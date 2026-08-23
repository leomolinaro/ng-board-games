import { Component, OnChanges, ViewChild, input, output } from "@angular/core";
import { BgMapZoom, BgSvg } from "@leobg/commons";
import { SimpleChanges, arrayUtil } from "@leobg/commons/utils";
import { BaronyLand, BaronyLandCoordinates, landCoordinatesToId } from "../../barony-models";
import { BaronyLandComponent } from "../barony-land-tile/barony-land-tile.component";

@Component({
  selector: "barony-map",
  templateUrl: "./barony-map.component.html",
  styleUrls: ["./barony-map.component.scss"],
  imports: [BgSvg, BgMapZoom, BaronyLandComponent]
})
export class BaronyMapComponent implements OnChanges {
  constructor() {}

  readonly lands = input.required<BaronyLand[]>();
  readonly validLands = input<BaronyLandCoordinates[] | null>(null);
  readonly landTileClick = output<BaronyLand>();

  @ViewChild(BgMapZoom, { static: true })
  bgMapZoom!: BgMapZoom;

  isValid: { [key: string]: boolean } | null = null;

  ngOnChanges(changes: SimpleChanges<BaronyMapComponent>): void {
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

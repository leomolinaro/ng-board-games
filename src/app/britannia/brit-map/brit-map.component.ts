import { ChangeDetectionStrategy, Component, Input, OnChanges } from "@angular/core";
import { SimpleChanges } from "@bg-utils";
import { BritArea } from "../brit-models";
import { BritMapService } from "./brit-map.service";

interface BritAreaNode {
  area: BritArea;
  path: string;
} // BritAreaNode

@Component ({
  selector: "brit-map",
  templateUrl: "./brit-map.component.html",
  styleUrls: ["./brit-map.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritMapComponent implements OnChanges {

  constructor (
    private mapService: BritMapService
  ) { }

  @Input () areas!: BritArea[];

  areaNodes!: BritAreaNode[];
  viewBox = this.mapService.getViewBox ();

  areaTrackBy = (index: number, areaNode: BritAreaNode) => areaNode.area.id;

  ngOnChanges (changes: SimpleChanges<BritMapComponent>) {
    if (changes.areas) {
      this.areaNodes = this.areas.map (area => {
        const path = this.mapService.getPath (area.id);
        return {
          area,
          path
        };
      });
    } // if
  } // ngOnChanges

} // BritMapComponent

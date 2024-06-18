import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, input } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { WotrCharacter, WotrCharacterId } from "../companion/wotr-character.models";
import { WotrFellowship } from "../fellowship/wotr-fellowhip.models";
import { WotrMapService } from "../game/board/map/wotr-map.service";
import { WotrRegionComponent } from "./wotr-region.component";
import { WotrRegion } from "./wotr-region.models";

@Component ({
  selector: "[wotrRegions]",
  standalone: true,
  imports: [MatTooltipModule, NgClass, WotrRegionComponent],
  template: `
    @for (point of testGridPoints; track point) {
      <svg:circle
        [attr.cx]="point.x"
        [attr.cy]="point.y"
        [attr.r]="1"
        [attr.style]="'fill: ' + point.color">
      </svg:circle>
    }
    @for (region of regions (); track region.id) {
      <svg:g wotrRegion
        [region]="region"
        [fellowship]="fellowship ()"
        [characterById]="characterById ()"
        (regionClick)="onRegionClick (region)">
      </svg:g>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrRegionsComponent {

  private mapService = inject (WotrMapService);

  regions = input.required<WotrRegion[]> ();
  fellowship = input.required<WotrFellowship> ();
  characterById = input.required<Record<WotrCharacterId, WotrCharacter>> ();
  // @Input () validRegions: WotrRegionId[] | null = null;

  @Output () regionClick = new EventEmitter<WotrRegion> ();

  viewBox = this.mapService.getViewBox ();
  mapWidth = this.mapService.getWidth ();

  testGridPoints: { x: number; y: number; color: string }[] = [];

  isValidRegion: Record<string, boolean> | null = null;
  isValidUnit: Record<string, boolean> | null = null;
  nSelectedUnits: Record<string, number> | null = null;

  onRegionClick (region: WotrRegion) {
    // if (this.validRegions?.includes (regionNode.id)) {
    this.regionClick.emit (region);
    // }
  }

}

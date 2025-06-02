import { ChangeDetectionStrategy, Component, computed, inject, input, output } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { arrayUtil } from "../../../../commons/utils/src";
import { WotrCharacter, WotrCharacterId } from "../character/wotr-character.models";
import { WotrFellowship } from "../fellowship/wotr-fellowhip.models";
import { WotrMapService } from "../game/board/map/wotr-map.service";
import { WotrMordorTrackComponent } from "./wotr-mordor-track.component";
import { WotrRegionComponent } from "./wotr-region.component";
import { WotrRegion, WotrRegionId } from "./wotr-region.models";
import { WotrStrongholdComponent } from "./wotr-stronghold.component";

@Component ({
  selector: "[wotrRegions]",
  imports: [MatTooltipModule, WotrRegionComponent, WotrMordorTrackComponent, WotrStrongholdComponent],
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
        [fellowship]="region.fellowship ? fellowship () : null"
        [characterById]="characterById ()"
        [valid]="!validRegions () || validRegionById ()[region.id]"
        (regionClick)="onRegionClick (region)">
      </svg:g>
      @if (region.settlement === 'stronghold' && region.underSiegeArmy) {
        <svg:g wotrStronghold
          [region]="region"
          [characterById]="characterById ()"
          (regionClick)="onStrongholdClick (region)">
        </svg:g>
      }
    }
    @if (fellowship ().mordorTrack != null) {
      <svg:g wotrMordorTrack [fellowship]="fellowship ()"></svg:g>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrRegionsComponent {

  private mapService = inject (WotrMapService);

  regions = input.required<WotrRegion[]> ();
  fellowship = input.required<WotrFellowship> ();
  characterById = input.required<Record<WotrCharacterId, WotrCharacter>> ();
  validRegions = input.required<WotrRegionId[] | null> ();
  validRegionById = computed<Partial<Record<WotrRegionId, boolean>>> (() => {
    return arrayUtil.toMap (this.validRegions () ?? [], region => region, () => true);
  });

  regionClick = output<WotrRegion> ();

  viewBox = this.mapService.getViewBox ();
  mapWidth = this.mapService.getWidth ();

  testGridPoints: { x: number; y: number; color: string }[] = [];

  isValidRegion: Record<string, boolean> | null = null;
  isValidUnit: Record<string, boolean> | null = null;
  nSelectedUnits: Record<string, number> | null = null;

  onRegionClick (region: WotrRegion) {
    this.regionClick.emit (region);
  }

  onStrongholdClick (region: WotrRegion) {
    // if (this.validRegions?.includes (regionNode.id)) {
    this.regionClick.emit (region);
    // }
  }

}

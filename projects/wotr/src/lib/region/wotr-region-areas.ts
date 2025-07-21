import { ChangeDetectionStrategy, Component, computed, inject, input, output } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { arrayUtil } from "../../../../commons/utils/src";
import { WotrCharacter, WotrCharacterId } from "../character/wotr-character-models";
import { WotrFellowship } from "../fellowship/wotr-fellowhip-models";
import { WotrMapService } from "../game/board/map/wotr-map.service";
import { WotrGameUi } from "../game/wotr-game-ui";
import { WotrMordorTrack } from "./wotr-mordor-track";
import { WotrRegionArea } from "./wotr-region-area";
import { WotrRegion, WotrRegionId } from "./wotr-region-models";
import { WotrStrongholdBox } from "./wotr-stronghold-box";

@Component({
  selector: "[wotrRegions]",
  imports: [MatTooltipModule, WotrRegionArea, WotrMordorTrack, WotrStrongholdBox],
  template: `
    @for (point of testGridPoints; track point) {
      <svg:circle
        [attr.cx]="point.x"
        [attr.cy]="point.y"
        [attr.r]="1"
        [attr.style]="'fill: ' + point.color"></svg:circle>
    }
    @for (region of regions(); track region.id) {
      <svg:g
        wotrRegion
        [region]="region"
        [fellowship]="region.fellowship ? fellowship() : null"
        [characterById]="characterById()"
        [valid]="!validRegions() || validRegionById()[region.id]"
        (regionClick)="onRegionClick(region)"></svg:g>
      @if (region.settlement === "stronghold" && region.underSiegeArmy) {
        <svg:g
          wotrStronghold
          [region]="region"
          [characterById]="characterById()"
          (regionClick)="onStrongholdClick(region)"></svg:g>
      }
    }
    @if (fellowship().mordorTrack != null) {
      <svg:g
        wotrMordorTrack
        [fellowship]="fellowship()"></svg:g>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrRegionAreas {
  private mapService = inject(WotrMapService);
  private ui = inject(WotrGameUi);

  regions = input.required<WotrRegion[]>();
  fellowship = input.required<WotrFellowship>();
  characterById = input.required<Record<WotrCharacterId, WotrCharacter>>();
  protected validRegions = computed<WotrRegionId[] | null>(() => {
    const regionSelection = this.ui.regionSelection();
    if (regionSelection) return regionSelection;
    const unitSelection = this.ui.regionUnitSelection();
    if (unitSelection) return unitSelection.regionIds;
    return null;
  });
  protected validRegionById = computed<Partial<Record<WotrRegionId, boolean>>>(() => {
    return arrayUtil.toMap(
      this.validRegions() ?? [],
      region => region,
      () => true
    );
  });

  regionClick = output<WotrRegion>();

  viewBox = this.mapService.getViewBox();
  mapWidth = this.mapService.getWidth();

  testGridPoints: { x: number; y: number; color: string }[] = [];

  isValidRegion: Record<string, boolean> | null = null;
  isValidUnit: Record<string, boolean> | null = null;
  nSelectedUnits: Record<string, number> | null = null;

  onRegionClick(region: WotrRegion) {
    this.regionClick.emit(region);
  }

  onStrongholdClick(region: WotrRegion) {
    // if (this.validRegions?.includes (regionNode.id)) {
    this.regionClick.emit(region);
    // }
  }
}

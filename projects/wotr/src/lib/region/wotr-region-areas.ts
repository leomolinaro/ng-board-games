import { Component, computed, inject, input, output } from '@angular/core';
import { arrayUtil } from '../../../../commons/utils/src';
import { WotrAssetsStore } from '../assets/wotr-assets-store';
import type {
  WotrCharacter,
  WotrCharacterId,
} from '../character/wotr-character-models';
import type { WotrFellowship } from '../fellowship/wotr-fellowship-models';
import { WotrMapService } from '../game/board/map/wotr-map.service';
import { WotrGameUi } from '../game/wotr-game-ui';
import { WotrMordorTrack } from './wotr-mordor-track';
import { WotrRegionArea } from './wotr-region-area';
import type { WotrRegion, WotrRegionId } from './wotr-region-models';
import { WotrRegionStore } from './wotr-region-store';
import { WotrStrongholdBox } from './wotr-stronghold-box';

@Component({
  selector: '[wotrRegions]',
  imports: [WotrRegionArea, WotrMordorTrack, WotrStrongholdBox],
  template: `
    @for (point of testGridPoints; track point) {
      <svg:circle
        [attr.cx]="point.x"
        [attr.cy]="point.y"
        [attr.r]="1"
        [attr.style]="'fill: ' + point.color"
      ></svg:circle>
    }
    @if (helmsDeepIsengardOverlay(); as overlay) {
      <svg:image
        [attr.x]="481"
        [attr.y]="401"
        width="40"
        [attr.xlink:href]="overlay.image"
      ></svg:image>
    }
    @for (region of regions(); track region.id) {
      <svg:g
        wotrRegion
        [region]="region"
        [fellowship]="region.fellowship ? fellowship() : undefined"
        [characterById]="characterById()"
        [valid]="(!validRegions() || validRegionById()[region.id]) ?? false"
        (regionClick)="onRegionClick(region)"
      ></svg:g>
      @if (region.settlement === 'stronghold') {
        <svg:g
          wotrStronghold
          [region]="region"
          [army]="region.underSiegeArmy"
          [characterById]="characterById()"
          (regionClick)="onStrongholdClick(region)"
        ></svg:g>
      }
    }
    @if (fellowship().mordorTrack !== undefined) {
      <svg:g
        wotrMordorTrack
        [fellowship]="fellowship()"
      ></svg:g>
    }
  `,
})
export class WotrRegionAreas {
  private mapService = inject(WotrMapService);
  private ui = inject(WotrGameUi);
  private regionStore = inject(WotrRegionStore);
  private assets = inject(WotrAssetsStore);

  regions = input.required<WotrRegion[]>();
  fellowship = input.required<WotrFellowship>();
  characterById = input.required<Record<WotrCharacterId, WotrCharacter>>();
  protected validRegions = computed<WotrRegionId[] | undefined>(() => {
    const regionSelection = this.ui.regionSelection();
    if (regionSelection) return regionSelection;
    const unitSelection = this.ui.regionUnitSelection();
    return unitSelection?.regionIds;
  });
  protected validRegionById = computed<Partial<Record<WotrRegionId, boolean>>>(
    () => {
      return arrayUtil.toMap(
        this.validRegions() ?? [],
        (region) => region,
        () => true,
      );
    },
  );

  regionClick = output<WotrRegion>();

  viewBox = this.mapService.getViewBox();
  mapWidth = this.mapService.getWidth();

  testGridPoints: { x: number; y: number; color: string }[] = [];

  isValidRegion: Record<string, boolean> | undefined = undefined;
  isValidUnit: Record<string, boolean> | undefined = undefined;
  nSelectedUnits: Record<string, number> | undefined = undefined;

  protected helmsDeepIsengardOverlay = computed(() => {
    const region = this.regionStore.region('helms-deep');
    return region.nationId === 'isengard'
      ? { image: this.assets.helmsDeepIsengardOverlay() }
      : undefined;
  });

  onRegionClick(region: WotrRegion): void {
    this.regionClick.emit(region);
  }

  onStrongholdClick(region: WotrRegion): void {
    // if (this.validRegions?.includes (regionNode.id)) {
    this.regionClick.emit(region);
    // }
  }
}

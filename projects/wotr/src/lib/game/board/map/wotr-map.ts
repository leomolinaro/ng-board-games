import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  input,
  isDevMode,
  output
} from "@angular/core";
import { BgMapZoomDirective, BgSvgComponent, BgSvgModule } from "@leobg/commons";
import { downloadUtil } from "@leobg/commons/utils";
import { WotrAssetsStore } from "../../../assets/wotr-assets-store";
import { WotrCharacter, WotrCharacterId } from "../../../character/wotr-character-models";
import { WotrFellowship } from "../../../fellowship/wotr-fellowhip-models";
import { WotrFellowshipBox } from "../../../fellowship/wotr-fellowship-box";
import { WotrFellowshipTrack } from "../../../fellowship/wotr-fellowship-track";
import { WotrDeckBoxes } from "../../../front/wotr-deck-boxes";
import { WotrElvenRingsBox } from "../../../front/wotr-elven-rings-box";
import { WotrFront } from "../../../front/wotr-front-models";
import { WotrTableCardsComponent } from "../../../front/wotr-table-card-boxes";
import { WotrVictoryPointsTrack } from "../../../front/wotr-victory-points-track";
import { WotrHuntBox } from "../../../hunt/wotr-hunt-box";
import { WotrHuntState } from "../../../hunt/wotr-hunt-store";
import { WotrPoliticalTrack } from "../../../nation/wotr-political-track";
import { WotrRegionAreas } from "../../../region/wotr-region-areas";
import { WotrRegion, WotrRegionId } from "../../../region/wotr-region-models";
import { WotrGameUi } from "../../wotr-game-ui";
import { WotrMapSlotsGenerator } from "./wotr-map-slots-generator";
import { WotrMapService } from "./wotr-map.service";

const GRID_STEP = 10;

@Component({
  selector: "wotr-map",
  imports: [
    BgSvgModule,
    WotrRegionAreas,
    WotrPoliticalTrack,
    WotrHuntBox,
    WotrFellowshipTrack,
    WotrFellowshipBox,
    WotrElvenRingsBox,
    WotrDeckBoxes,
    WotrTableCardsComponent,
    WotrVictoryPointsTrack
  ],
  template: `
    <svg:svg
      bgSvg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="100%"
      height="100%"
      [attr.viewBox]="viewBox"
      preserveAspectRatio="xMidYMin">
      <svg:g
        #wotrMap
        [bgMapZoom]="{ translateX: 0, translateY: 0, scale: 1 }">
        <image
          [attr.width]="mapWidth"
          [attr.xlink:href]="mapImageSource"></image>
        <svg:g
          wotrRegions
          [regions]="regions()"
          [fellowship]="fellowship()"
          [characterById]="characterById()"
          (regionClick)="regionClick.emit($event)"></svg:g>
        <svg:g wotrPoliticalTrack></svg:g>
        <svg:g
          wotrHuntBox
          [hunt]="hunt()"></svg:g>
        <svg:g
          wotrFellowshipTrack
          [fellowship]="fellowship()"></svg:g>
        <svg:g
          wotrFellowshipBox
          [fellowship]="fellowship()"
          (boxClick)="fellowshipBoxClick.emit()"></svg:g>
        <svg:g
          wotrElvenRingsBox
          [freePeoplesElvenRings]="freePeoples().elvenRings"
          [shadowElvenRings]="shadow().elvenRings"></svg:g>
        <svg:g
          wotrDeckBoxes
          [freePeoples]="freePeoples()"
          [shadow]="shadow()"></svg:g>
        <svg:g
          wotrTableCards
          [freePeoples]="freePeoples()"
          [shadow]="shadow()"></svg:g>
        <svg:g
          wotrVictoryPointsTrack
          [fronts]="fronts()"></svg:g>
      </svg:g>
    </svg:svg>
    <!-- @if (isDevMode) {
      <button style="position: absolute; bottom: 0; left: 0;" (click)="calculateSlots ()">Calculate slots</button>
    } -->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrMap {
  private mapService = inject(WotrMapService);
  private assets = inject(WotrAssetsStore);
  private slotsGeneratorService = inject(WotrMapSlotsGenerator);
  private ui = inject(WotrGameUi);

  regions = input.required<WotrRegion[]>();
  hunt = input.required<WotrHuntState[]>();
  freePeoples = input.required<WotrFront>();
  shadow = input.required<WotrFront>();
  fellowship = input.required<WotrFellowship[]>();
  characterById = input.required<Record<WotrCharacterId, WotrCharacter>>();
  fronts = computed(() => [this.freePeoples(), this.shadow()]);

  regionClick = output<WotrRegion>();
  fellowshipBoxClick = output<void>();

  protected viewBox = this.mapService.getViewBox();
  protected mapWidth = this.mapService.getWidth();

  protected testGridPoints: { x: number; y: number; color: string }[] = [];

  @ViewChild(BgSvgComponent) bgSvg!: BgSvgComponent;
  @ViewChild("wotrMap") mapElementRef!: ElementRef<SVGGElement>;
  @ViewChild(BgMapZoomDirective, { static: true }) bgMapZoom!: BgMapZoomDirective;

  protected isDevMode = isDevMode();

  protected mapImageSource = this.assets.mapImageSource();

  // onUnitClick (unitNode: WotrUnitNode) {
  //   if (this.isValidUnit && this.isValidUnit[unitNode.id]) {
  //     this.unitClick.emit (unitNode.unit);

  calculateSlots() {
    const splittedViewBox = this.viewBox.split(" ");
    const width = +splittedViewBox[2];
    const height = +splittedViewBox[3];
    const screenCTM = this.mapElementRef.nativeElement.getScreenCTM()!;
    const pt = this.bgSvg.createSVGPoint();
    const coordinatesToAreaId = (x: number, y: number) => {
      pt.x = x * GRID_STEP;
      pt.y = y * GRID_STEP;
      // this.testGridPoints.push ({ x: pt.x, y: pt.y, color: "black" });
      const clientP = pt.matrixTransform(screenCTM);
      const elementId: string | undefined = document.elementFromPoint(clientP.x, clientP.y)?.id;
      if (elementId && elementId.startsWith("wotr-region-")) {
        return elementId.slice(12) as WotrRegionId;
      } else {
        return null;
      }
    };
    const xMax = width / GRID_STEP;
    const yMax = height / GRID_STEP;
    const slots = this.slotsGeneratorService.generateSlots(
      this.regions(),
      xMax,
      yMax,
      coordinatesToAreaId
    );
    downloadUtil.downloadJson(slots, "wotr-map-slots.json");
  }
}

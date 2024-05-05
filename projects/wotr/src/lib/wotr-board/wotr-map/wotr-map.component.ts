import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, ViewChild, inject, input, isDevMode } from "@angular/core";
import { BgMapZoomDirective, BgSvgComponent, BgSvgModule } from "@leobg/commons";
import { downloadUtil } from "@leobg/commons/utils";
import { WotrAssetsService } from "../../wotr-assets.service";
import { WotrCompanion, WotrCompanionId } from "../../wotr-elements/wotr-companion.models";
import { WotrFellowship } from "../../wotr-elements/wotr-fellowhip.models";
import { WotrFront } from "../../wotr-elements/wotr-front.models";
import { WotrHuntState } from "../../wotr-elements/wotr-hunt.store";
import { WotrMinion, WotrMinionId } from "../../wotr-elements/wotr-minion.models";
import { WotrNation } from "../../wotr-elements/wotr-nation.models";
import { WotrRegion, WotrRegionId } from "../../wotr-elements/wotr-region.models";
import { WotrElvenRingsBoxComponent } from "./wotr-elven-rings-box.component";
import { WotrEventCardBoxesComponent } from "./wotr-event-card-boxes.component";
import { WotrFellowshipBoxComponent } from "./wotr-fellowship-box.component";
import { WotrFellowshipTrackComponent } from "./wotr-fellowship-track.component";
import { WotrHuntBoxComponent } from "./wotr-hunt-box.component";
import { WotrMapSlotsGeneratorService } from "./wotr-map-slots-generator.service";
import { WotrMapService } from "./wotr-map.service";
import { WotrPoliticalTrackComponent } from "./wotr-political-track.component";
import { WotrRegionsComponent } from "./wotr-regions.component";

const GRID_STEP = 10;

@Component ({
  selector: "wotr-map",
  standalone: true,
  imports: [
    BgSvgModule,
    WotrRegionsComponent,
    WotrPoliticalTrackComponent, WotrHuntBoxComponent,
    WotrFellowshipTrackComponent, WotrFellowshipBoxComponent,
    WotrElvenRingsBoxComponent, WotrEventCardBoxesComponent
  ],
  template: `
    <svg:svg bgSvg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="100%"
      height="100%"
      [attr.viewBox]="viewBox"
      preserveAspectRatio="xMidYMin">
      <svg:g #wotrMap [bgMapZoom]="{ translateX: 0, translateY: 0, scale: 1 }">
        <image [attr.width]="mapWidth" 
          [attr.xlink:href]="mapImageSource">
        </image>
        <svg:g wotrRegions [regions]="regions ()"
          [companionById]="companionById ()" [minionById]="minionById ()"
          (regionClick)="regionClick.next ($event)"></svg:g>
        <svg:g wotrPoliticalTrack [nations]="nations ()"></svg:g>
        <svg:g wotrHuntBox [hunt]="hunt ()"></svg:g>
        <svg:g wotrFellowshipTrack [fellowship]="fellowship ()"></svg:g>
        <svg:g wotrFellowshipBox [fellowship]="fellowship ()"></svg:g>
        <svg:g wotrElvenRingsBox
          [freePeopleElvenRings]="freePeople ().elvenRings"
          [shadowElvenRings]="shadow ().elvenRings"></svg:g>
        <svg:g wotrEventCardBoxes
          [freePeople]="freePeople ()"
          [shadow]="shadow ()"></svg:g>
      </svg:g>
    </svg:svg>
    @if (isDevMode) {
      <button style="position: absolute; bottom: 0; left: 0;" (click)="calculateSlots ()">Calculate slots</button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrMapComponent {

  private mapService = inject (WotrMapService);
  private assets = inject (WotrAssetsService);
  private slotsGeneratorService = inject (WotrMapSlotsGeneratorService);

  regions = input.required<WotrRegion[]> ();
  nations = input.required<WotrNation[]> ();
  hunt = input.required<WotrHuntState[]> ();
  freePeople = input.required<WotrFront> ();
  shadow = input.required<WotrFront> ();
  fellowship = input.required<WotrFellowship[]> ();
  companionById = input.required<Record<WotrCompanionId, WotrCompanion>> ();
  minionById = input.required<Record<WotrMinionId, WotrMinion>> ();

  // @Input () validRegions: WotrRegionId[] | null = null;

  @Output () regionClick = new EventEmitter<WotrRegion> ();

  protected viewBox = this.mapService.getViewBox ();
  protected mapWidth = this.mapService.getWidth ();

  protected testGridPoints: { x: number; y: number; color: string }[] = [];

  @ViewChild (BgSvgComponent) bgSvg!: BgSvgComponent;
  @ViewChild ("wotrMap") mapElementRef!: ElementRef<SVGGElement>;
  @ViewChild (BgMapZoomDirective, { static: true }) bgMapZoom!: BgMapZoomDirective;

  protected isDevMode = isDevMode ();

  protected mapImageSource = this.assets.getMapImageSource ();

  // onUnitClick (unitNode: WotrUnitNode) {
  //   if (this.isValidUnit && this.isValidUnit[unitNode.id]) {
  //     this.unitClick.emit (unitNode.unit);

  calculateSlots () {
    const splittedViewBox = this.viewBox.split (" ");
    const width = +splittedViewBox[2];
    const height = +splittedViewBox[3];
    const screenCTM = this.mapElementRef.nativeElement.getScreenCTM ()!;
    const pt = this.bgSvg.createSVGPoint ();
    const coordinatesToAreaId = (x: number, y: number) => {
      pt.x = x * GRID_STEP;
      pt.y = y * GRID_STEP;
      // this.testGridPoints.push ({ x: pt.x, y: pt.y, color: "black" });
      const clientP = pt.matrixTransform (screenCTM);
      const elementId: string | undefined = document.elementFromPoint (clientP.x, clientP.y)?.id;
      if (elementId && elementId.startsWith ("wotr-region-")) {
        return elementId.slice (12) as WotrRegionId;
      } else {
        return null;
      }
    };
    const xMax = width / GRID_STEP;
    const yMax = height / GRID_STEP;
    const slots = this.slotsGeneratorService.generateSlots (
      this.regions (),
      xMax,
      yMax,
      coordinatesToAreaId
    );
    downloadUtil.downloadJson (slots, "wotr-map-slots.json");
  }

}

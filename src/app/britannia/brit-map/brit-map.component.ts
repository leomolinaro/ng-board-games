import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, TrackByFunction, ViewChild } from "@angular/core";
import { BgSvgComponent } from "@bg-components/svg";
import { arrayUtil, SimpleChanges } from "@bg-utils";
import { BritArea, BritAreaId, BritUnit, BritUnitId, isBritLandAreaId } from "../brit-models";
import { BritMapPoint, BritMapSlotsService } from "./brit-map-slots.service";
import { BritMapService } from "./brit-map.service";

export interface BritAreaNode {
  id: BritAreaId;
  area: BritArea;
  path: string;
  unitNodes: BritUnitNode[];
  unitNodeMap: Record<BritUnitId, BritUnitNode>;
} // BritAreaNode

interface BritUnitNode {
  id: BritUnitId;
  unit: BritUnit;
  imageSource: string;
  index: number;
} // BritUnitNode

const GRID_STEP = 20;

@Component ({
  selector: "brit-map",
  templateUrl: "./brit-map.component.html",
  styleUrls: ["./brit-map.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritMapComponent implements OnChanges {

  constructor (
    private mapService: BritMapService,
    private slotsService: BritMapSlotsService,
    private cd: ChangeDetectorRef
  ) { }

  @Input () areas!: BritArea[];
  @Input () unitsMap!: Record<BritUnitId, BritUnit>;
  // in caso di update dell'unità in un'area, bisogna cambiare il riferimento delle BritArea.units

  areaNodes!: BritAreaNode[];
  private areaNodeMap!: Record<BritAreaId, BritAreaNode>;
  viewBox = this.mapService.getViewBox ();
  mapWidth = this.mapService.getWidth ();

  testGridPoints: { x: number; y: number; color: string }[] | undefined = [];

  @ViewChild (BgSvgComponent) bgSvg!: BgSvgComponent;
  @ViewChild ("britMapMap") mapElementRef!: ElementRef<SVGGElement>;

  slotsReady = false;

  areaTrackBy: TrackByFunction<BritAreaNode> = (index: number, areaNode: BritAreaNode) => areaNode.id;
  unitTrackBy: TrackByFunction<BritUnitNode> = (index: number, unitNode: BritUnitNode) => unitNode.id;

  ngOnChanges (changes: SimpleChanges<BritMapComponent>) {
    if (changes.areas) {
      const { nodes, map } = arrayUtil.entitiesToNodes (
        this.areas, this.areaNodeMap || { },
        area => area.id,
        (area, node) => area === node.area,
        (area, index, oldNode) => this.areaToNode (area, oldNode)
      );
      this.areaNodes = nodes;
      this.areaNodeMap = map;
    } // if
  } // ngOnChanges

  ngAfterViewInit () {
    setTimeout (() => {
      this.generateSlots ();
      this.slotsReady = true;
      this.cd.markForCheck ();
    }, 1500);
  } // ngAfterViewInit

  private generateSlots () {
    const splittedViewBox = this.viewBox.split (" ");
    const width = +splittedViewBox[2];
    const height = +splittedViewBox[3];
    const screenCTM = this.mapElementRef.nativeElement.getScreenCTM ()!
    const pt = this.bgSvg.createSVGPoint ();
    const coordinatesToAreaId = (x: number, y: number) => {
      pt.x = x * GRID_STEP;
      pt.y = y * GRID_STEP;
      const clientP = pt.matrixTransform (screenCTM);
      const elementId: string | undefined = document.elementFromPoint (clientP.x, clientP.y)?.id;
      if (elementId && elementId.startsWith ("brit-area-")) {
        return elementId.slice (10) as BritAreaId;
      } else {
        return null;
      } // if - else
    };
    const xMax = width / GRID_STEP;
    const yMax = height / GRID_STEP;
    this.slotsService.generateSlots (xMax, yMax, coordinatesToAreaId);
  } // generateSlots

  private areaToNode (area: BritArea, oldNode: BritAreaNode | null): BritAreaNode {
    const path = this.mapService.getPath (area.id);
    let unitNodes: BritUnitNode[];
    let unitNodeMap: Record<BritUnitId, BritUnitNode>;
    if (area.units === oldNode?.area.units) {
      unitNodes = oldNode.unitNodes;
      unitNodeMap = oldNode.unitNodeMap;
    } else {
      const { nodes, map } = arrayUtil.entitiesToNodes<string, BritUnitNode> (
        area.units, oldNode?.unitNodeMap || { },
        unitId => unitId,
        (unitId, node) => this.unitsMap[unitId] === node.unit,
        (unitId, index, oldNode) => this.unitToNode (unitId, index, oldNode, area)
      );
      unitNodes = nodes;
      unitNodeMap = map;
    } // if - else
    return {
      id: area.id,
      area,
      path,
      unitNodes,
      unitNodeMap
    };
  } // areaToNode

  private unitToNode (unitId: BritUnitId, index: number, oldNode: BritUnitNode | null, area: BritArea): BritUnitNode {
    const unit = this.unitsMap[unitId]
    const imageSource = this.getUnitImageSource (unit);
    return {
      id: unitId,
      unit,
      imageSource,
      index
    };
  } // unitToNode

  private getUnitImageSource (unit: BritUnit) {
    switch (unit.type) {
      case "infantry": return `assets/britannia/infantries/${unit.nation}.png`;
      case "cavalry": return `assets/britannia/cavalries/${unit.nation}.png`;
      case "roman-fort": return `assets/britannia/buildings/roman-fort.png`;
      case "saxon-buhr": return `assets/britannia/buildings/saxon-buhr.png`;
      case "leader": return `assets/britannia/leaders/${unit.id}.png`;
    } // switch
  } // getUnitImageSource

  onAreaClick (areaNode: BritAreaNode, event: MouseEvent) {
    if (isBritLandAreaId (areaNode.id)) {
      this.testGridPoints = [
        ...this.slotsService.getLandInnerPoints (areaNode.id).map (s => ({ x: s.x * GRID_STEP, y: s.y * GRID_STEP, color: "blue" })),
        ...this.slotsService.getLandBorderPoints (areaNode.id).map (s => ({ x: s.x * GRID_STEP, y: s.y * GRID_STEP, color: "red" })),
        ...this.slotsService.getAreaSlots (1, areaNode.id).map (s => ({ x: s.x * GRID_STEP, y: s.y * GRID_STEP, color: "black" }))
      ];
    } else {
      this.testGridPoints = [];
    } // if - else
  } // onAreaClick

  getUnitNodeX = (unitNode: BritUnitNode, areaNode: BritAreaNode) => {
    const point = this.getUnitNodePoint (unitNode, areaNode);
    if (!point) { return 0; }
    return point.x * GRID_STEP - 15;
  } // getUnitNodeX

  getUnitNodeY = (unitNode: BritUnitNode, areaNode: BritAreaNode) => {
    const point = this.getUnitNodePoint (unitNode, areaNode);
    if (!point) { return 0; }
    return point.y * GRID_STEP - 15;
  } // getUnitNodeY

  private getUnitNodePoint (unitNode: BritUnitNode, areaNode: BritAreaNode): BritMapPoint | null {
    if (!this.slotsReady) { return null; }
    const slots = this.slotsService.getAreaSlots (areaNode.unitNodes.length, areaNode.id);
    return slots[unitNode.index];
  } // getUnitNodeX

} // BritMapComponent

import { NgClass, NgForOf } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, TrackByFunction, ViewChild } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BgMapZoomDirective, BgSvgComponent, BgSvgModule } from "@leobg/commons";
import { SimpleChanges as BgSimpleChanges, arrayUtil } from "@leobg/commons/utils";
import { WotrAssetsService } from "../../wotr-assets.service";
import { WotrRegion, WotrRegionId } from "../../wotr-components.models";
import { WotrComponentsService } from "../../wotr-components.service";
import { WotrRegionState } from "../../wotr-game-state.models";
import { WotrMapService } from "./wotr-map.service";

interface WotrRegionNode {
  id: WotrRegionId;
  region: WotrRegion;
  state: WotrRegionState;
  path: string;
  // unitNodes: WotrUnitNode[];
  tooltip: string;
} // WotrRegionNode

// interface WotrUnitNode {
//   id: string;
//   unit: WotrRegionUnit;
//   imageSource: string;
//   index: number;
//   regionNode: WotrRegionNode;
//   svgX: number;
//   svgY: number;
//   tooltip: string;
//   quantity: number;
// } // WotrUnitNode

// interface WotrPopulationNode {
//   id: WotrPopulation;
//   nationNodes: WotrNationPopulationNode[];
//   path: string;
//   tooltip: string;
// } // WotrPopulationNode

// interface WotrNationPopulationNode {
//   id: WotrNationId;
//   nation: WotrNation;
//   state: WotrNationState;
//   imageSource: string;
//   tooltip: string;
// } // WotrNationPopulationNode

// interface WotrNationTurnNode {
//   id: WotrNationId;
//   nation: WotrNation;
//   state: WotrNationState;
//   path: string;
//   tooltip: string;
// } // WotrNationTurnNode

// interface WotrRoundNode {
//   id: WotrRoundId;
//   round: WotrRound;
//   path: string;
//   eventNodes: WotrEventNode[];
//   scoringPath: string | null;
//   tooltip: string;
// } // WotrRoundNode

// interface WotrEventNode {
//   id: string;
//   event: WotrEvent;
//   path: string;
//   tooltip: string;
// } // WotrEventNode

// const GRID_STEP = 20;

@Component ({
  selector: "wotr-map",
  standalone: true,
  imports: [BgSvgModule, MatTooltipModule, NgClass, NgForOf],
  templateUrl: "./wotr-map.component.html",
  styleUrls: ["./wotr-map.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrMapComponent implements OnChanges {

  constructor (
    private mapService: WotrMapService,
    private assetsService: WotrAssetsService,
    private components: WotrComponentsService,
    private cd: ChangeDetectorRef
  ) { }

  @Input () regionStates!: Record<WotrRegionId, WotrRegionState>;
  // @Input () nationStates!: Record<WotrNationId, WotrNationState>;
  @Input () validRegions: WotrRegionId[] | null = null;
  // @Input () validUnits: WotrRegionUnit[] | null = null;
  // @Input () selectedUnits: WotrRegionUnit[] | null = null;
  // // in caso di update dell'unità in un'region, bisogna cambiare il riferimento delle WotrRegion.units

  @Output () regionClick = new EventEmitter<WotrRegionId> ();
  // @Output () unitClick = new EventEmitter<WotrRegionUnit> ();

  regionNodes!: WotrRegionNode[];
  private regionNodeMap!: Record<WotrRegionId, WotrRegionNode>;
  viewBox = this.mapService.getViewBox ();
  mapWidth = this.mapService.getWidth ();

  testGridPoints: { x: number; y: number; color: string }[] | undefined = [];

  isValidRegion: Record<string, boolean> | null = null;
  isValidUnit: Record<string, boolean> | null = null;
  nSelectedUnits: Record<string, number> | null = null;

  @ViewChild (BgSvgComponent) bgSvg!: BgSvgComponent;
  @ViewChild ("wotrMap") mapElementRef!: ElementRef<SVGGElement>;
  @ViewChild (BgMapZoomDirective, { static: true }) bgMapZoom!: BgMapZoomDirective;

  production = true; // environment.production;

  regionTrackBy: TrackByFunction<WotrRegionNode> = (index: number, regionNode: WotrRegionNode) => regionNode.id;

  protected mapImageSource = this.assetsService.getMapImageSource ();

  ngOnChanges (changes: BgSimpleChanges<this>) {
    if (changes.regionStates) {
      this.refreshRegionNodes ();
    } // if
  } // ngOnChanges

  private refreshRegionNodes (): boolean {
    const refreshedUnits = false;
    const { nodes, map } = arrayUtil.entitiesToNodes (
      this.components.REGION_IDS,
      this.regionNodeMap || {},
      (regionId) => regionId,
      (regionId, node) => this.regionStates[regionId] === node.state,
      (regionId, index, oldNode) => this.regionToNode (regionId, oldNode)
    );
    this.regionNodes = nodes;
    this.regionNodeMap = map;
    return refreshedUnits;
  } // refreshRegionNodes

  private regionToNode (regionId: WotrRegionId, oldNode: WotrRegionNode | null): WotrRegionNode {
    const path = this.mapService.getRegionPath (regionId);
    const region = this.components.REGION[regionId];
    const state = this.regionStates[regionId];
    const node: WotrRegionNode = {
      id: regionId,
      region,
      state,
      path,
      // unitNodes: null!,
      tooltip: region.name,
    };
    // if (state.units === oldNode?.state.units) {
    //   node.unitNodes = oldNode.unitNodes;
    // } else {
    //   node.unitNodes = state.units.map ((u, index) =>
    //     this.unitToNode (u, index, node, state.units.length)
    //   );
    // } // if - else
    return node;
  } // regionToNode

  // private getUnitNodeId (unit: WotrRegionUnit) {
  //   return unit.type === "leader"
  //     ? unit.leaderId
  //     : `${unit.nationId}-${unit.type}-${unit.regionId}`;
  // } // getUnitNodeId

  // private unitToNode (unit: WotrRegionUnit, index: number, regionNode: WotrRegionNode, nRegionUnits: number): WotrUnitNode {
  //   const imageSource = this.assetsService.getUnitImageSource (unit);
  //   const point = this.getUnitNodePoint (index, nRegionUnits, regionNode.id);
  //   return {
  //     id: this.getUnitNodeId (unit),
  //     unit,
  //     imageSource,
  //     index,
  //     regionNode,
  //     svgX: point ? point.x * GRID_STEP - 15 : 0,
  //     svgY: point ? point.y * GRID_STEP - 15 : 0,
  //     quantity: unit.type === "leader" ? 1 : unit.quantity,
  //     tooltip: unit.type === "leader"
  //       ? this.components.getLeader (unit.leaderId).name
  //       : `${this.components.getNation (unit.nationId).label} ${this.components.getUnitTypeLabel (unit.type, true)}`,
  //   };
  // } // unitToNode

  // private getUnitNodePoint (unitIndex: number, nRegionUnits: number, regionId: WotrRegionId): WotrMapPoint | null {
  //   const slots = this.mapService.getRegionSlots (nRegionUnits, regionId);
  //   return slots[unitIndex];
  // } // getUnitNodePoint

  onRegionClick (regionNode: WotrRegionNode, event: MouseEvent) {
    if (this.validRegions?.includes (regionNode.id)) {
      this.regionClick.emit (regionNode.id);
    } // if
  } // onRegionClick

  // onUnitClick (unitNode: WotrUnitNode) {
  //   if (this.isValidUnit && this.isValidUnit[unitNode.id]) {
  //     this.unitClick.emit (unitNode.unit);
  //   } // if
  // } // onUnitClick

} // WotrMapComponent

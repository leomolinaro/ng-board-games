import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, TrackByFunction, ViewChild } from "@angular/core";
import { BgMapZoomDirective, BgSvgComponent } from "@bg-components/svg";
import { arrayUtil, downloadUtil, objectUtil, SimpleChanges } from "@bg-utils";
import { environment } from "src/environments/environment";
import { BritAssetsService } from "../brit-assets.service";
import { BritArea, BritAreaId, BritEvent, BritNation, BritNationId, BritPopulation, BritRound, BritRoundId, BritUnit, BritUnitId } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritMapSlotsGeneratorService } from "./brit-map-slots-generator.service";
import { BritMapPoint, BritMapService } from "./brit-map.service";

interface BritAreaNode {
  id: BritAreaId;
  area: BritArea;
  path: string;
  unitNodes: BritUnitNode[];
  tooltip: string;
} // BritAreaNode

interface BritUnitNode {
  id: BritUnitId;
  unit: BritUnit;
  imageSource: string;
  index: number;
  areaNode: BritAreaNode;
  svgX: number;
  svgY: number;
  tooltip: string;
  quantity: number;
} // BritUnitNode

interface BritPopulationNode {
  id: BritPopulation;
  nationNodes: BritNationPopulationNode[];
  path: string;
  tooltip: string;
} // BritPopulationNode

interface BritNationPopulationNode {
  id: BritNationId;
  nation: BritNation;
  imageSource: string;
  tooltip: string;
} // BritNationPopulationNode

interface BritNationTurnNode {
  id: BritNationId;
  nation: BritNation;
  path: string;
  tooltip: string;
} // BritNationTurnNode

interface BritRoundNode {
  id: BritRoundId;
  round: BritRound;
  path: string;
  eventNodes: BritEventNode[];
  scoringPath: string | null;
  tooltip: string;
} // BritRoundNode

interface BritEventNode {
  id: string;
  event: BritEvent;
  path: string;
  tooltip: string;
} // BritEventNode

const GRID_STEP = 20;

@Component ({
  selector: "brit-map",
  templateUrl: "./brit-map.component.html",
  styleUrls: ["./brit-map.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BritMapComponent implements OnChanges {

  constructor (
    private mapService: BritMapService,
    private slotsGeneratorService: BritMapSlotsGeneratorService,
    private assetsService: BritAssetsService,
    private components: BritComponentsService,
    private cd: ChangeDetectorRef
  ) { }

  @Input () areas!: BritArea[];
  @Input () unitsMap!: Record<BritUnitId, BritUnit>;
  @Input () nations!: BritNation[];
  @Input () rounds!: BritRound[];
  @Input () validAreas: BritAreaId[] | null = null;
  @Input () validUnits: BritUnitId[] | null = null;
  // in caso di update dell'unità in un'area, bisogna cambiare il riferimento delle BritArea.units

  @Output () areaClick = new EventEmitter<BritAreaId> ();
  @Output () unitClick = new EventEmitter<BritUnitId> ();

  areaNodes!: BritAreaNode[];
  private areaNodeMap!: Record<BritAreaId, BritAreaNode>;
  viewBox = this.mapService.getViewBox ();
  mapWidth = this.mapService.getWidth ();
  populationNodes: BritPopulationNode[] = this.components.POPULATIONS.map (populationId => ({
    id: populationId,
    nationNodes: [],
    path: this.mapService.getPopulationTrackPath (populationId),
    tooltip: `${populationId} Population`
  }));
  private nationPopulationNodeMap!: Record<BritNationId, BritNationPopulationNode>;
  nationTurnNodes!: BritNationTurnNode[];
  private nationTurnNodeMap!: Record<BritNationId, BritNationTurnNode>;
  roundNodes!: BritRoundNode[];
  private roundNodeMap!: Record<BritRoundId, BritRoundNode>;

  testGridPoints: { x: number; y: number; color: string }[] | undefined = [];

  isValidArea: Record<string, boolean> | null = null;
  isValidUnit: Record<string, boolean> | null = null;

  @ViewChild (BgSvgComponent) bgSvg!: BgSvgComponent;
  @ViewChild ("britMap") mapElementRef!: ElementRef<SVGGElement>;
  @ViewChild (BgMapZoomDirective, { static: true }) bgMapZoom!: BgMapZoomDirective;

  production = environment.production;

  areaTrackBy: TrackByFunction<BritAreaNode> = (index: number, areaNode: BritAreaNode) => areaNode.id;
  unitTrackBy: TrackByFunction<BritUnitNode> = (index: number, unitNode: BritUnitNode) => unitNode.id;
  populationTrackBy: TrackByFunction<BritPopulationNode> = (index: number, populationNode: BritPopulationNode) => populationNode.id;
  nationTurnTrackBy: TrackByFunction<BritNationTurnNode> = (index: number, nationTurnNode: BritNationTurnNode) => nationTurnNode.id;
  roundTrackBy: TrackByFunction<BritRoundNode> = (index: number, roundNode: BritRoundNode) => roundNode.id;
  eventTrackBy: TrackByFunction<BritEventNode> = (index: number, eventNode: BritEventNode) => eventNode.event.nation;
  nationPopulationTrackBy: TrackByFunction<BritNationPopulationNode> = (index: number, nationPopulationNode: BritNationPopulationNode) => nationPopulationNode.id;

  ngOnChanges (changes: SimpleChanges<BritMapComponent>) {
    if (changes.areas && this.areas?.length) {
      this.refreshAreaNodes (false);
    } // if
    if (changes.nations) {
      this.refreshPopulationNodes ();
      this.refreshNationTurnNodes ();
    } // if
    if (changes.rounds) {
      this.refreshRoundNodes ();
    } // if
    if (changes.validAreas) {
      this.isValidArea = this.validAreas ? arrayUtil.toMap (this.validAreas, id => id, () => true) : null;
    } // if
    if (changes.validUnits) {
      this.isValidUnit = this.validUnits ? arrayUtil.toMap (this.validUnits, id => id, () => true) : null;
    } // if
  } // ngOnChanges

  private refreshAreaNodes (force: boolean): boolean {
    let refreshedUnits = false;
    const { nodes, map } = arrayUtil.entitiesToNodes (
      this.areas, this.areaNodeMap || { },
      area => area.id,
      (area, node) => !force && area === node.area,
      (area, index, oldNode) => this.areaToNode (area, oldNode, force)
    );
    this.areaNodes = nodes;
    this.areaNodeMap = map;
    return refreshedUnits;
  } // refreshAreaNodes

  private refreshPopulationNodes () {
    const { nodes, map } = arrayUtil.entitiesToNodes (
      this.nations, this.nationPopulationNodeMap || { },
      nation => nation.id,
      (nation, node) => nation === node.nation,
      (nation, index, oldNode) => this.nationToPopulationNode (nation, oldNode)
    );
    this.nationPopulationNodeMap = map;
    this.populationNodes.map (pn => ({
      id: pn.id,
      nationNodes: []
    }));
    this.populationNodes.forEach (pn => pn.nationNodes = []);
    nodes.forEach (nationNode => {
      const population = nationNode.nation.population;
      if (population != null) {
        const populationNode = this.populationNodes[population];
        populationNode.nationNodes.push (nationNode);
      } // if
    });
  } // refreshPopulationNodes

  private refreshNationTurnNodes () {
    const { nodes, map } = arrayUtil.entitiesToNodes (
      this.nations, this.nationTurnNodeMap || { },
      nation => nation.id,
      (nation, node) => nation === node.nation,
      (nation, index, oldNode) => this.nationToTurnNode (nation, oldNode)
    );
    this.nationTurnNodes = nodes;
    this.nationTurnNodeMap = map;
  } // refreshNationTurnNodes

  private refreshRoundNodes () {
    const { nodes, map } = arrayUtil.entitiesToNodes (
      this.rounds, this.roundNodeMap || { },
      round => round.id,
      (round, node) => round === node.round,
      (round, index, oldNode) => this.roundToNode (round, oldNode)
    );
    this.roundNodes = nodes;
    this.roundNodeMap = map;
  } // refreshRoundNodes

  private areaToNode (area: BritArea, oldNode: BritAreaNode | null, force: boolean): BritAreaNode {
    const path = this.mapService.getAreaPath (area.id);
    const node: BritAreaNode = {
      id: area.id,
      area,
      path,
      unitNodes: null!,
      tooltip: area.name
    };
    if (!force && area.units === oldNode?.area.units) {
      node.unitNodes = oldNode.unitNodes;
    } else {
      const unitsByKey = arrayUtil.group (
        area.units.map (unitId => this.unitsMap[unitId]),
        u => u.type === "leader" ? u.id : `${u.nation}-${u.type}`);
      const unitGroups: BritUnit[][] = [];
      objectUtil.forEachProp (unitsByKey, (key, units) => { unitGroups.push (units); });
      node.unitNodes = [];
      let index = 0;
      unitGroups.forEach (unitGroup => {
        node.unitNodes.push (this.unitToNode (unitGroup, index++, node, unitGroups.length));
      });
    } // if - else
    return node;
  } // areaToNode

  private unitToNode (unitGroup: BritUnit[], index: number, areaNode: BritAreaNode, nAreaUnits: number): BritUnitNode {
    const unit = unitGroup[0];
    const imageSource = this.assetsService.getUnitImageSource (unit);
    const point = this.getUnitNodePoint (index, nAreaUnits, areaNode.id);
    return {
      id: unit.type === "leader" ? unit.id : `${unit.nation}-${unit.type}`,
      unit,
      imageSource,
      index,
      areaNode,
      svgX: point ? (point.x * GRID_STEP - 15) : 0,
      svgY: point ? (point.y * GRID_STEP - 15) : 0,
      quantity: unitGroup.length,
      tooltip: unit.type === "leader" ? unit.name : (unit.nationLabel + " " + unit.typeLabel)
    };
  } // unitToNode

  private getUnitNodePoint (unitIndex: number, nAreaUnits: number, areaId: BritAreaId): BritMapPoint | null {
    const slots = this.mapService.getAreaSlots (nAreaUnits, areaId);
    return slots[unitIndex];
  } // getUnitNodePoint

  private nationToTurnNode (nation: BritNation, oldNode: BritNationTurnNode | null): BritNationTurnNode {
    if (oldNode) {
      return oldNode;
    } else {
      return {
        id: nation.id,
        nation: nation,
        path: this.mapService.getNationTurnPath (nation.id),
        tooltip: nation.label
      };
    } // if - else
  } // nationToTurnNode

  private roundToNode (round: BritRound, oldNode: BritRoundNode | null): BritRoundNode {
    if (oldNode) {
      return oldNode;
    } else {
      const eventNodes: BritEventNode[] = round.events.map (event => ({
        event,
        id: event.nation,
        path: this.mapService.getEventPath (round.id, event.nation),
        tooltip: this.nationTurnNodeMap[event.nation]?.nation.label
      }));
      return {
        id: round.id,
        round: round,
        path: this.mapService.getRoundPath (round.id),
        scoringPath: this.mapService.getScoringRoundPath (round.id) || null,
        eventNodes,
        tooltip: `Round ${round.id}\n(${round.fromYear}-${round.toYear})`
      };
    } // if - else
  } // roundToNode

  private nationToPopulationNode (nation: BritNation, oldNode: BritNationPopulationNode | null): BritNationPopulationNode {
    return {
      id: nation.id,
      nation: nation,
      imageSource: this.assetsService.getNationPopulationMarkerImageSource (nation.id),
      tooltip: nation.label
    };
  } // nationToPopulationNode

  onAreaClick (areaNode: BritAreaNode, event: MouseEvent) {
    if (this.validAreas?.includes (areaNode.id)) {
      this.areaClick.emit (areaNode.id);
    } // if
  } // onAreaClick

  getNationPopulationNodeX = (nationNode: BritNationPopulationNode, index: number, populationNode: BritPopulationNode) => {
    return this.mapService.getPopulationX (populationNode.id, index) * GRID_STEP;
  }; // getNationPopulationNodeX

  getNationPopulationNodeY = (nationNode: BritNationPopulationNode, index: number, populationNode: BritPopulationNode) => {
    return this.mapService.getPopulationY (populationNode.id, index) * GRID_STEP;
  }; // getNationPopulationNodeY

  calculateSlots () {
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
    const slots = this.slotsGeneratorService.generateSlots (xMax, yMax, coordinatesToAreaId);
    downloadUtil.downloadJson (slots, "britannia-map-slots.json");
  } // calculateSlots

} // BritMapComponent

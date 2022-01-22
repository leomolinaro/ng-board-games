import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, TrackByFunction, ViewChild } from "@angular/core";
import { BgMapZoomDirective, BgSvgComponent } from "@bg-components/svg";
import { arrayUtil, SimpleChanges } from "@bg-utils";
import { BRIT_POPULATIONS } from "../brit-constants";
import { BritArea, BritAreaId, BritEvent, BritNation, BritNationId, BritPopulation, BritRound, BritRoundId, BritUnit, BritUnitId } from "../brit-models";
import { BritMapPoint, BritMapSlotsService } from "./brit-map-slots.service";
import { BritMapService } from "./brit-map.service";

interface BritAreaNode {
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

interface BritPopulationNode {
  id: BritPopulation;
  nationNodes: BritNationPopulationNode[];
  path: string;
} // BritPopulationNode

interface BritNationPopulationNode {
  id: BritNationId;
  nation: BritNation;
  imageSource: string;
} // BritNationPopulationNode

interface BritNationTurnNode {
  id: BritNationId;
  nation: BritNation;
  path: string;
} // BritNationTurnNode

interface BritRoundNode {
  id: BritRoundId;
  round: BritRound;
  path: string;
  eventNodes: BritEventNode[];
  scoringPath: string | null;
} // BritRoundNode

interface BritEventNode {
  id: string;
  event: BritEvent;
  path: string;
} // BritEventNode

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
  @Input () nations!: BritNation[];
  @Input () rounds!: BritRound[];
  // in caso di update dell'unità in un'area, bisogna cambiare il riferimento delle BritArea.units

  areaNodes!: BritAreaNode[];
  private areaNodeMap!: Record<BritAreaId, BritAreaNode>;
  viewBox = this.mapService.getViewBox ();
  mapWidth = this.mapService.getWidth ();
  populationNodes: BritPopulationNode[] = BRIT_POPULATIONS.map (populationId => ({
    id: populationId,
    nationNodes: [],
    path: this.mapService.getPopulationTrackPath (populationId)
  }));
  private nationPopulationNodeMap!: Record<BritNationId, BritNationPopulationNode>;
  nationTurnNodes!: BritNationTurnNode[];
  private nationTurnNodeMap!: Record<BritNationId, BritNationTurnNode>;
  roundNodes!: BritRoundNode[];
  private roundNodeMap!: Record<BritRoundId, BritRoundNode>;

  testGridPoints: { x: number; y: number; color: string }[] | undefined = [];

  @ViewChild (BgSvgComponent) bgSvg!: BgSvgComponent;
  @ViewChild ("britMap") mapElementRef!: ElementRef<SVGGElement>;
  @ViewChild (BgMapZoomDirective, { static: true }) bgMapZoom!: BgMapZoomDirective;

  slotsReady = false;

  areaTrackBy: TrackByFunction<BritAreaNode> = (index: number, areaNode: BritAreaNode) => areaNode.id;
  unitTrackBy: TrackByFunction<BritUnitNode> = (index: number, unitNode: BritUnitNode) => unitNode.id;
  populationTrackBy: TrackByFunction<BritPopulationNode> = (index: number, populationNode: BritPopulationNode) => populationNode.id;
  nationTurnTrackBy: TrackByFunction<BritNationTurnNode> = (index: number, nationTurnNode: BritNationTurnNode) => nationTurnNode.id;
  roundTrackBy: TrackByFunction<BritRoundNode> = (index: number, roundNode: BritRoundNode) => roundNode.id;
  eventTrackBy: TrackByFunction<BritEventNode> = (index: number, eventNode: BritEventNode) => eventNode.event.nation;
  nationPopulationTrackBy: TrackByFunction<BritNationPopulationNode> = (index: number, nationPopulationNode: BritNationPopulationNode) => nationPopulationNode.id;

  ngOnChanges (changes: SimpleChanges<BritMapComponent>) {
    if (changes.areas) {
      this.refreshAreaNodes ();
      if (!this.slotsReady && this.areas?.length) {
        setTimeout (() => {
          this.generateSlots ();
          this.slotsReady = true;
          this.cd.markForCheck ();
        });
      } // if
    } // if
    if (changes.nations) {
      this.refreshPopulationNodes ();
      this.refreshNationTurnNodes ();
    } // if
    if (changes.rounds) {
      this.refreshRoundNodes ();
    } // if
  } // ngOnChanges

  private refreshAreaNodes () {
    const { nodes, map } = arrayUtil.entitiesToNodes (
      this.areas, this.areaNodeMap || { },
      area => area.id,
      (area, node) => area === node.area,
      (area, index, oldNode) => this.areaToNode (area, oldNode)
    );
    this.areaNodes = nodes;
    this.areaNodeMap = map;
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
    }))
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
    const path = this.mapService.getAreaPath (area.id);
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

  private nationToTurnNode (nation: BritNation, oldNode: BritNationTurnNode | null): BritNationTurnNode {
    if (oldNode) {
      return oldNode;
    } else {
      return {
        id: nation.id,
        nation: nation,
        path: this.mapService.getNationTurnPath (nation.id)
      }
    } // if - else
  } // nationToTurnNode

  private roundToNode (round: BritRound, oldNode: BritRoundNode | null): BritRoundNode {
    if (oldNode) {
      return oldNode;
    } else {
      const eventNodes: BritEventNode[] = round.events.map (event => ({
        event,
        id: event.nation,
        path: this.mapService.getEventPath (round.id, event.nation)
      }));
      return {
        id: round.id,
        round: round,
        path: this.mapService.getRoundPath (round.id),
        scoringPath: this.mapService.getScoringRoundPath (round.id) || null,
        eventNodes
      };
    } // if - else
  } // roundToNode

  private nationToPopulationNode (nation: BritNation, oldNode: BritNationPopulationNode | null): BritNationPopulationNode {
    return {
      id: nation.id,
      nation: nation,
      imageSource: this.getNationPopulationImageSource (nation)
    };
  } // nationToPopulationNode

  private getNationPopulationImageSource (nation: BritNation) {
    return `assets/britannia/population-markers/${nation.id}.png`;
  } // getNationPopulationImageSource

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
    // if (isBritLandAreaId (areaNode.id)) {
    //   this.testGridPoints = [
    //     ...this.slotsService.getLandInnerPoints (areaNode.id).map (s => ({ x: s.x * GRID_STEP, y: s.y * GRID_STEP, color: "blue" })),
    //     ...this.slotsService.getLandBorderPoints (areaNode.id).map (s => ({ x: s.x * GRID_STEP, y: s.y * GRID_STEP, color: "red" })),
    //     ...this.slotsService.getAreaSlots (1, areaNode.id).map (s => ({ x: s.x * GRID_STEP, y: s.y * GRID_STEP, color: "black" }))
    //   ];
    // } else {
    //   this.testGridPoints = [];
    // } // if - else
  } // onAreaClick

  getUnitNodeX = (unitNode: BritUnitNode, areaNode: BritAreaNode) => {
    const point = this.getUnitNodePoint (unitNode, areaNode);
    if (!point) { return 0; }
    return point.x * GRID_STEP - 15;
  }; // getUnitNodeX

  getUnitNodeY = (unitNode: BritUnitNode, areaNode: BritAreaNode) => {
    const point = this.getUnitNodePoint (unitNode, areaNode);
    if (!point) { return 0; }
    return point.y * GRID_STEP - 15;
  }; // getUnitNodeY

  private getUnitNodePoint (unitNode: BritUnitNode, areaNode: BritAreaNode): BritMapPoint | null {
    if (!this.slotsReady) { return null; }
    const slots = this.slotsService.getAreaSlots (areaNode.unitNodes.length, areaNode.id);
    return slots[unitNode.index];
  } // getUnitNodePoint

  getNationPopulationNodeX = (nationNode: BritNationPopulationNode, index: number, populationNode: BritPopulationNode) => {
    return this.slotsService.getPopulationX (populationNode.id, index) * GRID_STEP;
  }; // getNationPopulationNodeX
  
  getNationPopulationNodeY = (nationNode: BritNationPopulationNode, index: number, populationNode: BritPopulationNode) => {
    return this.slotsService.getPopulationY (populationNode.id, index) * GRID_STEP;
  }; // getNationPopulationNodeY

  getUnitTooltip = (unitNode: BritUnitNode) => {
    const unit = unitNode.unit;
    if (unit.type === "leader") {
      return unit.name;
    } else {
      return unit.nationLabel + " " + unit.typeLabel;
    } // if - else
  }; // getUnitTooltip

  getNationPopulationTooltip = (nationPopulationNode: BritNationPopulationNode) => {
    const nation = nationPopulationNode.nation;
    return nation.label;
  }; // getNationPopulationTooltip

  getNationTurnTooltip = (nationTurnNode: BritNationTurnNode) => {
    const nation = nationTurnNode.nation;
    return nation.label;
  }; // getNationTurnTooltip

  getRoundTooltip = (roundNode: BritRoundNode) => {
    const round = roundNode.round;
    return `Round ${round.id}\n(${round.fromYear}-${round.toYear})`;
  }; // getRoundTooltip

  getEventTooltip = (eventNode: BritEventNode) => {
    const event = eventNode.event;
    return this.nationTurnNodeMap[event.nation]?.nation.label;
  }; // getEventTooltip
  
  getAreaTooltip = (areaNode: BritAreaNode) => {
    const area = areaNode.area;
    return area.name;
  }; // getAreaTooltip

  getPopulationTrackTooltip = (populationNode: BritPopulationNode) => {
    return `${populationNode.id} Population`;
  }; // getPopulationTrackTooltip

} // BritMapComponent

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { BgMapZoomDirective, BgSvgComponent } from '@bg-components/svg';
import { SimpleChanges, arrayUtil, downloadUtil } from '@bg-utils';
import { environment } from '../../../environments/environment';
import { BritAssetsService } from '../brit-assets.service';
import {
  BritArea,
  BritAreaId,
  BritEvent,
  BritNation,
  BritNationId,
  BritPopulation,
  BritRound,
  BritRoundId,
} from '../brit-components.models';
import { BritComponentsService } from '../brit-components.service';
import {
  BritAreaState,
  BritAreaUnit,
  BritNationState,
} from '../brit-game-state.models';
import { BritMapSlotsGeneratorService } from './brit-map-slots-generator.service';
import { BritMapPoint, BritMapService } from './brit-map.service';

interface BritAreaNode {
  id: BritAreaId;
  area: BritArea;
  state: BritAreaState;
  path: string;
  unitNodes: BritUnitNode[];
  tooltip: string;
} // BritAreaNode

interface BritUnitNode {
  id: string;
  unit: BritAreaUnit;
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
  state: BritNationState;
  imageSource: string;
  tooltip: string;
} // BritNationPopulationNode

interface BritNationTurnNode {
  id: BritNationId;
  nation: BritNation;
  state: BritNationState;
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

@Component({
  selector: 'brit-map',
  templateUrl: './brit-map.component.html',
  styleUrls: ['./brit-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BritMapComponent implements OnChanges {
  constructor(
    private mapService: BritMapService,
    private slotsGeneratorService: BritMapSlotsGeneratorService,
    private assetsService: BritAssetsService,
    private components: BritComponentsService,
    private cd: ChangeDetectorRef
  ) {}

  @Input() areaStates!: Record<BritAreaId, BritAreaState>;
  @Input() nationStates!: Record<BritNationId, BritNationState>;
  @Input() validAreas: BritAreaId[] | null = null;
  @Input() validUnits: BritAreaUnit[] | null = null;
  @Input() selectedUnits: BritAreaUnit[] | null = null;
  // in caso di update dell'unità in un'area, bisogna cambiare il riferimento delle BritArea.units

  @Output() areaClick = new EventEmitter<BritAreaId>();
  @Output() unitClick = new EventEmitter<BritAreaUnit>();

  areaNodes!: BritAreaNode[];
  private areaNodeMap!: Record<BritAreaId, BritAreaNode>;
  viewBox = this.mapService.getViewBox();
  mapWidth = this.mapService.getWidth();
  populationNodes: BritPopulationNode[] = this.components.POPULATIONS.map(
    (populationId) => ({
      id: populationId,
      nationNodes: [],
      path: this.mapService.getPopulationTrackPath(populationId),
      tooltip: `${populationId} Population`,
    })
  );
  private nationPopulationNodeMap!: Record<
    BritNationId,
    BritNationPopulationNode
  >;
  nationTurnNodes!: BritNationTurnNode[];
  private nationTurnNodeMap!: Record<BritNationId, BritNationTurnNode>;
  roundNodes!: BritRoundNode[];
  private roundNodeMap!: Record<BritRoundId, BritRoundNode>;

  testGridPoints: { x: number; y: number; color: string }[] | undefined = [];

  isValidArea: Record<string, boolean> | null = null;
  isValidUnit: Record<string, boolean> | null = null;
  nSelectedUnits: Record<string, number> | null = null;

  @ViewChild(BgSvgComponent) bgSvg!: BgSvgComponent;
  @ViewChild('britMap') mapElementRef!: ElementRef<SVGGElement>;
  @ViewChild(BgMapZoomDirective, { static: true })
  bgMapZoom!: BgMapZoomDirective;

  production = environment.production;

  areaTrackBy: TrackByFunction<BritAreaNode> = (
    index: number,
    areaNode: BritAreaNode
  ) => areaNode.id;
  unitTrackBy: TrackByFunction<BritUnitNode> = (
    index: number,
    unitNode: BritUnitNode
  ) => unitNode.id;
  populationTrackBy: TrackByFunction<BritPopulationNode> = (
    index: number,
    populationNode: BritPopulationNode
  ) => populationNode.id;
  nationTurnTrackBy: TrackByFunction<BritNationTurnNode> = (
    index: number,
    nationTurnNode: BritNationTurnNode
  ) => nationTurnNode.id;
  roundTrackBy: TrackByFunction<BritRoundNode> = (
    index: number,
    roundNode: BritRoundNode
  ) => roundNode.id;
  eventTrackBy: TrackByFunction<BritEventNode> = (
    index: number,
    eventNode: BritEventNode
  ) => eventNode.event.nation;
  nationPopulationTrackBy: TrackByFunction<BritNationPopulationNode> = (
    index: number,
    nationPopulationNode: BritNationPopulationNode
  ) => nationPopulationNode.id;

  ngOnChanges(changes: SimpleChanges<BritMapComponent>) {
    if (changes.areaStates) {
      this.refreshAreaNodes();
    } // if
    if (changes.nationStates) {
      this.refreshPopulationNodes();
      this.refreshNationTurnNodes();
    } // if
    if (changes.validAreas) {
      this.isValidArea = this.validAreas
        ? arrayUtil.toMap(
            this.validAreas,
            (id) => id,
            () => true
          )
        : null;
      if (!this.validUnits) {
        this.isValidUnit = this.validAreas ? {} : null;
      }
    } // if
    if (changes.validUnits) {
      this.isValidUnit = this.validUnits
        ? arrayUtil.toMap(
            this.validUnits,
            (u) => this.getUnitNodeId(u),
            () => true
          )
        : null;
      if (!this.validAreas) {
        this.isValidArea = this.validUnits ? {} : null;
      }
    } // if
    if (changes.selectedUnits) {
      if (this.selectedUnits) {
        this.nSelectedUnits = {};
        for (const selectedUnit of this.selectedUnits) {
          this.nSelectedUnits[this.getUnitNodeId(selectedUnit)] =
            selectedUnit.type === 'leader' ? 1 : selectedUnit.quantity;
        } // for
      } else {
        this.nSelectedUnits = null;
      } // if - else
    } // if
  } // ngOnChanges

  ngOnInit() {
    this.refreshRoundNodes();
  } // ngOnInit

  private refreshAreaNodes(): boolean {
    let refreshedUnits = false;
    const { nodes, map } = arrayUtil.entitiesToNodes(
      this.components.AREA_IDS,
      this.areaNodeMap || {},
      (areaId) => areaId,
      (areaId, node) => this.areaStates[areaId] === node.state,
      (areaId, index, oldNode) => this.areaToNode(areaId, oldNode)
    );
    this.areaNodes = nodes;
    this.areaNodeMap = map;
    return refreshedUnits;
  } // refreshAreaNodes

  private refreshPopulationNodes() {
    const { nodes, map } = arrayUtil.entitiesToNodes(
      this.components.NATION_IDS,
      this.nationPopulationNodeMap || {},
      (nationId) => nationId,
      (nationId, node) => this.nationStates[nationId] === node.state,
      (nationId, index, oldNode) =>
        this.nationToPopulationNode(nationId, oldNode)
    );
    this.nationPopulationNodeMap = map;
    this.populationNodes.map((pn) => ({
      id: pn.id,
      nationNodes: [],
    }));
    this.populationNodes.forEach((pn) => (pn.nationNodes = []));
    nodes.forEach((nationNode) => {
      const population = nationNode.state.population;
      if (population != null) {
        const populationNode = this.populationNodes[population];
        populationNode.nationNodes.push(nationNode);
      } // if
    });
  } // refreshPopulationNodes

  private refreshNationTurnNodes() {
    const { nodes, map } = arrayUtil.entitiesToNodes(
      this.components.NATION_IDS,
      this.nationTurnNodeMap || {},
      (nationId) => nationId,
      (nationId, node) => this.nationStates[nationId] === node.state,
      (nationId, index, oldNode) => this.nationToTurnNode(nationId, oldNode)
    );
    this.nationTurnNodes = nodes;
    this.nationTurnNodeMap = map;
  } // refreshNationTurnNodes

  private refreshRoundNodes() {
    const { nodes, map } = arrayUtil.entitiesToNodes(
      this.components.ROUND_IDS,
      this.roundNodeMap || {},
      (roundId) => roundId,
      (round, node) => true,
      (roundId, index, oldNode) => this.roundToNode(roundId, oldNode)
    );
    this.roundNodes = nodes;
    this.roundNodeMap = map;
  } // refreshRoundNodes

  private areaToNode(
    areaId: BritAreaId,
    oldNode: BritAreaNode | null
  ): BritAreaNode {
    const path = this.mapService.getAreaPath(areaId);
    const area = this.components.AREA[areaId];
    const state = this.areaStates[areaId];
    const node: BritAreaNode = {
      id: areaId,
      area,
      state,
      path,
      unitNodes: null!,
      tooltip: area.name,
    };
    if (state.units === oldNode?.state.units) {
      node.unitNodes = oldNode.unitNodes;
    } else {
      node.unitNodes = state.units.map((u, index) =>
        this.unitToNode(u, index, node, state.units.length)
      );
    } // if - else
    return node;
  } // areaToNode

  private getUnitNodeId(unit: BritAreaUnit) {
    return unit.type === 'leader'
      ? unit.leaderId
      : `${unit.nationId}-${unit.type}-${unit.areaId}`;
  } // getUnitNodeId

  private unitToNode(
    unit: BritAreaUnit,
    index: number,
    areaNode: BritAreaNode,
    nAreaUnits: number
  ): BritUnitNode {
    const imageSource = this.assetsService.getUnitImageSource(unit);
    const point = this.getUnitNodePoint(index, nAreaUnits, areaNode.id);
    return {
      id: this.getUnitNodeId(unit),
      unit,
      imageSource,
      index,
      areaNode,
      svgX: point ? point.x * GRID_STEP - 15 : 0,
      svgY: point ? point.y * GRID_STEP - 15 : 0,
      quantity: unit.type === 'leader' ? 1 : unit.quantity,
      tooltip:
        unit.type === 'leader'
          ? this.components.getLeader(unit.leaderId).name
          : `${
              this.components.getNation(unit.nationId).label
            } ${this.components.getUnitTypeLabel(unit.type, true)}`,
    };
  } // unitToNode

  private getUnitNodePoint(
    unitIndex: number,
    nAreaUnits: number,
    areaId: BritAreaId
  ): BritMapPoint | null {
    const slots = this.mapService.getAreaSlots(nAreaUnits, areaId);
    return slots[unitIndex];
  } // getUnitNodePoint

  private nationToTurnNode(
    nationId: BritNationId,
    oldNode: BritNationTurnNode | null
  ): BritNationTurnNode {
    if (oldNode) {
      return oldNode;
    } else {
      const nation = this.components.NATION[nationId];
      return {
        id: nationId,
        nation,
        state: this.nationStates[nationId],
        path: this.mapService.getNationTurnPath(nation.id),
        tooltip: nation.label,
      };
    } // if - else
  } // nationToTurnNode

  private roundToNode(
    roundId: BritRoundId,
    oldNode: BritRoundNode | null
  ): BritRoundNode {
    if (oldNode) {
      return oldNode;
    } else {
      const round = this.components.ROUND[roundId];
      const eventNodes: BritEventNode[] = round.events.map((event) => ({
        event,
        id: event.nation,
        path: this.mapService.getEventPath(round.id, event.nation),
        tooltip: this.nationTurnNodeMap[event.nation]?.nation.label,
      }));
      return {
        id: roundId,
        round: round,
        path: this.mapService.getRoundPath(round.id),
        scoringPath: this.mapService.getScoringRoundPath(round.id) || null,
        eventNodes,
        tooltip: `Round ${round.id}\n(${round.fromYear}-${round.toYear})`,
      };
    } // if - else
  } // roundToNode

  private nationToPopulationNode(
    nationId: BritNationId,
    oldNode: BritNationPopulationNode | null
  ): BritNationPopulationNode {
    const nation = this.components.NATION[nationId];
    return {
      id: nation.id,
      nation: nation,
      state: this.nationStates[nationId],
      imageSource: this.assetsService.getNationPopulationMarkerImageSource(
        nation.id
      ),
      tooltip: nation.label,
    };
  } // nationToPopulationNode

  onAreaClick(areaNode: BritAreaNode, event: MouseEvent) {
    if (this.validAreas?.includes(areaNode.id)) {
      this.areaClick.emit(areaNode.id);
    } // if
  } // onAreaClick

  onUnitClick(unitNode: BritUnitNode) {
    if (this.isValidUnit && this.isValidUnit[unitNode.id]) {
      this.unitClick.emit(unitNode.unit);
    } // if
  } // onUnitClick

  getNationPopulationNodeX = (
    nationNode: BritNationPopulationNode,
    index: number,
    populationNode: BritPopulationNode
  ) => {
    return this.mapService.getPopulationX(populationNode.id, index) * GRID_STEP;
  }; // getNationPopulationNodeX

  getNationPopulationNodeY = (
    nationNode: BritNationPopulationNode,
    index: number,
    populationNode: BritPopulationNode
  ) => {
    return this.mapService.getPopulationY(populationNode.id, index) * GRID_STEP;
  }; // getNationPopulationNodeY

  calculateSlots() {
    const splittedViewBox = this.viewBox.split(' ');
    const width = +splittedViewBox[2];
    const height = +splittedViewBox[3];
    const screenCTM = this.mapElementRef.nativeElement.getScreenCTM()!;
    const pt = this.bgSvg.createSVGPoint();
    const coordinatesToAreaId = (x: number, y: number) => {
      pt.x = x * GRID_STEP;
      pt.y = y * GRID_STEP;
      const clientP = pt.matrixTransform(screenCTM);
      const elementId: string | undefined = document.elementFromPoint(
        clientP.x,
        clientP.y
      )?.id;
      if (elementId && elementId.startsWith('brit-area-')) {
        return elementId.slice(10) as BritAreaId;
      } else {
        return null;
      } // if - else
    };
    const xMax = width / GRID_STEP;
    const yMax = height / GRID_STEP;
    const slots = this.slotsGeneratorService.generateSlots(
      xMax,
      yMax,
      coordinatesToAreaId
    );
    downloadUtil.downloadJson(slots, 'britannia-map-slots.json');
  } // calculateSlots
} // BritMapComponent

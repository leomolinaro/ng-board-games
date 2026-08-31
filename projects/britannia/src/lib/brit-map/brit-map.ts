import type {
  ElementRef,
  OnChanges,
  OnInit,
  TrackByFunction} from '@angular/core';
import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  inject,
  input,
  isDevMode,
  output,
} from '@angular/core';
import { BgMapZoom, BgSvg } from '@leobg/commons';
import type {
  SimpleChanges} from '@leobg/commons/utils';
import {
  BgTransformPipe,
  arrayUtil,
  downloadUtil,
} from '@leobg/commons/utils';
import { TuiHint } from '@taiga-ui/core';
import { BritAssetsService } from '../brit-assets.service';
import type {
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
import type {
  BritAreaState,
  BritAreaUnit,
  BritNationState,
} from '../brit-game-state.models';
import { BritMapSlotsGeneratorService } from './brit-map-slots-generator.service';
import type { BritMapPoint} from './brit-map.service';
import { BritMapService } from './brit-map.service';

interface BritAreaNode {
  id: BritAreaId;
  area: BritArea;
  state: BritAreaState;
  path: string;
  unitNodes: BritUnitNode[];
  tooltip: string;
}

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
}

interface BritPopulationNode {
  id: BritPopulation;
  nationNodes: BritNationPopulationNode[];
  path: string;
  tooltip: string;
}

interface BritNationPopulationNode {
  id: BritNationId;
  nation: BritNation;
  state: BritNationState;
  imageSource: string;
  tooltip: string;
}

interface BritNationTurnNode {
  id: BritNationId;
  nation: BritNation;
  state: BritNationState;
  path: string;
  tooltip: string;
}

interface BritRoundNode {
  id: BritRoundId;
  round: BritRound;
  path: string;
  eventNodes: BritEventNode[];
  scoringPath: string | null;
  tooltip: string;
}

interface BritEventNode {
  id: string;
  event: BritEvent;
  path: string;
  tooltip: string;
}

const GRID_STEP = 20;

@Component({
  selector: 'brit-map',
  templateUrl: './brit-map.html',
  styleUrls: ['./brit-map.scss'],
  imports: [BgMapZoom, BgSvg, BgTransformPipe, TuiHint],
})
export class BritMap implements OnChanges, OnInit {
  private mapService = inject(BritMapService);
  private slotsGeneratorService = inject(BritMapSlotsGeneratorService);
  private assetsService = inject(BritAssetsService);
  private components = inject(BritComponentsService);
  private cd = inject(ChangeDetectorRef);

  readonly areaStates = input.required<Record<BritAreaId, BritAreaState>>();
  readonly nationStates =
    input.required<Record<BritNationId, BritNationState>>();
  readonly validAreas = input<BritAreaId[] | null>(null);
  readonly validUnits = input<BritAreaUnit[] | null>(null);
  readonly selectedUnits = input<BritAreaUnit[] | null>(null);
  // in caso di update dell'unità in un'area, bisogna cambiare il riferimento delle BritArea.units

  readonly areaClick = output<BritAreaId>();
  readonly unitClick = output<BritAreaUnit>();

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
    }),
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

  @ViewChild(BgSvg) bgSvg!: BgSvg;
  @ViewChild('britMap') mapElementRef!: ElementRef<SVGGElement>;
  @ViewChild(BgMapZoom, { static: true }) bgMapZoom!: BgMapZoom;

  protected isDevMode = isDevMode();

  areaTrackBy: TrackByFunction<BritAreaNode> = (
    index: number,
    areaNode: BritAreaNode,
  ) => areaNode.id;
  unitTrackBy: TrackByFunction<BritUnitNode> = (
    index: number,
    unitNode: BritUnitNode,
  ) => unitNode.id;
  populationTrackBy: TrackByFunction<BritPopulationNode> = (
    index: number,
    populationNode: BritPopulationNode,
  ) => populationNode.id;
  nationTurnTrackBy: TrackByFunction<BritNationTurnNode> = (
    index: number,
    nationTurnNode: BritNationTurnNode,
  ) => nationTurnNode.id;
  roundTrackBy: TrackByFunction<BritRoundNode> = (
    index: number,
    roundNode: BritRoundNode,
  ) => roundNode.id;
  eventTrackBy: TrackByFunction<BritEventNode> = (
    index: number,
    eventNode: BritEventNode,
  ) => eventNode.event.nation;
  nationPopulationTrackBy: TrackByFunction<BritNationPopulationNode> = (
    index: number,
    nationPopulationNode: BritNationPopulationNode,
  ) => nationPopulationNode.id;

  ngOnChanges(changes: SimpleChanges<this>) {
    if (changes.areaStates) {
      this.refreshAreaNodes();
    }
    if (changes.nationStates) {
      this.refreshPopulationNodes();
      this.refreshNationTurnNodes();
    }
    const validUnits = this.validUnits();
    if (changes.validAreas) {
      const validAreas = this.validAreas();
      this.isValidArea = validAreas
        ? arrayUtil.toMap(
            validAreas,
            (id) => id,
            () => true,
          )
        : null;
      if (!validUnits) {
        this.isValidUnit = this.validAreas() ? {} : null;
      }
    }
    if (changes.validUnits) {
      this.isValidUnit = validUnits
        ? arrayUtil.toMap(
            validUnits,
            (u) => this.getUnitNodeId(u),
            () => true,
          )
        : null;
      if (!this.validAreas()) {
        this.isValidArea = validUnits ? {} : null;
      }
    }
    if (changes.selectedUnits) {
      const selectedUnits = this.selectedUnits();
      if (selectedUnits) {
        this.nSelectedUnits = {};
        for (const selectedUnit of selectedUnits) {
          this.nSelectedUnits[this.getUnitNodeId(selectedUnit)] =
            selectedUnit.type === 'leader' ? 1 : selectedUnit.quantity;
        }
      } else {
        this.nSelectedUnits = null;
      }
    }
  }

  ngOnInit() {
    this.refreshRoundNodes();
  }

  private refreshAreaNodes(): boolean {
    const refreshedUnits = false;
    const { nodes, map } = arrayUtil.entitiesToNodes(
      this.components.AREA_IDS,
      this.areaNodeMap || {},
      (areaId) => areaId,
      (areaId, node) => this.areaStates()[areaId] === node.state,
      (areaId, index, oldNode) => this.areaToNode(areaId, oldNode),
    );
    this.areaNodes = nodes;
    this.areaNodeMap = map;
    return refreshedUnits;
  }

  private refreshPopulationNodes() {
    const { nodes, map } = arrayUtil.entitiesToNodes(
      this.components.NATION_IDS,
      this.nationPopulationNodeMap || {},
      (nationId) => nationId,
      (nationId, node) => this.nationStates()[nationId] === node.state,
      (nationId, index, oldNode) =>
        this.nationToPopulationNode(nationId, oldNode),
    );
    this.nationPopulationNodeMap = map;
    this.populationNodes.map((pn) => ({ id: pn.id, nationNodes: [] }));
    this.populationNodes.forEach((pn) => (pn.nationNodes = []));
    nodes.forEach((nationNode) => {
      const population = nationNode.state.population;
      if (population != null) {
        const populationNode = this.populationNodes[population];
        populationNode.nationNodes.push(nationNode);
      }
    });
  }

  private refreshNationTurnNodes() {
    const { nodes, map } = arrayUtil.entitiesToNodes(
      this.components.NATION_IDS,
      this.nationTurnNodeMap || {},
      (nationId) => nationId,
      (nationId, node) => this.nationStates()[nationId] === node.state,
      (nationId, index, oldNode) => this.nationToTurnNode(nationId, oldNode),
    );
    this.nationTurnNodes = nodes;
    this.nationTurnNodeMap = map;
  }

  private refreshRoundNodes() {
    const { nodes, map } = arrayUtil.entitiesToNodes(
      this.components.ROUND_IDS,
      this.roundNodeMap || {},
      (roundId) => roundId,
      (round, node) => true,
      (roundId, index, oldNode) => this.roundToNode(roundId, oldNode),
    );
    this.roundNodes = nodes;
    this.roundNodeMap = map;
  }

  private areaToNode(
    areaId: BritAreaId,
    oldNode: BritAreaNode | null,
  ): BritAreaNode {
    const path = this.mapService.getAreaPath(areaId);
    const area = this.components.AREA[areaId];
    const state = this.areaStates()[areaId];
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
        this.unitToNode(u, index, node, state.units.length),
      );
    }
    return node;
  }

  private getUnitNodeId(unit: BritAreaUnit) {
    return unit.type === 'leader'
      ? unit.leaderId
      : `${unit.nationId}-${unit.type}-${unit.areaId}`;
  }

  private unitToNode(
    unit: BritAreaUnit,
    index: number,
    areaNode: BritAreaNode,
    nAreaUnits: number,
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
          : `${this.components.getNation(unit.nationId).label} ${this.components.getUnitTypeLabel(unit.type, true)}`,
    };
  }

  private getUnitNodePoint(
    unitIndex: number,
    nAreaUnits: number,
    areaId: BritAreaId,
  ): BritMapPoint | null {
    const slots = this.mapService.getAreaSlots(nAreaUnits, areaId);
    return slots[unitIndex];
  }

  private nationToTurnNode(
    nationId: BritNationId,
    oldNode: BritNationTurnNode | null,
  ): BritNationTurnNode {
    if (oldNode) {
      return oldNode;
    } else {
      const nation = this.components.NATION[nationId];
      return {
        id: nationId,
        nation,
        state: this.nationStates()[nationId],
        path: this.mapService.getNationTurnPath(nation.id),
        tooltip: nation.label,
      };
    }
  }

  private roundToNode(
    roundId: BritRoundId,
    oldNode: BritRoundNode | null,
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
    }
  }

  private nationToPopulationNode(
    nationId: BritNationId,
    oldNode: BritNationPopulationNode | null,
  ): BritNationPopulationNode {
    const nation = this.components.NATION[nationId];
    return {
      id: nation.id,
      nation: nation,
      state: this.nationStates()[nationId],
      imageSource: this.assetsService.getNationPopulationMarkerImageSource(
        nation.id,
      ),
      tooltip: nation.label,
    };
  }

  onAreaClick(areaNode: BritAreaNode, event: MouseEvent) {
    if (this.validAreas()?.includes(areaNode.id)) {
      this.areaClick.emit(areaNode.id);
    }
  }

  onUnitClick(unitNode: BritUnitNode) {
    if (this.isValidUnit && this.isValidUnit[unitNode.id]) {
      this.unitClick.emit(unitNode.unit);
    }
  }

  getNationPopulationNodeX = (
    nationNode: BritNationPopulationNode,
    index: number,
    populationNode: BritPopulationNode,
  ) => {
    return this.mapService.getPopulationX(populationNode.id, index) * GRID_STEP;
  };

  getNationPopulationNodeY = (
    nationNode: BritNationPopulationNode,
    index: number,
    populationNode: BritPopulationNode,
  ) => {
    return this.mapService.getPopulationY(populationNode.id, index) * GRID_STEP;
  };

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
        clientP.y,
      )?.id;
      if (elementId?.startsWith('brit-area-')) {
        return elementId.slice(10) as BritAreaId;
      } else {
        return null;
      }
    };
    const xMax = width / GRID_STEP;
    const yMax = height / GRID_STEP;
    const slots = this.slotsGeneratorService.generateSlots(
      xMax,
      yMax,
      coordinatesToAreaId,
    );
    downloadUtil.downloadJson(slots, 'britannia-map-slots.json');
  }
}

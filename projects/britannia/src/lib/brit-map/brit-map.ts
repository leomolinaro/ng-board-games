import type {
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  Component,
  inject,
  input,
  isDevMode,
  output,
  viewChild,
} from '@angular/core';
import { BgMapZoom, BgSvg } from '@leobg/commons';
import { BgTransformPipe, arrayUtil, downloadUtil } from '@leobg/commons/utils';
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
import { BritComponents } from '../brit-components.service';
import type {
  BritAreaState,
  BritAreaUnit,
  BritNationState,
} from '../brit-game-state.models';
import { BritMapSlotsGeneratorService } from './brit-map-slots-generator.service';
import type { BritMapPoint } from './brit-map.service';
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
  private components = inject(BritComponents);

  readonly areaStates = input.required<Record<BritAreaId, BritAreaState>>();
  readonly nationStates =
    input.required<Record<BritNationId, BritNationState>>();
  readonly validAreas = input<BritAreaId[] | null>(null);
  readonly validUnits = input<BritAreaUnit[] | null>(null);
  readonly selectedUnits = input<BritAreaUnit[] | null>(null);
  // in caso di update dell'unità in un'area, bisogna cambiare il riferimento delle BritArea.units

  readonly areaClick = output<BritAreaId>();
  readonly unitClick = output<BritAreaUnit>();

  bgMapZoom = viewChild.required(BgMapZoom);

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

  private bgSvg = viewChild.required(BgSvg);
  private mapElementRef =
    viewChild.required<ElementRef<SVGGElement>>('britMap');

  protected isDevMode = isDevMode();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areaStates']) {
      this.refreshAreaNodes();
    }
    if (changes['nationStates']) {
      this.refreshPopulationNodes();
      this.refreshNationTurnNodes();
    }
    const validUnits = this.validUnits();
    if (changes['validAreas']) {
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
    if (changes['validUnits']) {
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
    if (changes['selectedUnits']) {
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

  ngOnInit(): void {
    this.refreshRoundNodes();
  }

  private refreshAreaNodes(): boolean {
    const refreshedUnits = false;
    const { nodes, map } = arrayUtil.entitiesToNodes(
      this.components.AREA_IDS,
      this.areaNodeMap || {},
      (areaId) => areaId,
      (areaId, node) => this.areaStates()[areaId] === node.state,
      (areaId, _index, oldNode) => this.areaToNode(areaId, oldNode),
    );
    this.areaNodes = nodes;
    this.areaNodeMap = map;
    return refreshedUnits;
  }

  private refreshPopulationNodes(): void {
    const { nodes, map } = arrayUtil.entitiesToNodes(
      this.components.NATION_IDS,
      this.nationPopulationNodeMap || {},
      (nationId) => nationId,
      (nationId, node) => this.nationStates()[nationId] === node.state,
      (nationId, _index, oldNode) =>
        this.nationToPopulationNode(nationId, oldNode),
    );
    this.nationPopulationNodeMap = map;
    for (const pn of this.populationNodes) pn.nationNodes = [];
    for (const nationNode of nodes) {
      const population = nationNode.state.population;
      if (population != null) {
        const populationNode = this.populationNodes[population];
        populationNode.nationNodes.push(nationNode);
      }
    }
  }

  private refreshNationTurnNodes(): void {
    const { nodes, map } = arrayUtil.entitiesToNodes(
      this.components.NATION_IDS,
      this.nationTurnNodeMap || {},
      (nationId) => nationId,
      (nationId, node) => this.nationStates()[nationId] === node.state,
      (nationId, _index, oldNode) => this.nationToTurnNode(nationId, oldNode),
    );
    this.nationTurnNodes = nodes;
    this.nationTurnNodeMap = map;
  }

  private refreshRoundNodes(): void {
    const { nodes, map } = arrayUtil.entitiesToNodes(
      this.components.ROUND_IDS,
      this.roundNodeMap || {},
      (roundId) => roundId,
      () => true,
      (roundId, _index, oldNode) => this.roundToNode(roundId, oldNode),
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
    node.unitNodes =
      state.units === oldNode?.state.units
        ? oldNode.unitNodes
        : state.units.map((u, index) =>
            this.unitToNode(u, index, node, state.units.length),
          );
    return node;
  }

  private getUnitNodeId(unit: BritAreaUnit): string {
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
    if (oldNode) return oldNode;
    const nation = this.components.NATION[nationId];
    return {
      id: nationId,
      nation,
      state: this.nationStates()[nationId],
      path: this.mapService.getNationTurnPath(nation.id),
      tooltip: nation.label,
    };
  }

  private roundToNode(
    roundId: BritRoundId,
    oldNode: BritRoundNode | null,
  ): BritRoundNode {
    if (oldNode) return oldNode;
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

  private nationToPopulationNode(
    nationId: BritNationId,
    _oldNode: BritNationPopulationNode | null,
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

  onAreaClick(areaNode: BritAreaNode, _event: MouseEvent): void {
    if (this.validAreas()?.includes(areaNode.id)) {
      this.areaClick.emit(areaNode.id);
    }
  }

  onUnitClick(unitNode: BritUnitNode): void {
    if (this.isValidUnit?.[unitNode.id]) this.unitClick.emit(unitNode.unit);
  }

  protected getNationPopulationNodeX: (
    index: number,
    populationNode: BritPopulationNode,
  ) => number = (index, populationNode) => {
    return this.mapService.getPopulationX(populationNode.id, index) * GRID_STEP;
  };

  protected getNationPopulationNodeY: (index: number) => number = (index) => {
    return this.mapService.getPopulationY(index) * GRID_STEP;
  };

  calculateSlots(): void {
    const splittedViewBox = this.viewBox.split(' ');
    const width = +splittedViewBox[2];
    const height = +splittedViewBox[3];
    const screenCTM = this.mapElementRef().nativeElement.getScreenCTM()!;
    const pt = this.bgSvg().createSVGPoint();
    const coordinatesToAreaId: (x: number, y: number) => BritAreaId | null = (
      x,
      y,
    ) => {
      pt.x = x * GRID_STEP;
      pt.y = y * GRID_STEP;
      const clientP = pt.matrixTransform(screenCTM);
      const elementId: string | undefined = document.elementFromPoint(
        clientP.x,
        clientP.y,
      )?.id;
      return elementId?.startsWith('brit-area-')
        ? (elementId.slice(10) as BritAreaId)
        : null;
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

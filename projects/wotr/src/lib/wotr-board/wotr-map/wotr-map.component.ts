import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Signal, ViewChild, computed, inject, input, isDevMode } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BgMapZoomDirective, BgSvgComponent, BgSvgModule } from "@leobg/commons";
import { arrayUtil, downloadUtil } from "@leobg/commons/utils";
import { WotrAssetsService, WotrUnitImage } from "../../wotr-assets.service";
import { WotrCompanion, WotrCompanionId } from "../../wotr-components/wotr-companion.models";
import { WotrMinion, WotrMinionId } from "../../wotr-components/wotr-minion.models";
import { WotrArmyUnitType, WotrFreePeopleLeaderUnitType, WotrFreeUnitType, WotrNationId, WotrShadowLeaderUnitType } from "../../wotr-components/wotr-nation.models";
import { WotrRegion, WotrRegionId } from "../../wotr-components/wotr-region.models";
import { WotrMapSlotsGeneratorService } from "./wotr-map-slots-generator.service";
import { WotrMapPoint, WotrMapService } from "./wotr-map.service";

interface WotrRegionNode {
  id: WotrRegionId;
  region: WotrRegion;
  path: string;
  tooltip: string;
  army: WotrArmyNode | null;
  freeGroups: WotrFreeGroupNode[];
}

interface WotrArmyNode {
  armyUnits: WotrArmyUnitNode[];
  leaderUnits: WotrFreePeopleLeaderUnitNode[] | WotrShadowLeaderUnitNode[];
  svgX: number;
  svgY: number;
  counters: {
    nRegulars: number;
    nElites: number;
    leadership: number;
    svgX: number;
    svgY: number;
  };
}

interface WotrArmyUnitNode {
  unitType: WotrArmyUnitType;
  nationId: WotrNationId;
  image: WotrUnitImage;
  svgX: number;
  svgY: number;
}

interface WotrFreePeopleLeaderUnitNode {
  unitType: WotrFreePeopleLeaderUnitType;
  nationId: WotrNationId | null;
  companion: WotrCompanionId | null;
  image: WotrUnitImage;
  svgX: number;
  svgY: number;
}

interface WotrShadowLeaderUnitNode {
  unitType: WotrShadowLeaderUnitType;
  minion: WotrMinionId | null;
  image: WotrUnitImage;
  svgX: number;
  svgY: number;
}

interface WotrFreeGroupNode {
  units: WotrFellowshipNode[] | WotrFreePeopleFreeUnitNode[] | WotrShadowFreeUnitNode[];
  nUnits: number;
  svgX: number;
  svgY: number;
}

interface WotrFellowshipNode {
  unitType: Extract<WotrFreeUnitType, "fellowship">;
  image: WotrUnitImage;
  svgX: number;
  svgY: number;
}

interface WotrFreePeopleFreeUnitNode {
  unitType: Extract<WotrFreeUnitType, "companion">;
  companion: WotrCompanionId;
  image: WotrUnitImage;
  svgX: number;
  svgY: number;
}

interface WotrShadowFreeUnitNode {
  unitType: Extract<WotrFreeUnitType, "minion" | "nazgul">;
  minion: WotrMinionId | null;
  image: WotrUnitImage;
  svgX: number;
  svgY: number;
}

const GRID_STEP = 10;

const SORTED_COMPANIONS: WotrCompanionId[] = ["aragorn", "gandalf-the-white", "gandalf-the-grey", "strider", "legolas", "gimli", "boromir", "meriadoc", "peregrin"];
const SORTED_MINIONS: WotrMinionId[] = ["the-witch-king", "saruman", "the-mouth-of-sauron"];

@Component ({
  selector: "wotr-map",
  standalone: true,
  imports: [BgSvgModule, MatTooltipModule, NgClass],
  templateUrl: "./wotr-map.component.html",
  styleUrls: ["./wotr-map.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrMapComponent {

  private mapService = inject (WotrMapService);
  private assets = inject (WotrAssetsService);
  private slotsGeneratorService = inject (WotrMapSlotsGeneratorService);

  regions = input.required<WotrRegion[]> ();
  // @Input () nationStates!: Record<WotrNationId, WotrNationState>;
  @Input () validRegions: WotrRegionId[] | null = null;

  companionById = input.required<Record<WotrCompanionId, WotrCompanion>> ();
  minionById = input.required<Record<WotrMinionId, WotrMinion>> ();

  @Output () regionClick = new EventEmitter<WotrRegionId> ();

  private regionNodeMap!: Record<WotrRegionId, WotrRegionNode>;
  viewBox = this.mapService.getViewBox ();
  mapWidth = this.mapService.getWidth ();

  testGridPoints: { x: number; y: number; color: string }[] = [];

  isValidRegion: Record<string, boolean> | null = null;
  isValidUnit: Record<string, boolean> | null = null;
  nSelectedUnits: Record<string, number> | null = null;

  @ViewChild (BgSvgComponent) bgSvg!: BgSvgComponent;
  @ViewChild ("wotrMap") mapElementRef!: ElementRef<SVGGElement>;
  @ViewChild (BgMapZoomDirective, { static: true }) bgMapZoom!: BgMapZoomDirective;

  protected isDevMode = isDevMode ();

  protected mapImageSource = this.assets.getMapImageSource ();

  regionNodes: Signal<WotrRegionNode[]> = computed (() => {
    const { nodes, map } = arrayUtil.entitiesToNodes (
      this.regions (),
      this.regionNodeMap || {},
      (region) => region.id,
      (region, node) => region === node.region,
      (region, index, oldNode) => this.regionToNode (region, oldNode)
    );
    this.regionNodeMap = map;
    return nodes;
  })

  private regionToNode (region: WotrRegion, oldNode: WotrRegionNode | null): WotrRegionNode {
    const path = this.mapService.getRegionPath (region.id);
    const node: WotrRegionNode = {
      id: region.id,
      region,
      path,
      army: null,
      freeGroups: [],
      tooltip: region.name
    };
    if (oldNode && this.equalsRegionUnits (region, oldNode.region)) {
      node.army = oldNode.army;
      node.freeGroups = oldNode.freeGroups;
    } else {
      node.army = this.regionToArmyNode (region);
      node.freeGroups = this.regionToFreeGroups (region);
      this.setNodeCoordinates (region.id, node);
    }
    return node;
  }

  private setNodeCoordinates (regionId: WotrRegionId, node: WotrRegionNode) {
    const nGroups = (node.army ? 1 : 0) + node.freeGroups.length;
    let index = 0;
    const army = node.army;
    if (army) {
      const point = this.getGroupNodePoint (index++, nGroups, regionId);
      army.svgX = point.x * GRID_STEP;
      army.svgY = point.y * GRID_STEP;

      let totalWidth = 0;
      let maxHeight = 0;
      const reducedWitdh = 10;
      for (const armyUnit of army.armyUnits) {
        totalWidth += armyUnit.image.width - reducedWitdh;
        maxHeight = Math.max (armyUnit.image.height, maxHeight);
      }
      if (army.leaderUnits.length) {
        const firstLeaderUnit = army.leaderUnits[0];
        totalWidth += firstLeaderUnit.image.width - reducedWitdh;
      }
      let currX = -totalWidth / 2;
      let currY = maxHeight / 2;
      army.counters.svgX = currX;
      army.counters.svgY = currY;
      for (const armyUnit of army.armyUnits) {
        armyUnit.svgX = currX;
        armyUnit.svgY = currY - armyUnit.image.height;
        currX += armyUnit.image.width - reducedWitdh;
      }
      for (const leaderUnit of army.leaderUnits) {
        leaderUnit.svgX = currX;
        leaderUnit.svgY = currY - leaderUnit.image.height;
        currX -= 3;
        currY += 3;
      }
    }
    for (const freeGroup of node.freeGroups) {
      const point = this.getGroupNodePoint (index++, nGroups, regionId);
      freeGroup.svgX = point.x * GRID_STEP;
      freeGroup.svgY = point.y * GRID_STEP;
      let currX = 0;
      let currY = 0;
      for (const freeUnit of freeGroup.units) {
        freeUnit.svgX = currX;
        freeUnit.svgY = currY - freeUnit.image.height;
        currX -= 3;
        currY += 3;
      }
      // freeGroup.svgX = point.x * GRID_STEP - 8;
      // freeGroup.svgY = point.y * GRID_STEP - 8;
    }
  }

  private equalsRegionUnits (a: WotrRegion, b: WotrRegion) {
    if (a.armyUnits !== b.armyUnits) { return false; }
    if (a.leaders !== b.leaders) { return false; }
    if (a.nNazgul !== b.nNazgul) { return false; }
    if (a.companions !== b.companions) { return false; }
    if (a.minions !== b.minions) { return false; }
    if (a.fellowship !== b.fellowship) { return false; }
    return true;
  }

  private regionToArmyNode (region: WotrRegion): WotrArmyNode | null {
    if (!region.armyUnits.length) { return null; }

    const armyFront = region.armyUnits[0].frontId;

    const [armyUnits, nRegulars, nElites] = this.regionToArmyUnitNodes (region);

    let leaderUnits: WotrFreePeopleLeaderUnitNode[] | WotrShadowLeaderUnitNode[];
    let leadership: number;
    switch (armyFront) {
      case "free-peoples": [leaderUnits, leadership] = this.regionToFreePeopleLeaderUnitNodes (region); break;
      case "shadow": [leaderUnits, leadership] = this.regionToShadowLeaderUnitNodes (region); break;
    }

    return {
      counters: {
        nRegulars, nElites, leadership,
        svgX: 0, svgY: 0
      },
      armyUnits, leaderUnits, svgX: 0, svgY: 0
    };
  }

  private regionToArmyUnitNodes (region: WotrRegion):  [WotrArmyUnitNode[], number, number] {
    let nRegulars = 0;
    let nElites = 0;
    for (const unit of region.armyUnits) {
      switch (unit.type) {
        case "regular": nRegulars += unit.quantity; break;
        case "elite": nElites += unit.quantity; break;
      }
    }

    const armyUnits = [...region.armyUnits];
    armyUnits.sort ((a, b) => {
      return a.type === "elite" ? 1 : -1;
    });
    const unitNodes: WotrArmyUnitNode[] = armyUnits.slice (0, 2).map (armyUnit => ({
      unitType: armyUnit.type,
      nationId: armyUnit.nationId,
      image: this.assets.getArmyUnitImage (armyUnit.type, armyUnit.nationId),
      svgX: 0, svgY: 0
    }));
    return [unitNodes, nRegulars, nElites];
  }

  private regionToFreePeopleLeaderUnitNodes (region: WotrRegion): [WotrFreePeopleLeaderUnitNode[], number] {
    let leadership = 0;
    const leaders: (WotrCompanion | WotrNationId)[] = [];

    region.leaders.forEach (leader => {
      leadership += leader.quantity;
      leaders.push (leader.nationId);
    });

    region.companions.forEach (companionId => {
      const companion = this.companionById ()[companionId];
      leadership += companion.leadership;
      leaders.push (companion);
    });

    leaders.sort ((a, b) => this.compareFreePeopleLeaders (a, b));
    const unitNodes = leaders.slice (0, 2).map<WotrFreePeopleLeaderUnitNode> (leader => {
      if (typeof leader === "string") {
        return { unitType: "leader", companion: null, nationId: leader, image: this.assets.getLeaderImage (leader), svgX: 0, svgY: 0 };
      } else {
        return { unitType: "companion", companion: leader.id, nationId: null, image: this.assets.getCompanionImage (leader.id), svgX: 0, svgY: 0 };
      }
    });
    return [unitNodes, leadership];
  }

  private regionToShadowLeaderUnitNodes (region: WotrRegion): [WotrShadowLeaderUnitNode[], number] {
    let leadership = 0;
    const leaders: (WotrMinion | "nazgul")[] = [];
    if (region.nNazgul) {
      leadership += region.nNazgul;
      leaders.push ("nazgul");
    }
    region.minions.forEach (minionId => {
      const minion = this.minionById ()[minionId];
      leadership += minion.leadership;
      leaders.push (minion);
    });
    leaders.sort ((a, b) => this.compareShadowLeaders (a, b));
    const unitNodes = leaders.slice (0, 2).map<WotrShadowLeaderUnitNode> (leader => {
      if (leader === "nazgul") {
        return { unitType: "nazgul", minion: null, image: this.assets.getNazgulImage (), svgX: 0, svgY: 0 };
      } else {
        return { unitType: "minion", minion: leader.id, image: this.assets.getMinionImage (leader.id), svgX: 0, svgY: 0 };
      }
    });
    return [unitNodes, leadership];
  }

  private regionToFreeGroups (region: WotrRegion): WotrFreeGroupNode[] {
    const freeGroups: WotrFreeGroupNode[] = [];

    if (region.fellowship) {
      freeGroups.push ({ units: [{ unitType: "fellowship", image: this.assets.getFellowshipImage (), svgX: 0, svgY: 0 }], nUnits: 1, svgX: 0, svgY: 0 });
    }

    if (region.armyUnits.length) {
      const armyFront = region.armyUnits[0].frontId;
      let freeUnits: WotrFreePeopleFreeUnitNode[] | WotrShadowFreeUnitNode[];
      let nUnits: number;
      switch (armyFront) {
        case "free-peoples": [freeUnits, nUnits] = this.regionToShadowFreeUnitNodes (region); break;
        case "shadow": [freeUnits, nUnits] = this.regionToFreePeopleFreeUnitNodes (region); break;
      }
      if (freeUnits.length) { freeGroups.push ({ units: freeUnits, nUnits, svgX: 0, svgY: 0 }); }
    } else {
      const [fpFreeUnits, fpNUnits] = this.regionToFreePeopleFreeUnitNodes (region);
      if (fpFreeUnits.length) { freeGroups.push ({ units: fpFreeUnits, nUnits: fpNUnits, svgX: 0, svgY: 0 }); }
      const [sFreeUnits, sNUnits] = this.regionToShadowFreeUnitNodes (region);
      if (sFreeUnits.length) { freeGroups.push ({ units: sFreeUnits, nUnits: sNUnits, svgX: 0, svgY: 0 }); }
    }

    return freeGroups;
  }

  private regionToFreePeopleFreeUnitNodes (region: WotrRegion): [WotrFreePeopleFreeUnitNode[], number] {
    let nUnits = 0;
    const freeUnits = region.companions.map (companionId => this.companionById ()[companionId]);
    nUnits = region.companions.length;
    freeUnits.sort ((a, b) => this.compareFreePeopleFreeUnits (a, b));
    const unitNodes = freeUnits.slice (0, 2).map<WotrFreePeopleFreeUnitNode> (freeUnit => ({
      unitType: "companion", companion: freeUnit.id,
      image: this.assets.getCompanionImage (freeUnit.id), svgX: 0, svgY: 0
    }));
    return [unitNodes, nUnits];
  }

  private regionToShadowFreeUnitNodes (region: WotrRegion): [WotrShadowFreeUnitNode[], number] {
    let nUnits = 0;
    const freeUnits: (WotrMinion | "nazgul")[] = [];
    nUnits += region.minions.length;
    region.minions.forEach (minionId => freeUnits.push (this.minionById ()[minionId]));
    if (region.nNazgul) {
      nUnits += region.nNazgul;
      freeUnits.push ("nazgul");
    }
    freeUnits.sort ((a, b) => this.compareShadowFreeUnits (a, b));
    const unitNodes = freeUnits.slice (0, 2).map<WotrShadowFreeUnitNode> (freeUnit => {
      if (freeUnit === "nazgul") {
        return { unitType: "nazgul", minion: null, image: this.assets.getNazgulImage (), svgX: 0, svgY: 0 };
      } else {
        return { unitType: "minion", minion: freeUnit.id, image: this.assets.getMinionImage (freeUnit.id), svgX: 0, svgY: 0 };
      }
    });
    return [unitNodes, nUnits];
  }

  private compareFreePeopleLeaders (a: WotrCompanion | WotrNationId, b: WotrCompanion | WotrNationId) {
    if (typeof a === "string") { return typeof b === "string" ? (a < b ? -1 : (a === b ? 0 : 1)) : 1; }
    if (typeof b === "string") { return -1; }
    for (const c of SORTED_COMPANIONS) {
      if (a.id === c) { return -1; }
      if (b.id === c) { return 1; }
    }
    return 0;
  }

  private compareShadowLeaders (a: WotrMinion | "nazgul", b: WotrMinion | "nazgul") {
    if (a === "nazgul") { return b === "nazgul" ? 0 : 1; }
    if (b === "nazgul") { return -1; }
    for (const m of SORTED_MINIONS) {
      if (a.id === m) { return -1; }
      if (b.id === m) { return 1; }
    }
    return 0;
  }

  private compareFreePeopleFreeUnits (a: WotrCompanion, b: WotrCompanion) {
    for (const c of SORTED_COMPANIONS) {
      if (a.id === c) { return -1; }
      if (b.id === c) { return 1; }
    }
    return 0;
  }

  private compareShadowFreeUnits (a: WotrMinion | "nazgul", b: WotrMinion | "nazgul") {
    return this.compareShadowLeaders (a, b);
  }

  private getGroupNodePoint (groupIndex: number, nGroups: number, regionId: WotrRegionId): WotrMapPoint {
    const slots = this.mapService.getRegionSlots (nGroups, regionId);
    return slots[groupIndex];
  }



  // private getUnitNodeId (unit: WotrRegionUnit) {
  //   return unit.type === "leader"
  //     ? unit.leaderId
  //     : `${unit.nationId}-${unit.type}-${unit.regionId}`;

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

  // private getUnitNodePoint (unitIndex: number, nRegionUnits: number, regionId: WotrRegionId): WotrMapPoint | null {
  //   const slots = this.mapService.getRegionSlots (nRegionUnits, regionId);
  //   return slots[unitIndex];

  onRegionClick (regionNode: WotrRegionNode, event: MouseEvent) {
    if (this.validRegions?.includes (regionNode.id)) {
      this.regionClick.emit (regionNode.id);
    }
  }

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

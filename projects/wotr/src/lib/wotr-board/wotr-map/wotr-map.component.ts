import { NgClass, NgForOf } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild, inject, isDevMode } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BgMapZoomDirective, BgSvgComponent, BgSvgModule } from "@leobg/commons";
import { SimpleChanges as BgSimpleChanges, arrayUtil, downloadUtil } from "@leobg/commons/utils";
import { WotrAssetsService, WotrUnitImage } from "../../wotr-assets.service";
import { WotrArmyUnitType, WotrCompanion, WotrCompanionId, WotrFreePeopleLeaderUnitType, WotrFreeUnitType, WotrMinion, WotrMinionId, WotrNationId, WotrRegion, WotrRegionId, WotrShadowLeaderUnitType } from "../../wotr-components.models";
import { WotrComponentsService } from "../../wotr-components.service";
import { WotrRegionState } from "../../wotr-game-state.models";
import { WotrMapSlotsGeneratorService } from "./wotr-map-slots-generator.service";
import { WotrMapPoint, WotrMapService } from "./wotr-map.service";

interface WotrRegionNode {
  id: WotrRegionId;
  region: WotrRegion;
  state: WotrRegionState;
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
  imports: [BgSvgModule, MatTooltipModule, NgClass, NgForOf],
  templateUrl: "./wotr-map.component.html",
  styleUrls: ["./wotr-map.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrMapComponent implements OnChanges {

  private mapService = inject (WotrMapService);
  private assets = inject (WotrAssetsService);
  private components = inject (WotrComponentsService);
  private slotsGeneratorService = inject (WotrMapSlotsGeneratorService);
  private cd = inject (ChangeDetectorRef);

  @Input () regionStates!: Record<WotrRegionId, WotrRegionState>;
  // @Input () nationStates!: Record<WotrNationId, WotrNationState>;
  @Input () validRegions: WotrRegionId[] | null = null;

  @Output () regionClick = new EventEmitter<WotrRegionId> ();

  regionNodes!: WotrRegionNode[];
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
      army: null,
      freeGroups: [],
      tooltip: region.name
    };
    if (oldNode && this.equalsRegionUnits (state, oldNode.state)) {
      node.army = oldNode.army;
      node.freeGroups = oldNode.freeGroups;
    } else {
      node.army = this.regionToArmyNode (state);
      node.freeGroups = this.regionToFreeGroups (state);
      this.setNodeCoordinates (regionId, node);
    } // if - else
    return node;
  } // regionToNode

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

  private equalsRegionUnits (a: WotrRegionState, b: WotrRegionState) {
    if (a.armyUnits !== b.armyUnits) { return false; }
    if (a.leaders !== b.leaders) { return false; }
    if (a.nNazgul !== b.nNazgul) { return false; }
    if (a.companions !== b.companions) { return false; }
    if (a.minions !== b.minions) { return false; }
    if (a.fellowship !== b.fellowship) { return false; }
    return true;
  } // equalsRegionUnits

  private regionToArmyNode (regionState: WotrRegionState): WotrArmyNode | null {
    if (!regionState.armyUnits.length) { return null; }

    const armyFront = this.components.getNation (regionState.armyUnits[0].nationId).front;

    const [armyUnits, nRegulars, nElites] = this.regionToArmyUnitNodes (regionState);

    let leaderUnits: WotrFreePeopleLeaderUnitNode[] | WotrShadowLeaderUnitNode[];
    let leadership: number;
    switch (armyFront) {
      case "free-peoples": [leaderUnits, leadership] = this.regionToFreePeopleLeaderUnitNodes (regionState); break;
      case "shadow": [leaderUnits, leadership] = this.regionToShadowLeaderUnitNodes (regionState); break;
    }

    return {
      counters: {
        nRegulars, nElites, leadership,
        svgX: 0, svgY: 0
      },
      armyUnits, leaderUnits, svgX: 0, svgY: 0
    };
  }

  private regionToArmyUnitNodes (regionState: WotrRegionState):  [WotrArmyUnitNode[], number, number] {
    let nRegulars = 0;
    let nElites = 0;
    for (const unit of regionState.armyUnits) {
      switch (unit.type) {
        case "regular": nRegulars += unit.quantity; break;
        case "elite": nElites += unit.quantity; break;
      }
    }

    const armyUnits = [...regionState.armyUnits];
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

  private regionToFreePeopleLeaderUnitNodes (regionState: WotrRegionState): [WotrFreePeopleLeaderUnitNode[], number] {
    let leadership = 0;
    const leaders: (WotrCompanion | WotrNationId)[] = [];

    regionState.leaders.forEach (leader => {
      leadership += leader.quantity;
      leaders.push (leader.nationId);
    });

    regionState.companions.forEach (companionId => {
      const companion = this.components.getCompanion (companionId);
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

  private regionToShadowLeaderUnitNodes (regionState: WotrRegionState): [WotrShadowLeaderUnitNode[], number] {
    let leadership = 0;
    const leaders: (WotrMinion | "nazgul")[] = [];
    if (regionState.nNazgul) {
      leadership += regionState.nNazgul;
      leaders.push ("nazgul");
    }
    regionState.minions.forEach (minionId => {
      const minion = this.components.getMinion (minionId);
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

  private regionToFreeGroups (regionState: WotrRegionState): WotrFreeGroupNode[] {
    const freeGroups: WotrFreeGroupNode[] = [];

    if (regionState.fellowship) {
      freeGroups.push ({ units: [{ unitType: "fellowship", image: this.assets.getFellowshipImage (), svgX: 0, svgY: 0 }], nUnits: 1, svgX: 0, svgY: 0 });
    }

    if (regionState.armyUnits.length) {
      const armyFront = this.components.getNation (regionState.armyUnits[0].nationId).front;
      let freeUnits: WotrFreePeopleFreeUnitNode[] | WotrShadowFreeUnitNode[];
      let nUnits: number;
      switch (armyFront) {
        case "free-peoples": [freeUnits, nUnits] = this.regionToShadowFreeUnitNodes (regionState); break;
        case "shadow": [freeUnits, nUnits] = this.regionToFreePeopleFreeUnitNodes (regionState); break;
      }
      if (freeUnits.length) { freeGroups.push ({ units: freeUnits, nUnits, svgX: 0, svgY: 0 }); }
    } else {
      const [fpFreeUnits, fpNUnits] = this.regionToFreePeopleFreeUnitNodes (regionState);
      if (fpFreeUnits.length) { freeGroups.push ({ units: fpFreeUnits, nUnits: fpNUnits, svgX: 0, svgY: 0 }); }
      const [sFreeUnits, sNUnits] = this.regionToShadowFreeUnitNodes (regionState);
      if (sFreeUnits.length) { freeGroups.push ({ units: sFreeUnits, nUnits: sNUnits, svgX: 0, svgY: 0 }); }
    }

    return freeGroups;
  } // regionToLeaders

  private regionToFreePeopleFreeUnitNodes (regionState: WotrRegionState): [WotrFreePeopleFreeUnitNode[], number] {
    let nUnits = 0;
    const freeUnits = regionState.companions.map (companionId => this.components.getCompanion (companionId));
    nUnits = regionState.companions.length;
    freeUnits.sort ((a, b) => this.compareFreePeopleFreeUnits (a, b));
    const unitNodes = freeUnits.slice (0, 2).map<WotrFreePeopleFreeUnitNode> (freeUnit => ({
      unitType: "companion", companion: freeUnit.id,
      image: this.assets.getCompanionImage (freeUnit.id), svgX: 0, svgY: 0
    }));
    return [unitNodes, nUnits];
  }

  private regionToShadowFreeUnitNodes (regionState: WotrRegionState): [WotrShadowFreeUnitNode[], number] {
    let nUnits = 0;
    const freeUnits: (WotrMinion | "nazgul")[] = [];
    nUnits += regionState.minions.length;
    regionState.minions.forEach (minionId => freeUnits.push (this.components.getMinion (minionId)));
    if (regionState.nNazgul) {
      nUnits += regionState.nNazgul;
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
  } // getGroupNodePoint



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
      } // if - else
    };
    const xMax = width / GRID_STEP;
    const yMax = height / GRID_STEP;
    const slots = this.slotsGeneratorService.generateSlots (
      xMax,
      yMax,
      coordinatesToAreaId
    );
    downloadUtil.downloadJson (slots, "wotr-map-slots.json");
  } // calculateSlots

} // WotrMapComponent

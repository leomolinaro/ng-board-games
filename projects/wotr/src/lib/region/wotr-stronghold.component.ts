import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Output, Signal, computed, inject, input } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { WotrAssetsService, WotrUnitImage } from "../assets/wotr-assets.service";
import { WotrCharacter, WotrCharacterId, WotrCompanionId, WotrMinionId } from "../character/wotr-character.models";
import { WotrMapService } from "../game/board/map/wotr-map.service";
import { WotrArmyUnitType, WotrNationId } from "../nation/wotr-nation.models";
import { WotrArmy } from "../unit/wotr-unit.models";
import { WotrRegion, WotrRegionId } from "./wotr-region.models";

interface WotrRegionNode {
  id: WotrRegionId;
  region: WotrRegion;
  path: string;
  tooltip: string;
  army: WotrArmyNode;
}

interface WotrArmyNode {
  armyUnits: WotrArmyUnitNode[];
  leaderUnits: WotrLeaderUnitNode[];
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

export type WotrLeaderUnitType = "leader" | "character" | "nazgul";

interface WotrLeaderUnitNode {
  unitType: WotrLeaderUnitType;
  nationId: WotrNationId | null;
  character: WotrCharacterId | null;
  image: WotrUnitImage;
  svgX: number;
  svgY: number;
}

const SORTED_COMPANIONS: WotrCompanionId[] = ["aragorn", "gandalf-the-white", "gandalf-the-grey", "strider", "legolas", "gimli", "boromir", "meriadoc", "peregrin"];
const SORTED_MINIONS: WotrMinionId[] = ["the-witch-king", "saruman", "the-mouth-of-sauron"];

const STRONGHOLD: Partial<Record<WotrRegionId, [number, number]>> = {
  erebor: [0, 0],
  "grey-havens": [1, 0],
  rivendell: [2, 0],
  "woodland-realm": [3, 0],
  lorien: [4, 0],
  "helms-deep": [5, 0],
  "minas-tirith": [6, 0],
  "dol-amroth": [7, 0],
  "mount-gundabad": [0, 1],
  moria: [1, 1],
  "dol-guldur": [2, 1],
  orthanc: [3, 1],
  morannon: [4, 1],
  "barad-dur": [5, 1],
  "minas-morgul": [6, 1],
  umbar: [7, 1]
};

@Component ({
  selector: "[wotrStronghold]",
  standalone: true,
  imports: [MatTooltipModule, NgClass],
  template: `
    <svg:g>
      @if (regionNode ().army!; as army) {
        <svg:svg style="overflow: visible;" [attr.x]="army.svgX" [attr.y]="army.svgY">
          @for (armyUnit of army.armyUnits; track $index) {
            <svg:image
              [attr.width]="armyUnit.image.width" [attr.height]="armyUnit.image.height"
              [attr.x]="armyUnit.svgX" [attr.y]="armyUnit.svgY"
              transform="scale(0.8, 0.8)"
              [attr.xlink:href]="armyUnit.image.source"/>
          }
          @for (leaderUnit of army.leaderUnits; track $index) {
            <svg:image
              [attr.width]="leaderUnit.image.width" [attr.height]="leaderUnit.image.height"
              [attr.x]="leaderUnit.svgX" [attr.y]="leaderUnit.svgY"
              transform="scale(0.8, 0.8)"
              [attr.xlink:href]="leaderUnit.image.source"/>
          }
          <svg:text class="wotr-army-counters"
            [attr.x]="army.counters.svgX" [attr.y]="army.counters.svgY"
            transform="scale(0.8, 0.8)">
            {{army.counters.nRegulars}}/{{army.counters.nElites}}/{{army.counters.leadership}}
          </svg:text>
        </svg:svg>
      }
      <svg:path
        [ngClass]="{
          'is-active': isValidRegion ? isValidRegion[regionNode ().id] : false,
          'is-disabled': isValidRegion ? !isValidRegion[regionNode ().id] : false
        }"
        [attr.id]="'wotr-region-' + regionNode ().id"
        class="wotr-region-path"
        [attr.d]="regionNode ().path"
        (click)="regionClick.next ()">
      </svg:path>
    </svg:g>
  `,
  styles: [`
    @mixin wotr-path {
      fill: transparent;
      &:hover:not(.is-disabled) {
        opacity: 0.3;
        fill: black;
      }
    }
    .wotr-region-path {
      @include wotr-path;
      &.is-active {
        cursor: pointer;
      }
      &.is-disabled {
        fill: black;
        fill-opacity: 0.3;
      }
    }
    .wotr-population-track-path { @include wotr-path; }
    .wotr-nation-turn-path { @include wotr-path; }
    .wotr-round-path { @include wotr-path; }
    .wotr-event-path { @include wotr-path; }
    .wotr-scoring-path { @include wotr-path; }
    .wotr-unit {
      &.is-active {
        cursor: pointer;
      }
      .wotr-unit-rect {
        fill: white;
        stroke: white;
        stroke-width: 2px;
        stroke-linejoin: bevel;
      }
      .wotr-unit-quantity {
        fill: white;
        font-weight: 600;
        alignment-baseline: after-edge;
        text-anchor: end;
      }
      .wotr-unit-n-movements {
        fill: white;
        font-weight: 600;
        font-style: italic;
        alignment-baseline: before-edge;
        text-anchor: end;
      }
      .wotr-unit-rect-overlay {
        fill: black;
        fill-opacity: 0.3;
      }
    }
    .wotr-population-circle {
      fill: white;
      stroke: white;
      stroke-width: 2px;
    }
    .wotr-army-counters {
      fill: white;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrStrongholdComponent {

  private mapService = inject (WotrMapService);
  private assets = inject (WotrAssetsService);

  region = input.required<WotrRegion> ();
  // @Input () validRegions: WotrRegionId[] | null = null;
  characterById = input.required<Record<WotrCharacterId, WotrCharacter>> ();

  @Output () regionClick = new EventEmitter<void> ();

  isValidRegion: Record<string, boolean> | null = null;
  isValidUnit: Record<string, boolean> | null = null;
  nSelectedUnits: Record<string, number> | null = null;

  regionNode: Signal<WotrRegionNode> = computed (() => {
    const region = this.region ();
    const path = this.mapService.getStrongholdPath (region.id)!;
    const node: WotrRegionNode = {
      id: region.id,
      region,
      path,
      army: this.regionToArmyNode (region),
      tooltip: region.name
    };
    this.setNodeCoordinates (region.id, node);
    return node;
  });

  private setNodeCoordinates (regionId: WotrRegionId, node: WotrRegionNode) {
    const army = node.army;
    if (army) {
      army.svgX = STRONGHOLD[regionId]![1] * 54 + 26;
      army.svgY = STRONGHOLD[regionId]![0] * 54 + 155;

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
  }

  private regionToArmyNode (region: WotrRegion): WotrArmyNode {
    const armyFront = region.underSiegeArmy!.front;

    const [armyUnits, nRegulars, nElites] = this.regionToArmyUnitNodes (region.underSiegeArmy!);

    let leaderUnits: WotrLeaderUnitNode[];
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

  private regionToArmyUnitNodes (army: WotrArmy):  [WotrArmyUnitNode[], number, number] {
    const nRegulars = army.regulars?.reduce ((n, unit) => n + unit.quantity, 0) || 0;
    const nElites = army.elites?.reduce ((n, unit) => n + unit.quantity, 0) || 0;
    
    const unitNodes: WotrArmyUnitNode[] = [];
    const nEliteNodes = army.elites ? Math.min (2, army.elites.length) : 0;
    const nRegularNodes = army.regulars ? Math.min (2 - nEliteNodes, army.regulars.length) : 0;

    for (let i = 0; i < nEliteNodes; i++) {
      const nationId = army.elites![i].nation;
      unitNodes.push ({
        unitType: "elite",
        nationId: nationId,
        image: this.assets.getArmyUnitImage ("elite", nationId),
        svgX: 0, svgY: 0
      });
    }

    for (let i = 0; i < nRegularNodes; i++) {
      const nationId = army.regulars![i].nation;
      unitNodes.push ({
        unitType: "regular",
        nationId: nationId,
        image: this.assets.getArmyUnitImage ("regular", nationId),
        svgX: 0, svgY: 0
      });
    }
    
    return [unitNodes, nRegulars, nElites];
  }

  private regionToFreePeopleLeaderUnitNodes (region: WotrRegion): [WotrLeaderUnitNode[], number] {
    let leadership = 0;
    const leaders: (WotrCharacter | WotrNationId)[] = [];

    if (region.army?.leaders) {
      region.army.leaders.forEach (leader => {
        leadership += leader.quantity;
        leaders.push (leader.nation);
      });
    }

    if (region.army?.characters) {
      region.army.characters.forEach (characterId => {
        const character = this.characterById ()[characterId];
        if (character.front === "free-peoples") {
          leadership += character.leadership;
          leaders.push (character);
        }
      });
    }

    leaders.sort ((a, b) => this.compareFreePeopleLeaders (a, b));
    const unitNodes = leaders.slice (0, 2).map<WotrLeaderUnitNode> (leader => {
      if (typeof leader === "string") {
        return { unitType: "leader", character: null, nationId: leader, image: this.assets.getLeaderImage (leader), svgX: 0, svgY: 0 };
      } else {
        return { unitType: "character", character: leader.id, nationId: null, image: this.assets.getCharacterImage (leader.id), svgX: 0, svgY: 0 };
      }
    });
    return [unitNodes, leadership];
  }

  private regionToShadowLeaderUnitNodes (region: WotrRegion): [WotrLeaderUnitNode[], number] {
    let leadership = 0;
    const leaders: (WotrCharacter | "nazgul")[] = [];
    if (region.army?.nNazgul) {
      leadership += region.army.nNazgul;
      leaders.push ("nazgul");
    }
    if (region.army?.characters) {
      region.army.characters.forEach (characterId => {
        const character = this.characterById ()[characterId];
        leadership += character.leadership;
        leaders.push (character);
      });
    }
    leaders.sort ((a, b) => this.compareShadowLeaders (a, b));
    const unitNodes = leaders.slice (0, 2).map<WotrLeaderUnitNode> (leader => {
      if (leader === "nazgul") {
        return { unitType: "nazgul", character: null, nationId: null, image: this.assets.getNazgulImage (), svgX: 0, svgY: 0 };
      } else {
        return { unitType: "character", character: leader.id, nationId: null, image: this.assets.getCharacterImage (leader.id), svgX: 0, svgY: 0 };
      }
    });
    return [unitNodes, leadership];
  }

  private compareFreePeopleLeaders (a: WotrCharacter | WotrNationId, b: WotrCharacter | WotrNationId) {
    if (typeof a === "string") { return typeof b === "string" ? (a < b ? -1 : (a === b ? 0 : 1)) : 1; }
    if (typeof b === "string") { return -1; }
    for (const c of SORTED_COMPANIONS) {
      if (a.id === c) { return -1; }
      if (b.id === c) { return 1; }
    }
    return 0;
  }

  private compareShadowLeaders (a: WotrCharacter | "nazgul", b: WotrCharacter | "nazgul") {
    if (a === "nazgul") { return b === "nazgul" ? 0 : 1; }
    if (b === "nazgul") { return -1; }
    for (const m of SORTED_MINIONS) {
      if (a.id === m) { return -1; }
      if (b.id === m) { return 1; }
    }
    return 0;
  }

}

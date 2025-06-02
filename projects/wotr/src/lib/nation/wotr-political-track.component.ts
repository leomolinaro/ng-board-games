import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BgSvgModule } from "@leobg/commons";
import { arrayUtil } from "@leobg/commons/utils";
import { WotrAssetsService } from "../assets/wotr-assets.service";
import { WotrNation, WotrNationId, WotrPoliticalStep } from "./wotr-nation.models";

interface WotrPoliticalNode {
  id: WotrNationId;
  nation: WotrNation;
  image: string;
  tooltip: string;
  svgX: number;
  svgY: number;
}

const PX = 1185;
const PX1 = PX - 18;
const PX2 = PX;
const PX3 = PX + 18;

const PY = 274;
const PY1 = PY - 20;
const PY2 = PY;
const PY3 = PY + 20;

const PSTEP = 91;
const PSTEP3 = 0;
const PSTEP2 = PSTEP3 + PSTEP;
const PSTEP1 = PSTEP2 + PSTEP;
const PSTEPWAR = PSTEP1 + PSTEP;

@Component({
  selector: "[wotrPoliticalTrack]",
  imports: [BgSvgModule, MatTooltipModule],
  template: `
    @for (politicalNode of politicalNodes (); track politicalNode.id) {
    <svg:image
      transform="scale(0.8, 0.8)"
      [attr.x]="politicalNode.svgX"
      [attr.y]="politicalNode.svgY"
      [attr.xlink:href]="politicalNode.image" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrPoliticalTrackComponent {
  private assets = inject(WotrAssetsService);

  nations = input.required<WotrNation[]>();
  private politicalNodeMap!: Record<WotrNationId, WotrPoliticalNode>;

  politicalNodes: Signal<WotrPoliticalNode[]> = computed(() => {
    const { nodes, map } = arrayUtil.entitiesToNodes(
      this.nations(),
      this.politicalNodeMap || {},
      nation => nation.id,
      (nation, node) => nation === node.nation,
      (nation, index, oldNode) => this.nationToPoliticalNode(nation, oldNode)
    );
    this.politicalNodeMap = map;
    return nodes;
  });

  private nationToPoliticalNode(nation: WotrNation, oldNode: WotrPoliticalNode | null): WotrPoliticalNode {
    // const path = this.mapService.getRegionPath (nation.id);
    const node: WotrPoliticalNode = {
      id: nation.id,
      nation,
      tooltip: nation.name,
      svgX: this.getPoliticalMakerX(nation.id, nation.politicalStep),
      svgY: this.getPoliticalMakerY(nation.id, nation.politicalStep),
      image: this.assets.getPoliticalMarkerImage(nation.id, nation.active)
    };
    return node;
  }

  private politicalMakerXY: Record<WotrNationId, Record<WotrPoliticalStep, { x: number; y: number }>> = {
    dwarves: {
      3: { x: PX1, y: PY1 + PSTEP3 },
      2: { x: PX1, y: PY1 + PSTEP2 },
      1: { x: PX1, y: PY1 + PSTEP1 },
      atWar: { x: PX1, y: PY1 + PSTEPWAR }
    },
    elves: {
      3: { x: PX1, y: PY3 + PSTEP3 },
      2: { x: PX1, y: PY3 + PSTEP2 },
      1: { x: PX1, y: PY3 + PSTEP1 },
      atWar: { x: PX1, y: PY3 + PSTEPWAR }
    },
    gondor: {
      3: { x: PX2, y: PY1 + PSTEP3 },
      2: { x: PX2, y: PY1 + PSTEP2 },
      1: { x: PX1, y: PY2 + PSTEP1 },
      atWar: { x: PX1, y: PY2 + PSTEPWAR }
    },
    southrons: {
      3: { x: PX2, y: PY3 + PSTEP3 },
      2: { x: PX2, y: PY3 + PSTEP2 },
      1: { x: PX3, y: PY2 + PSTEP1 },
      atWar: { x: PX3, y: PY2 + PSTEPWAR }
    },
    isengard: {
      3: { x: PX1, y: PY2 + PSTEP3 },
      2: { x: PX1, y: PY2 + PSTEP2 },
      1: { x: PX2, y: PY1 + PSTEP1 },
      atWar: { x: PX2, y: PY1 + PSTEPWAR }
    },
    sauron: {
      3: { x: PX3, y: PY2 + PSTEP3 },
      2: { x: PX3, y: PY2 + PSTEP2 },
      1: { x: PX2, y: PY3 + PSTEP1 },
      atWar: { x: PX2, y: PY3 + PSTEPWAR }
    },
    north: {
      3: { x: PX3, y: PY1 + PSTEP3 },
      2: { x: PX3, y: PY1 + PSTEP2 },
      1: { x: PX3, y: PY1 + PSTEP1 },
      atWar: { x: PX3, y: PY1 + PSTEPWAR }
    },
    rohan: {
      3: { x: PX3, y: PY3 + PSTEP3 },
      2: { x: PX3, y: PY3 + PSTEP2 },
      1: { x: PX3, y: PY3 + PSTEP1 },
      atWar: { x: PX3, y: PY3 + PSTEPWAR }
    }
  };

  getPoliticalMakerX(nationId: WotrNationId, step: WotrPoliticalStep) {
    return this.politicalMakerXY[nationId][step].x;
  }

  getPoliticalMakerY(nationId: WotrNationId, step: WotrPoliticalStep) {
    return this.politicalMakerXY[nationId][step].y;
  }
}

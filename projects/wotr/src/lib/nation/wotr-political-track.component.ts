import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, Signal, computed, inject } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BgSvgModule } from "@leobg/commons";
import { arrayUtil } from "@leobg/commons/utils";
import { WotrAssetsService } from "../assets/wotr-assets.service";
import { WotrGameUi } from "../game/wotr-game-ui.store";
import { WotrNation, WotrNationId, WotrPoliticalStep } from "./wotr-nation.models";
import { WotrNationStore } from "./wotr-nation.store";

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
  imports: [BgSvgModule, MatTooltipModule, NgClass],
  template: `
    @for (politicalNode of politicalNodes(); track politicalNode.id) {
      @let selectable = validNationMap()?.[politicalNode.id];
      <svg:image
        transform="scale(0.8, 0.8)"
        [attr.x]="politicalNode.svgX"
        [attr.y]="politicalNode.svgY"
        [attr.xlink:href]="politicalNode.image" />
      <svg:rect
        class="political-marker-rect"
        [attr.transform]="
          'scale(0.8, 0.8) rotate(45,' +
          (politicalNode.svgX + 10) +
          ', ' +
          (politicalNode.svgY + 16) +
          ')'
        "
        [attr.x]="politicalNode.svgX"
        [attr.y]="politicalNode.svgY"
        [attr.width]="24"
        [attr.height]="24"
        [ngClass]="{
          disabled: validNationMap() && !selectable,
          selectable: validNationMap() && selectable
        }"
        (click)="onNationClick(politicalNode.id)"></svg:rect>
    }
  `,
  styles: [
    `
      .political-marker-rect {
        fill: transparent;
        &.selectable {
          cursor: pointer;
        }
        &.disabled {
          cursor: not-allowed;
          opacity: 0.5;
          fill: black; // does not work for image
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrPoliticalTrackComponent {
  private assets = inject(WotrAssetsService);
  private nationStore = inject(WotrNationStore);
  private ui = inject(WotrGameUi);

  protected nations = this.nationStore.nations;
  private validNations = this.ui.nationSelection;
  private politicalNodeMap!: Record<WotrNationId, WotrPoliticalNode>;
  protected validNationMap: Signal<Partial<Record<WotrNationId, boolean>> | null> = computed(() => {
    const validNations = this.validNations();
    if (!validNations) {
      return null;
    }
    return arrayUtil.toMap(
      validNations,
      n => n,
      n => true // true if the nation is valid, false otherwise
    );
  });

  protected politicalNodes: Signal<WotrPoliticalNode[]> = computed(() => {
    const { nodes, map } = arrayUtil.entitiesToNodes(
      this.nations(),
      this.politicalNodeMap || {},
      nation => nation.id,
      (nation, node) => nation === node?.nation,
      (nation, index, oldNode) => this.nationToPoliticalNode(nation, oldNode)
    );
    this.politicalNodeMap = map;
    return nodes;
  });

  private nationToPoliticalNode(
    nation: WotrNation,
    oldNode: WotrPoliticalNode | null
  ): WotrPoliticalNode {
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

  private politicalMakerXY: Record<
    WotrNationId,
    Record<WotrPoliticalStep, { x: number; y: number }>
  > = {
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

  private getPoliticalMakerX(nationId: WotrNationId, step: WotrPoliticalStep) {
    return this.politicalMakerXY[nationId][step].x;
  }

  private getPoliticalMakerY(nationId: WotrNationId, step: WotrPoliticalStep) {
    return this.politicalMakerXY[nationId][step].y;
  }

  protected onNationClick(nationId: WotrNationId) {
    if (this.validNationMap()?.[nationId]) {
      this.ui.nation.emit(nationId);
    }
  }
}

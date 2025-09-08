import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from "@angular/core";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { WotrGameUi } from "../game/wotr-game-ui";
import { WotrElvenRing, WotrFrontId } from "./wotr-front-models";

interface WotrElvenRingNode {
  id: WotrElvenRing;
  image: string;
  frontId: WotrFrontId;
  svgX: number;
  svgY: number;
  selectable: boolean;
}

const X0 = 297;
const XSTEP = 26;

const VILYA_X = X0 - XSTEP;
const NENYA_X = X0;
const NARYA_X = X0 + XSTEP;

const Y0 = 18;

@Component({
  selector: "[wotrElvenRingsBox]",
  template: `
    @let elvenRingSelection = ui.elvenRingSelection();
    @for (elvenRingNode of elvenRingNodes(); track elvenRingNode.id) {
      <svg:image
        transform="scale(0.8, 0.8)"
        [attr.x]="elvenRingNode.svgX"
        [attr.y]="elvenRingNode.svgY"
        [attr.xlink:href]="elvenRingNode.image" />
      <svg:rect
        class="border"
        [class]="{
          shadow: elvenRingNode.frontId === 'shadow'
        }"
        transform="scale(0.8, 0.8)"
        [attr.x]="elvenRingNode.svgX"
        [attr.y]="elvenRingNode.svgY"
        width="19"
        height="19"
        rx="3"
        ry="3" />
      <svg:rect
        class="fill"
        [class]="{
          disabled: elvenRingSelection && !elvenRingNode.selectable,
          selectable: elvenRingSelection && elvenRingNode.selectable
        }"
        transform="scale(0.8, 0.8)"
        [attr.x]="elvenRingNode.svgX"
        [attr.y]="elvenRingNode.svgY"
        width="19"
        height="19"
        rx="3"
        ry="3"
        (click)="selectElvenRing(elvenRingNode)" />
    }
  `,
  styles: [
    `
      @use "wotr-variables" as wotr;

      .border {
        fill: none;
        &.shadow {
          stroke: wotr.$red;
          stroke-width: 4px;
        }
      }
      .fill {
        fill: transparent;
        &.selectable {
          cursor: pointer;
        }
        &.disabled {
          cursor: not-allowed;
          opacity: 0.5;
          fill: black;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrElvenRingsBox {
  protected ui = inject(WotrGameUi);

  freePeoplesElvenRings = input.required<WotrElvenRing[]>();
  shadowElvenRings = input.required<WotrElvenRing[]>();

  private assets = inject(WotrAssetsStore);

  private svgX: Record<WotrElvenRing, number> = {
    vilya: VILYA_X,
    nenya: NENYA_X,
    narya: NARYA_X
  };

  elvenRingNodes: Signal<WotrElvenRingNode[]> = computed(() => {
    const elvenRingSelection = this.ui.elvenRingSelection();
    const selectableFront = elvenRingSelection ? elvenRingSelection.frontId : null;
    return [
      ...this.freePeoplesElvenRings().map(e =>
        this.elvenRingToNode(e, "free-peoples", selectableFront === "free-peoples")
      ),
      ...this.shadowElvenRings().map(e =>
        this.elvenRingToNode(e, "shadow", selectableFront === "shadow")
      )
    ];
  });

  private elvenRingToNode(
    elvenRing: WotrElvenRing,
    frontId: WotrFrontId,
    selectable: boolean
  ): WotrElvenRingNode {
    return {
      id: elvenRing,
      image: this.assets.elvenRingImage(elvenRing),
      frontId,
      selectable,
      svgX: this.svgX[elvenRing],
      svgY: Y0
    };
  }

  selectElvenRing(elvenRingNode: WotrElvenRingNode) {
    if (!this.ui.elvenRingSelection() || !elvenRingNode.selectable) return;
    this.ui.elvenRing.emit(elvenRingNode.id);
  }
}

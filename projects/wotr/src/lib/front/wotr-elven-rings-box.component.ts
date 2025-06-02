import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from "@angular/core";
import { WotrAssetsService } from "../assets/wotr-assets.service";
import { WotrElvenRing, WotrFrontId } from "./wotr-front.models";

interface WotrElvenRingNode {
  id: string;
  image: string;
  frontId: WotrFrontId;
  svgX: number;
  svgY: number;
}

const X0 = 297;
const XSTEP = 26;

const VILYA_X = X0 - XSTEP;
const NENYA_X = X0;
const NARYA_X = X0 + XSTEP;

const Y0 = 18;

@Component({
  selector: "[wotrElvenRingsBox]",
  imports: [NgClass],
  template: `
    @for (elvenRingNode of elvenRingNodes (); track elvenRingNode.id) {
    <svg:image
      transform="scale(0.8, 0.8)"
      [attr.x]="elvenRingNode.svgX"
      [attr.y]="elvenRingNode.svgY"
      [attr.xlink:href]="elvenRingNode.image" />
    <svg:rect
      class="border"
      [ngClass]="{ shadow: elvenRingNode.frontId === 'shadow' }"
      transform="scale(0.8, 0.8)"
      [attr.x]="elvenRingNode.svgX"
      [attr.y]="elvenRingNode.svgY"
      width="19"
      height="19"
      rx="3"
      ry="3" />
    }
  `,
  styles: [
    `
      @import "wotr-variables";

      .border {
        fill: none;
        &.shadow {
          stroke: $red;
          stroke-width: 4px;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrElvenRingsBoxComponent {
  freePeoplesElvenRings = input.required<WotrElvenRing[]>();
  shadowElvenRings = input.required<WotrElvenRing[]>();

  private assets = inject(WotrAssetsService);

  private svgX: Record<WotrElvenRing, number> = {
    vilya: VILYA_X,
    nenya: NENYA_X,
    narya: NARYA_X
  };

  elvenRingNodes: Signal<WotrElvenRingNode[]> = computed(() => {
    return [
      ...this.freePeoplesElvenRings().map(e => this.elvenRingToNode(e, "free-peoples")),
      ...this.shadowElvenRings().map(e => this.elvenRingToNode(e, "shadow"))
    ];
  });

  private elvenRingToNode(elvenRing: WotrElvenRing, frontId: WotrFrontId) {
    return {
      id: elvenRing,
      image: this.assets.getElvenRingImage(elvenRing),
      frontId,
      svgX: this.svgX[elvenRing],
      svgY: Y0
    };
  }
}

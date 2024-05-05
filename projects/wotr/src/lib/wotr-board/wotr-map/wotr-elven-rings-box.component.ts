import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from "@angular/core";
import { WotrAssetsService } from "../../wotr-assets.service";
import { WotrElvenRing, WotrFront, WotrFrontId } from "../../wotr-elements/wotr-front.models";

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

@Component ({
  selector: "[wotrElvenRingsBox]",
  standalone: true,
  imports: [NgClass],
  template: `
    @for (elvenRingNode of elvenRingNodes (); track elvenRingNode.id) {
      <svg:image
        transform="scale(0.8, 0.8)"
        [attr.x]="elvenRingNode.svgX" [attr.y]="elvenRingNode.svgY"
        [attr.xlink:href]="elvenRingNode.image"/>
      <svg:rect class="border" [ngClass]="{ shadow: elvenRingNode.frontId === 'shadow' }"
        transform="scale(0.8, 0.8)"
        [attr.x]="elvenRingNode.svgX" [attr.y]="elvenRingNode.svgY"
        width=19 height=19 rx=3 ry=3/>
    }
  `,
  styles: [`
    @import 'wotr-variables';

    .border {
      fill: none;
      &.shadow {
        stroke: $red;
        stroke-width: 4px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrElvenRingsBoxComponent {

  fronts = input.required<WotrFront[]> ();

  private assets = inject (WotrAssetsService);
  
  private svgX: Record<WotrElvenRing, number> = {
    vilya: VILYA_X,
    nenya: NENYA_X,
    narya: NARYA_X,
  };

  elvenRingNodes: Signal<WotrElvenRingNode[]> = computed (() => {
    const nodes: WotrElvenRingNode[] = [];
    for (const front of this.fronts ()) {
      for (const elvenRing of front.elvenRings) {
        nodes.push ({
          id: elvenRing,
          image: this.assets.getElvenRingImage (elvenRing),
          frontId: front.id,
          svgX: this.svgX[elvenRing],
          svgY: Y0
        });
      }
    }
    return nodes;
  });

}

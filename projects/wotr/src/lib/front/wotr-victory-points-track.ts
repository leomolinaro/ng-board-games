import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from "@angular/core";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { WotrFront, WotrFrontId } from "./wotr-front-models";

interface WotrVictoryMarkerNode {
  id: WotrFrontId;
  image: string;
  svgX: number;
  svgY: number;
}

const X0 = 226;
const XSTEP = 27;
const Y0 = 819;
const OFFSET = 5;

@Component({
  selector: "[wotrVictoryPointsTrack]",
  imports: [],
  template: `
    @for (victoryMarkerNode of victoryMarkerNodes(); track victoryMarkerNode.id) {
      <svg:image
        transform="scale(0.8, 0.8)"
        [attr.x]="victoryMarkerNode.svgX"
        [attr.y]="victoryMarkerNode.svgY"
        [attr.xlink:href]="victoryMarkerNode.image" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrVictoryPointsTrack {
  fronts = input.required<WotrFront[]>();

  private assets = inject(WotrAssetsStore);

  victoryMarkerNodes: Signal<WotrVictoryMarkerNode[]> = computed(() => {
    const fronts = this.fronts();
    const v0 = fronts[0].victoryPoints;
    const v1 = fronts[1].victoryPoints;
    const position0 = v0 > 10 ? v0 - 10 : v0;
    const position1 = v1 > 10 ? v1 - 10 : v1;
    const offset = position0 === position1 ? OFFSET : 0;
    return this.fronts().map((front, index) => {
      const frontOffset = offset * (index * 2 - 1);
      return {
        id: front.id,
        image: this.assets.victoryMarker(front.id, front.victoryPoints),
        svgX:
          X0 +
          (front.victoryPoints > 10 ? front.victoryPoints - 10 : front.victoryPoints) * XSTEP +
          frontOffset,
        svgY: Y0 + frontOffset
      };
    });
  });
}

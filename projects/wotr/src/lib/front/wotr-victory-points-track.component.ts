import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from "@angular/core";
import { WotrAssetsService } from "../assets/wotr-assets.service";
import { WotrFront, WotrFrontId } from "./wotr-front.models";

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
    @for (victoryMarkerNode of victoryMarkerNodes (); track victoryMarkerNode.id) {
    <svg:image
      transform="scale(0.8, 0.8)"
      [attr.x]="victoryMarkerNode.svgX"
      [attr.y]="victoryMarkerNode.svgY"
      [attr.xlink:href]="victoryMarkerNode.image" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrVictoryPointsTrackComponent {
  fronts = input.required<WotrFront[]>();

  private assets = inject(WotrAssetsService);

  victoryMarkerNodes: Signal<WotrVictoryMarkerNode[]> = computed(() => {
    const fronts = this.fronts();
    const offset = fronts[0].victoryPoints % 10 === fronts[1].victoryPoints % 10 ? OFFSET : 0;
    return this.fronts().map((front, index) => {
      const frontOffset = offset * (index * 2 - 1);
      return {
        id: front.id,
        image: this.assets.getVictoryMarker(front.id, front.victoryPoints),
        svgX: X0 + (front.victoryPoints % 10) * XSTEP + frontOffset,
        svgY: Y0 + frontOffset
      };
    });
  });
}

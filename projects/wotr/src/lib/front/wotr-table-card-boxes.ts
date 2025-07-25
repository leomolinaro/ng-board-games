import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from "@angular/core";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrFront } from "./wotr-front-models";

interface WotrTableCardNode {
  id: WotrCardId;
  image: string;
  svgX: number;
  svgY: number;
}

const X0 = 164;
const Y0 = 407;
const YSTEP = 47;

@Component({
  selector: "[wotrTableCards]",
  imports: [],
  template: `
    @for (tableCardNode of tableCardNodes(); track tableCardNode.id) {
      <svg:image
        class="card-counters"
        transform="scale(0.8, 0.8)"
        [attr.x]="tableCardNode.svgX"
        [attr.y]="tableCardNode.svgY"
        [attr.xlink:href]="tableCardNode.image"></svg:image>
    }
  `,
  styles: [
    `
      .card-counters {
        fill: white;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrTableCardsComponent {
  freePeoples = input.required<WotrFront>();
  shadow = input.required<WotrFront>();

  private assets = inject(WotrAssetsStore);

  tableCardNodes: Signal<WotrTableCardNode[]> = computed(() => {
    const nodes: WotrTableCardNode[] = [];
    let index = 0;
    this.freePeoples().tableCards.forEach(c => {
      nodes.push(this.cardToNode(c, index));
      index++;
    });
    this.shadow().tableCards.forEach(c => {
      nodes.push(this.cardToNode(c, index));
      index++;
    });
    return nodes;
  });

  private cardToNode(card: WotrCardId, index: number): WotrTableCardNode {
    return {
      id: card,
      image: this.assets.cardPreviewImage(card),
      svgX: X0,
      svgY: Y0 + index * YSTEP
    };
  }
}

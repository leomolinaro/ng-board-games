import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from "@angular/core";
import { WotrAssetsService } from "../../wotr-assets.service";
import { WotrCardId } from "../../wotr-elements/wotr-card.models";
import { WotrFront } from "../../wotr-elements/wotr-front.models";

interface WotrTableCardNode {
  id: WotrCardId;
  image: string;
  svgX: number;
  svgY: number;
}

const X0 = 164;
const Y0 = 407;
const YSTEP = 47;

@Component ({
  selector: "[wotrTableCards]",
  standalone: true,
  imports: [],
  template: `
    @for (tableCardNode of tableCardNodes (); track tableCardNode.id) {
      <svg:image class="card-counters"
        transform="scale(0.8, 0.8)"
        [attr.x]="tableCardNode.svgX" [attr.y]="tableCardNode.svgY"
        [attr.xlink:href]="tableCardNode.image">
      </svg:image>
    }
  `,
  styles: [`
    .card-counters {
      fill: white;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrTableCardsComponent {

  freePeople = input.required<WotrFront> ();
  shadow = input.required<WotrFront> ();

  private assets = inject (WotrAssetsService);

  tableCardNodes: Signal<WotrTableCardNode[]> = computed (() => {
    const nodes: WotrTableCardNode[] = [];
    let index = 0;
    this.freePeople ().tableCards.forEach (c => { nodes.push (this.cardToNode (c, index)); index++; });
    this.shadow ().tableCards.forEach (c => { nodes.push (this.cardToNode (c, index)); index++; });
    return nodes;
  });

  private cardToNode (card: WotrCardId, index: number): WotrTableCardNode {
    return {
      id: card,
      image: this.assets.getCardPreviewImage (card),
      svgX: X0,
      svgY: Y0 + index * YSTEP
    };
  }

}


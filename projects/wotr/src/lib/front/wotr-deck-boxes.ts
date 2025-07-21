import { ChangeDetectionStrategy, Component, Signal, computed, input } from "@angular/core";
import { WotrFront } from "./wotr-front-models";

interface WotrDeckBoxNode {
  id: string;
  nCards: number;
  svgX: number;
  svgY: number;
}

const XSTEP = 94;

const FP_CHA_X = 39;
const FP_STR_X = FP_CHA_X + XSTEP;
const FP_Y = 114;

const S_CHA_X = 1097;
const S_STR_X = S_CHA_X + XSTEP;
const S_Y = 808;

@Component({
  selector: "[wotrDeckBoxes]",
  imports: [],
  template: `
    @for (deckBoxNode of deckBoxNodes(); track deckBoxNode.id) {
      <svg:text
        class="card-counters"
        transform="scale(0.8, 0.8)"
        [attr.x]="deckBoxNode.svgX"
        [attr.y]="deckBoxNode.svgY">
        {{ deckBoxNode.nCards }}
      </svg:text>
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
export class WotrDeckBoxes {
  freePeoples = input.required<WotrFront>();
  shadow = input.required<WotrFront>();

  deckBoxNodes: Signal<WotrDeckBoxNode[]> = computed(() => {
    return [
      { id: "fpCha", nCards: this.freePeoples().characterDeck.length, svgX: FP_CHA_X, svgY: FP_Y },
      { id: "fpStr", nCards: this.freePeoples().strategyDeck.length, svgX: FP_STR_X, svgY: FP_Y },
      { id: "sCha", nCards: this.shadow().characterDeck.length, svgX: S_CHA_X, svgY: S_Y },
      { id: "sStr", nCards: this.shadow().strategyDeck.length, svgX: S_STR_X, svgY: S_Y }
    ];
  });
}

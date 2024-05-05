import { ChangeDetectionStrategy, Component, Signal, computed, input } from "@angular/core";
import { WotrFront } from "../../wotr-elements/wotr-front.models";

interface WotrCardBoxNode {
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

@Component ({
  selector: "[wotrEventCardBoxes]",
  standalone: true,
  imports: [],
  template: `
    @for (cardBoxNode of cardBoxNodes (); track cardBoxNode.id) {
      <svg:text class="card-counters"
        transform="scale(0.8, 0.8)"
        [attr.x]="cardBoxNode.svgX" [attr.y]="cardBoxNode.svgY">
        {{ cardBoxNode.nCards }}
      </svg:text>
    }
  `,
  styles: [`
    .card-counters {
      fill: white;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrEventCardBoxesComponent {

  freePeople = input.required<WotrFront> ();
  shadow = input.required<WotrFront> ();

  cardBoxNodes: Signal<WotrCardBoxNode[]> = computed (() => {
    return [
      { id: "fpCha", nCards: this.freePeople ().characterDeck.length, svgX: FP_CHA_X, svgY: FP_Y },
      { id: "fpStr", nCards: this.freePeople ().strategyDeck.length, svgX: FP_STR_X, svgY: FP_Y },
      { id: "sCha", nCards: this.shadow ().characterDeck.length, svgX: S_CHA_X, svgY: S_Y },
      { id: "sStr", nCards: this.shadow ().strategyDeck.length, svgX: S_STR_X, svgY: S_Y },
    ];
  });

}

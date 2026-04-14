import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from "@angular/core";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { WotrGameUi } from "../game/wotr-game-ui";
import { WotrHuntState } from "./wotr-hunt-store";

interface WotrHuntDieNode {
  id: string;
  image: string;
  svgX: number;
  svgY: number;
}

const X0 = 18;
const XSTEP = 35;
const YSTEP = 35;

const Y0 = 737;

const NPERROW = 4;

@Component({
  selector: "[wotrHuntBox]",
  imports: [],
  template: `
    @for (huntDieNode of huntDieNodes(); track huntDieNode.id) {
      <svg:image
        transform="scale(0.8, 0.8)"
        [attr.x]="huntDieNode.svgX"
        [attr.y]="huntDieNode.svgY"
        [attr.xlink:href]="huntDieNode.image" />
      <svg:rect
        class="fill"
        [class]="{
          selectable: eyeSelection()
        }"
        transform="scale(0.8, 0.8)"
        [attr.x]="huntDieNode.svgX"
        [attr.y]="huntDieNode.svgY"
        width="32"
        height="32"
        rx="3"
        ry="3"
        (click)="selectEyeDie()" />
    }
  `,
  styles: `
    .fill {
      fill: transparent;
      &.selectable {
        cursor: pointer;
      }
    }
  `,

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrHuntBox {
  private ui = inject(WotrGameUi);
  hunt = input.required<WotrHuntState>();

  private assets = inject(WotrAssetsStore);

  protected eyeSelection = this.ui.eyeSelection;

  private nHuntDice = computed(() => this.hunt().nHuntDice);
  private nFreePeopleDice = computed(() => this.hunt().nFreePeopleDice);

  private getX(index: number) {
    return X0 + (index % NPERROW) * XSTEP;
  }
  private getY(index: number) {
    return Y0 + Math.floor(index / NPERROW) * YSTEP;
  }

  huntDieNodes: Signal<WotrHuntDieNode[]> = computed(() => {
    const nodes: WotrHuntDieNode[] = [];
    let index = 0;
    for (let i = 0; i < this.nHuntDice(); i++) {
      nodes.push({
        id: "s" + index,
        image: this.assets.actionDieImage("eye", "shadow"),
        svgX: this.getX(index),
        svgY: this.getY(index)
      });
      index++;
    }
    for (let j = 0; j < this.nFreePeopleDice(); j++) {
      nodes.push({
        id: "fp" + index,
        image: this.assets.actionDieImage("character", "free-peoples"),
        svgX: this.getX(index),
        svgY: this.getY(index)
      });
      index++;
    }
    return nodes;
  });

  selectEyeDie() {
    if (this.eyeSelection()) {
      this.ui.eyeChoice.emit(void 0);
    }
  }
}

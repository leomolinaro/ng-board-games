import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from "@angular/core";
import { WotrAssetsService } from "../assets/wotr-assets.service";
import { WotrFellowship } from "./wotr-fellowhip.models";

interface WotrFellowshipMarkerNode {
  id: string;
  image: string;
  svgX: number;
  svgY: number;
}

const X0 = 710;
const XSTEP = 27;

const PROGRESS_Y = 15;
const CORRUPTION_Y = 25;

@Component({
  selector: "[wotrFellowshipTrack]",
  imports: [],
  template: `
    <svg:image
      transform="scale(0.8, 0.8)"
      [attr.x]="progressNode().svgX"
      [attr.y]="progressNode().svgY"
      [attr.xlink:href]="progressNode().image" />
    <svg:image
      transform="scale(0.8, 0.8)"
      [attr.x]="corruptionNode().svgX"
      [attr.y]="corruptionNode().svgY"
      [attr.xlink:href]="corruptionNode().image" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrFellowshipTrackComponent {
  fellowship = input.required<WotrFellowship>();

  private assets = inject(WotrAssetsService);

  private progress = computed(() => this.fellowship().progress);
  private status = computed(() => this.fellowship().status);
  private corruption = computed(() => this.fellowship().corruption);

  progressNode: Signal<WotrFellowshipMarkerNode> = computed(() => {
    return {
      id: "progress",
      image: this.assets.getFellowshipProgressCounter(this.status() === "revealed"),
      svgX: this.getX(this.progress()),
      svgY: PROGRESS_Y
    };
  });

  corruptionNode: Signal<WotrFellowshipMarkerNode> = computed(() => {
    return {
      id: "corruption",
      image: this.assets.getCorruptionCounter(),
      svgX: this.getX(this.corruption()),
      svgY: CORRUPTION_Y
    };
  });

  private getX(index: number) {
    return X0 + index * XSTEP;
  }
}

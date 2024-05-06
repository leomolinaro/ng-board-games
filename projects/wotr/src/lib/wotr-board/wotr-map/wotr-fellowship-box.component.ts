import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from "@angular/core";
import { WotrAssetsService } from "../../wotr-assets.service";
import { WotrFellowship } from "../../wotr-elements/fellowship/wotr-fellowhip.models";

interface WotrCompanionNode {
  id: string;
  image: string;
  svgX: number;
  svgY: number;
  tooltip: string;
}

const X0 = 1084;
const XSTEP = 43;
const YSTEP = 39;
const Y0 = 60;
const NPERROW = 2;

const GUIDE_X = 1200;
const GUIDE_Y = 100;

@Component ({
  selector: "[wotrFellowshipBox]",
  standalone: true,
  imports: [],
  template: `
    @for (companionNode of companionNodes (); track companionNode.id) {
      <svg:image
        transform="scale(0.8, 0.8)"
        [attr.x]="companionNode.svgX" [attr.y]="companionNode.svgY"
        [attr.xlink:href]="companionNode.image"/>
    }
    <svg:image
      transform="scale(0.8, 0.8)"
      [attr.x]="guideNode ().svgX" [attr.y]="guideNode ().svgY"
      [attr.xlink:href]="guideNode ().image"/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrFellowshipBoxComponent {

  fellowship = input.required<WotrFellowship> ();
  private companions = computed (() => this.fellowship ().companions);
  private guide = computed (() => this.fellowship ().guide);

  private assets = inject (WotrAssetsService);

  private getX (index: number) { return X0 + (index % NPERROW) * XSTEP; }
  private getY (index: number) { return Y0 + Math.floor (index / NPERROW) * YSTEP; }

  companionNodes: Signal<WotrCompanionNode[]> = computed (() => {
    const nodes: WotrCompanionNode[] = [];
    const guide = this.guide ();
    let index = 0;
    for (const companion of this.companions ()) {
      if (companion === guide) { continue; }
      const unitImage = this.assets.getCompanionImage (companion);
      nodes.push ({
        id: companion,
        image: unitImage.source,
        tooltip: companion, // TODO
        svgX: this.getX (index),
        svgY: this.getY (index) - unitImage.height,
      });
      index++;
    }
    return nodes;
  });

  guideNode: Signal<WotrCompanionNode> = computed (() => {
    const guide = this.guide ();
    const unitImage = this.assets.getCompanionImage (guide);
    return {
      id: guide,
      image: unitImage.source,
      tooltip: guide, // TODO
      svgX: GUIDE_X,
      svgY: GUIDE_Y - unitImage.height,
    };
  });

}

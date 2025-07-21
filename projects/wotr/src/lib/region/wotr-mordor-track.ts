import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { WotrFellowship } from "../fellowship/wotr-fellowhip-models";

const MORDOR_TRACK_ATTR_X = {
  0: 1046,
  1: 1088,
  2: 1123,
  3: 1115,
  4: 1079,
  5: 1038
};

const MORDOR_TRACK_ATTR_Y = {
  0: 624,
  1: 623,
  2: 599,
  3: 557,
  4: 537,
  5: 548
};

@Component({
  selector: "[wotrMordorTrack]",
  imports: [MatTooltipModule],
  template: `
    <svg:g>
      <svg:image
        [attr.width]="image().width"
        [attr.height]="image().height"
        [attr.x]="attrX()"
        [attr.y]="attrY()"
        transform="scale(0.8, 0.8)"
        [attr.xlink:href]="image().source" />
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrMordorTrack {
  private assets = inject(WotrAssetsStore);

  fellowship = input.required<WotrFellowship>();

  private revealed = computed(() => this.fellowship().status === "revealed");
  private mordorTrack = computed(() => this.fellowship().mordorTrack!);
  protected image = computed(() => this.assets.fellowshipImage(this.revealed()));
  protected attrX = computed(() => MORDOR_TRACK_ATTR_X[this.mordorTrack()]);
  protected attrY = computed(
    () => MORDOR_TRACK_ATTR_Y[this.mordorTrack()] + (this.revealed() ? 0 : 16)
  );
}

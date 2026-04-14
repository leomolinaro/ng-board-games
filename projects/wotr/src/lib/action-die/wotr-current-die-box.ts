import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { WotrFrontStore } from "../front/wotr-front-store";

@Component({
  selector: "[wotrCurrentDieBox]",
  imports: [],
  template: `
    @if (currentDieImage()) {
      <svg:image
        transform="scale(0.8, 0.8)"
        [attr.x]="334"
        [attr.y]="751"
        [attr.xlink:href]="currentDieImage()" />
    }
    @if (currentTokenImage()) {
      <svg:image
        transform="scale(0.8, 0.8)"
        [attr.x]="332"
        [attr.y]="749"
        [attr.xlink:href]="currentTokenImage()" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrCurrentDieBox {
  private assets = inject(WotrAssetsStore);

  private frontStore = inject(WotrFrontStore);

  protected currentDieImage = computed(() => {
    const fp = this.frontStore.front("free-peoples");
    let c = fp.currentActionDie;
    if (c) return this.assets.actionDieImage(c, "free-peoples");
    const s = this.frontStore.front("shadow");
    c = s.currentActionDie;
    if (c) return this.assets.actionDieImage(c, "shadow");
    return null;
  });

  protected currentTokenImage = computed(() => {
    const fp = this.frontStore.front("free-peoples");
    let c = fp.currentActionToken;
    if (c) return this.assets.actionTokenImage(c, "free-peoples");
    const s = this.frontStore.front("shadow");
    c = s.currentActionToken;
    if (c) return this.assets.actionTokenImage(c, "shadow");
    return null;
  });
}

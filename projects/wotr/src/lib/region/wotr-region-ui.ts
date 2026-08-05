import { inject, Injectable } from "@angular/core";
import { WotrGameUiContext } from "../game/wotr-game-ui-context";
import { targetRegion, WotrRegionChoose } from "./wotr-region-actions";
import { WotrRegionId } from "./wotr-region-models";

@Injectable()
export class WotrRegionUi {
  private ui = inject(WotrGameUiContext);

  async chooseRegion(regions: WotrRegionId[]): Promise<WotrRegionChoose> {
    const region = await this.ui.askRegion("Choose a region", regions);
    return targetRegion(region);
  }
}

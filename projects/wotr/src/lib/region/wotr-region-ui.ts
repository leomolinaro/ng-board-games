import { inject, Injectable } from "@angular/core";
import { WotrGameUi } from "../game/wotr-game-ui";
import { targetRegion, WotrRegionChoose } from "./wotr-region-actions";
import { WotrRegionId } from "./wotr-region-models";

@Injectable({ providedIn: "root" })
export class WotrRegionUi {
  private ui = inject(WotrGameUi);

  async chooseRegion(regions: WotrRegionId[]): Promise<WotrRegionChoose> {
    const region = await this.ui.askRegion("Choose a region", regions);
    return targetRegion(region);
  }
}

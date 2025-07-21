import { inject, Injectable } from "@angular/core";
import { WotrGameUi } from "../game/wotr-game-ui.store";
import { randomUtil } from "../../../../commons/utils/src";
import { WotrAction } from "../commons/wotr-action.models";
import { revealFellowship } from "../fellowship/wotr-fellowship-actions";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrRegionStore } from "../region/wotr-region.store";
import { drawHuntTile } from "./wotr-hunt-actions";
import { WotrHuntStore } from "./wotr-hunt.store";

@Injectable({ providedIn: "root" })
export class WotrHuntUi {
  private huntStore = inject(WotrHuntStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);
  private ui = inject(WotrGameUi);

  async revealFellowship(): Promise<WotrAction[]> {
    const progress = this.fellowshipStore.progress();
    const fellowshipRegion = this.regionStore.regions().find(r => r.fellowship)!;
    const reachableRegions = this.regionStore.reachableRegions(fellowshipRegion.id, progress);
    const validRegions = reachableRegions.filter(r => {
      const region = this.regionStore.region(r);
      if (region.settlement !== "city" && region.settlement !== "stronghold") return true;
      if (region.controlledBy !== "free-peoples") return true;
      return false;
    });
    const chosenRegion = await this.ui.askRegion(
      "Choose a region where to reveal the fellowship",
      validRegions
    );
    return [revealFellowship(chosenRegion)];
  }

  async drawHuntTile(): Promise<WotrAction> {
    await this.ui.askContinue("Draw hunt tile");
    const huntTile = randomUtil.getRandomElement(this.huntStore.huntPool());
    return drawHuntTile(huntTile);
  }
}

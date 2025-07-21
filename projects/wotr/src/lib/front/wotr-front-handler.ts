import { Injectable, inject } from "@angular/core";
import { frontOfNation } from "../nation/wotr-nation-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrFrontId } from "./wotr-front-models";
import { WotrFrontStore } from "./wotr-front-store";

@Injectable({ providedIn: "root" })
export class WotrFrontHandler {
  private frontStore = inject(WotrFrontStore);
  private regionStore = inject(WotrRegionStore);

  refreshVictoryPoints() {
    const points: Record<WotrFrontId, number> = {
      "free-peoples": 0,
      "shadow": 0
    };

    for (const region of this.regionStore.regions()) {
      if (region.settlement === "stronghold" || region.settlement === "city") {
        if (
          region.nationId &&
          region.controlledBy &&
          frontOfNation(region.nationId) !== region.controlledBy
        ) {
          points[region.controlledBy] += region.settlement === "stronghold" ? 2 : 1;
        }
      }
    }
    this.frontStore.setVictoryPoints(points["free-peoples"], "free-peoples");
    this.frontStore.setVictoryPoints(points.shadow, "shadow");
  }
}

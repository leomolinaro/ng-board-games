import { inject, Injectable } from "@angular/core";
import { WotrElvenRingAction } from "../game/wotr-story-models";
import { WotrHuntStore } from "../hunt/wotr-hunt-store";
import { WotrLogWriter } from "../log/wotr-log-writer";
import { frontOfNation } from "../nation/wotr-nation-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrFrontId } from "./wotr-front-models";
import { WotrFrontStore } from "./wotr-front-store";

@Injectable({ providedIn: "root" })
export class WotrFrontHandler {
  private frontStore = inject(WotrFrontStore);
  private regionStore = inject(WotrRegionStore);
  private logger = inject(WotrLogWriter);
  private huntStore = inject(WotrHuntStore);

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

  useElvenRing(elvenRing: WotrElvenRingAction, front: WotrFrontId) {
    this.logger.logElvenRingUse(elvenRing, front);
    this.frontStore.removeActionDie(elvenRing.fromDie, front);
    if (elvenRing.toDie === "eye") {
      this.huntStore.addHuntDice(1);
    } else {
      this.frontStore.addActionDie(elvenRing.toDie, front);
    }
    this.frontStore.removeElvenRing(elvenRing.ring, front);
    if (front === "free-peoples") {
      this.frontStore.addElvenRing(elvenRing.ring, "shadow");
    }
    this.frontStore.setElvenRingUsed(front);
  }
}

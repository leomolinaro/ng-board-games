import { inject, Injectable } from "@angular/core";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrElvenRingAction } from "../game/wotr-story-models";
import { WotrHuntStore } from "../hunt/wotr-hunt-store";
import { WotrLogWriter } from "../log/wotr-log-writer";
import { frontOfNation } from "../nation/wotr-nation-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrFrontAction } from "./wotr-front-actions";
import { WotrElvenRing, WotrFrontId } from "./wotr-front-models";
import { WotrFrontStore } from "./wotr-front-store";

@Injectable({ providedIn: "root" })
export class WotrFrontHandler {
  private frontStore = inject(WotrFrontStore);
  private regionStore = inject(WotrRegionStore);
  private logger = inject(WotrLogWriter);
  private huntStore = inject(WotrHuntStore);
  private actionRegistry = inject(WotrActionRegistry);

  init() {
    this.actionRegistry.registerActions(this.getActionAppliers() as any);
    this.actionRegistry.registerActionLoggers(this.getActionLoggers() as any);
  }

  getActionAppliers(): WotrActionApplierMap<WotrFrontAction> {
    return {
      "elven-ring-use": (story, front) => this.useElvenRing(story.elvenRing, front)
    };
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrFrontAction> {
    return {
      "elven-ring-use": (action, front, f) => [f.player(front), " uses the Elven Ring"]
    };
  }

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

  private useElvenRing(elvenRing: WotrElvenRing, front: WotrFrontId) {
    this.frontStore.removeElvenRing(elvenRing, front);
    if (front === "free-peoples") {
      this.frontStore.addElvenRing(elvenRing, "shadow");
    }
  }

  convertDieWithElvenRing(elvenRing: WotrElvenRingAction, front: WotrFrontId) {
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

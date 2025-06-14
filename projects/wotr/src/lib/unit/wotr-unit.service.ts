import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFrontId } from "../front/wotr-front.models";
import { filterActions } from "../game/wotr-story.models";
import { WotrNation, WotrNationId, frontOfNation } from "../nation/wotr-nation.models";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrPlayer } from "../player/wotr-player";
import { WotrRegion } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import {
  WotrEliteUnitElimination,
  WotrRegularUnitElimination,
  WotrUnitAction
} from "./wotr-unit-actions";
import { WotrArmy } from "./wotr-unit.models";

@Injectable({ providedIn: "root" })
export class WotrUnitService {
  private actionService = inject(WotrActionService);
  private nationStore = inject(WotrNationStore);
  private nationService = inject(WotrNationService);
  private regionStore = inject(WotrRegionStore);

  init() {
    this.actionService.registerActions(this.getActionAppliers() as any);
    this.actionService.registerActionLoggers(this.getActionLoggers() as any);
  }

  getActionAppliers(): WotrActionApplierMap<WotrUnitAction> {
    return {
      "army-movements": async (action, front) => {
        for (const movement of action.movements) {
          this.regionStore.moveArmy(movement.fromRegion, movement.toRegion, movement.leftUnits);
          this.nationService.checkNationActivationByArmyMovement(movement.toRegion, front);
        }
      },
      "nazgul-movement": async (action, front) => {
        const fromRegion = this.regionStore.region(action.fromRegion);
        this.removeNazgulFromRegion(action.nNazgul, fromRegion);
        const toRegion = this.regionStore.region(action.toRegion);
        this.addNazgulToRegion(action.nNazgul, toRegion);
      },
      "regular-unit-recruitment": async (action, front) => {
        const region = this.regionStore.region(action.region);
        this.nationStore.removeRegularsFromReinforcements(action.quantity, action.nation);
        this.addRegularsToRegion(action.quantity, action.nation, region);
      },
      "regular-unit-elimination": async (action, front) => {
        const region = this.regionStore.region(action.region);
        const frontId = frontOfNation(action.nation);
        this.removeRegularsFromRegion(action.quantity, action.nation, region);
        switch (frontId) {
          case "free-peoples":
            this.nationStore.addRegularsToCasualties(action.quantity, action.nation);
            break;
          case "shadow":
            this.nationStore.addRegularsToReinforcements(action.quantity, action.nation);
            break;
        }
      },
      "elite-unit-recruitment": async (action, front) => {
        const region = this.regionStore.region(action.region);
        this.nationStore.removeElitesFromReinforcements(action.quantity, action.nation);
        this.addElitesToRegion(action.quantity, action.nation, region);
      },
      "elite-unit-elimination": async (action, front) => {
        const region = this.regionStore.region(action.region);
        const frontId = frontOfNation(action.nation);
        this.removeElitesFromRegion(action.quantity, action.nation, region);
        switch (frontId) {
          case "free-peoples":
            this.nationStore.addElitesToCasualties(action.quantity, action.nation);
            break;
          case "shadow":
            this.nationStore.addElitesToReinforcements(action.quantity, action.nation);
            break;
        }
      },
      "leader-recruitment": async (action, front) => {
        const region = this.regionStore.region(action.region);
        this.nationStore.removeLeadersFromReinforcements(action.quantity, action.nation);
        this.addLeadersToRegion(action.quantity, action.nation, region);
      },
      "leader-elimination": async (action, front) => {
        const region = this.regionStore.region(action.region);
        this.removeLeadersFromRegion(action.quantity, action.nation, region);
        this.nationStore.addLeadersToCasualties(action.quantity, action.nation);
      },
      "nazgul-recruitment": async (action, front) => {
        const region = this.regionStore.region(action.region);
        this.nationStore.removeNazgulFromReinforcements(action.quantity);
        this.addNazgulToRegion(action.quantity, region);
      },
      "nazgul-elimination": async (action, front) => {
        const region = this.regionStore.region(action.region);
        this.removeNazgulFromRegion(action.quantity, region);
        this.nationStore.addNazgulToReinforcements(action.quantity);
      }
    };
  }

  private addRegularsToRegion(quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation(nation)) {
      this.regionStore.addRegularsToArmyUnderSiege(quantity, nation, region.id);
    } else {
      this.regionStore.addRegularsToArmy(quantity, nation, region.id);
    }
  }

  private removeRegularsFromRegion(quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation(nation)) {
      this.regionStore.removeRegularsFromArmyUnderSiege(quantity, nation, region.id);
    } else {
      this.regionStore.removeRegularsFromArmy(quantity, nation, region.id);
    }
  }

  private addElitesToRegion(quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation(nation)) {
      this.regionStore.addElitesToArmyUnderSiege(quantity, nation, region.id);
    } else {
      this.regionStore.addElitesToArmy(quantity, nation, region.id);
    }
  }

  private removeElitesFromRegion(quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation(nation)) {
      this.regionStore.removeElitesFromArmyUnderSiege(quantity, nation, region.id);
    } else {
      this.regionStore.removeElitesFromArmy(quantity, nation, region.id);
    }
  }

  private addLeadersToRegion(quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation(nation)) {
      this.regionStore.addLeadersToArmyUnderSiege(quantity, nation, region.id);
    } else {
      this.regionStore.addLeadersToArmy(quantity, nation, region.id);
    }
  }

  private removeLeadersFromRegion(quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation(nation)) {
      this.regionStore.removeLeadersFromArmyUnderSiege(quantity, nation, region.id);
    } else {
      this.regionStore.removeLeadersFromArmy(quantity, nation, region.id);
    }
  }

  private addNazgulToRegion(quantity: number, region: WotrRegion) {
    if (region.underSiegeArmy?.front === "shadow") {
      this.regionStore.addNazgulToArmyUnderSiege(quantity, region.id);
    } else if (region.army?.front === "shadow") {
      this.regionStore.addNazgulToArmy(quantity, region.id);
    } else {
      this.regionStore.addNazgulToFreeUnits(quantity, region.id);
    }
  }

  private removeNazgulFromRegion(quantity: number, region: WotrRegion) {
    if (region.underSiegeArmy?.front === "shadow") {
      this.regionStore.removeNazgulFromArmyUnderSiege(quantity, region.id);
    } else if (region.army?.front === "shadow") {
      this.regionStore.removeNazgulFromArmy(quantity, region.id);
    } else {
      this.regionStore.removeNazgulFromFreeUnits(quantity, region.id);
    }
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrUnitAction> {
    return {
      "army-movements": (action, front, f) => {
        const firstMovement = action.movements[0];
        const logs = [
          f.player(front),
          " moves one army from ",
          f.region(firstMovement.fromRegion),
          " to ",
          f.region(firstMovement.toRegion)
        ];
        for (let i = 1; i < action.movements.length; i++) {
          logs.splice(
            logs.length,
            0,
            " and one army from ",
            f.region(firstMovement.fromRegion),
            " to ",
            f.region(firstMovement.toRegion)
          );
        }
        return logs;
      },
      "regular-unit-elimination": (action, front, f) => [
        f.player(front),
        " removes regular units from ",
        f.region(action.region)
      ],
      "regular-unit-recruitment": (action, front, f) => [
        f.player(front),
        " recruits regular units in ",
        f.region(action.region)
      ],
      "elite-unit-elimination": (action, front, f) => [
        f.player(front),
        " removes elite units from ",
        f.region(action.region)
      ],
      "elite-unit-recruitment": (action, front, f) => [
        f.player(front),
        " recruits elite units in ",
        f.region(action.region)
      ],
      "leader-elimination": (action, front, f) => [
        f.player(front),
        " removes leaders from ",
        f.region(action.region)
      ],
      "leader-recruitment": (action, front, f) => [
        f.player(front),
        " recruits leaders in ",
        f.region(action.region)
      ],
      "nazgul-elimination": (action, front, f) => [
        f.player(front),
        " removes nazgul from ",
        f.region(action.region)
      ],
      "nazgul-recruitment": (action, front, f) => [
        f.player(front),
        " recruits nazgul in ",
        f.region(action.region)
      ],
      "nazgul-movement": (action, front, f) => [
        f.player(front),
        ` moves ${action.nNazgul} Nazgul from `,
        f.region(action.fromRegion),
        " to ",
        f.region(action.toRegion)
      ]
    };
  }

  async chooseCasualties(player: WotrPlayer) {
    const story = await player.chooseCasualties();
    const actions = filterActions<WotrRegularUnitElimination | WotrEliteUnitElimination>(
      story,
      "regular-unit-elimination",
      "elite-unit-elimination"
    );
    return actions;
  }

  canFrontRecruitReinforcements(frontId: WotrFrontId): boolean {
    if (frontId === "free-peoples") {
      return this.nationStore
        .freePeoplesNations()
        .some(nation => this.canRecruitReinforcements(nation));
    } else {
      return this.nationStore.shadowNations().some(nation => this.canRecruitReinforcements(nation));
    }
  }
  canRecruitReinforcements(nation: WotrNation): boolean {
    if (nation.politicalStep !== "atWar") {
      return false;
    }
    if (!this.nationStore.hasReinforcements(nation)) {
      return false;
    }
    return this.regionStore
      .regions()
      .some(
        region =>
          region.nationId === nation.id && region.controlledBy === nation.front && region.settlement
      );
  }
  canFrontMoveArmies(frontId: WotrFrontId): boolean {
    return this.regionStore.regions().some(region => {
      if (!region.army) return false;
      if (region.army.front !== frontId) return false;
      const armyAtWar = this.isArmyAtWar(region.army);
      const armyUnitNations = this.armyUnitNations(region.army);
      return region.neighbors.some(neighbor => {
        if (neighbor.impassable) return false;
        if (!this.regionStore.isFreeForArmyMovement(neighbor.id, frontId)) return false;
        const neighborRegion = this.regionStore.region(neighbor.id);
        if (armyAtWar) return true;
        return armyUnitNations.some(nation => nation === neighborRegion.nationId);
      });
    });
  }
  private armyUnitNations(army: WotrArmy): WotrNationId[] {
    const nations = new Set<WotrNationId>();
    army.regulars?.forEach(nation => nations.add(nation.nation));
    army.elites?.forEach(nation => nations.add(nation.nation));
    return Array.from(nations);
  }
  private isArmyAtWar(army: WotrArmy): boolean {
    const nations = this.armyUnitNations(army);
    return nations.some(nation => this.nationStore.isAtWar(nation));
  }

  canFrontAttackArmies(frontId: WotrFrontId): boolean {
    return this.regionStore.regions().some(region => {
      if (!region.army) return false;
      if (region.army.front !== frontId) return false;
      return this.canArmyAttackArmies(region.army, region);
    });
  }

  canArmyAttackArmies(army: WotrArmy, region: WotrRegion): boolean {
    if (!this.isArmyAtWar(army)) return false;
    if (region.underSiegeArmy) return true;
    return region.neighbors.some(neighbor => {
      if (neighbor.impassable) return false;
      const neighborRegion = this.regionStore.region(neighbor.id);
      if (!neighborRegion.army) return false;
      if (neighborRegion.army.front !== army.front) return false;
      return true;
    });
  }
}

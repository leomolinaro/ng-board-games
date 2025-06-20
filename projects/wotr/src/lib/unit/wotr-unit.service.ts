import { Injectable, inject } from "@angular/core";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrCharacterStore } from "../character/wotr-character.store";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFrontId } from "../front/wotr-front.models";
import { filterActions } from "../game/wotr-story.models";
import { WotrNation, WotrNationId, frontOfNation } from "../nation/wotr-nation.models";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrPlayer } from "../player/wotr-player";
import { WotrRegion, WotrRegionId } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import {
  WotrEliteUnitElimination,
  WotrEliteUnitRecruitment,
  WotrLeaderRecruitment,
  WotrNazgulRecruitment,
  WotrRegularUnitElimination,
  WotrRegularUnitRecruitment,
  WotrUnitAction
} from "./wotr-unit-actions";
import { WotrArmy, WotrNationUnit, WotrReinforcementUnit } from "./wotr-unit.models";

export interface WotrRecruitmentConstraints {
  points: number;
  exludedRegions: Set<WotrRegionId>;
}

@Injectable({ providedIn: "root" })
export class WotrUnitService {
  private actionService = inject(WotrActionService);
  private nationStore = inject(WotrNationStore);
  private nationService = inject(WotrNationService);
  private regionStore = inject(WotrRegionStore);
  private characterStore = inject(WotrCharacterStore);

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
      "regular-unit-recruitment": async (action, front) => this.recruitRegularUnit(action),
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
      "elite-unit-recruitment": async (action, front) => this.recruitEliteUnit(action),
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
      "leader-recruitment": async (action, front) => this.recruitLeader(action),
      "leader-elimination": async (action, front) => {
        const region = this.regionStore.region(action.region);
        this.removeLeadersFromRegion(action.quantity, action.nation, region);
        this.nationStore.addLeadersToCasualties(action.quantity, action.nation);
      },
      "nazgul-recruitment": async (action, front) => this.recruitNazgul(action),
      "nazgul-elimination": async (action, front) => {
        const region = this.regionStore.region(action.region);
        this.removeNazgulFromRegion(action.quantity, region);
        this.nationStore.addNazgulToReinforcements(action.quantity);
      }
    };
  }

  recruitNazgul(action: WotrNazgulRecruitment) {
    const region = this.regionStore.region(action.region);
    this.nationStore.removeNazgulFromReinforcements(action.quantity);
    this.addNazgulToRegion(action.quantity, region);
  }

  recruitLeader(action: WotrLeaderRecruitment) {
    const region = this.regionStore.region(action.region);
    this.nationStore.removeLeadersFromReinforcements(action.quantity, action.nation);
    this.addLeadersToRegion(action.quantity, action.nation, region);
  }

  recruitEliteUnit(action: WotrEliteUnitRecruitment) {
    const region = this.regionStore.region(action.region);
    this.nationStore.removeElitesFromReinforcements(action.quantity, action.nation);
    this.addElitesToRegion(action.quantity, action.nation, region);
  }

  recruitRegularUnit(action: WotrRegularUnitRecruitment) {
    const region = this.regionStore.region(action.region);
    this.nationStore.removeRegularsFromReinforcements(action.quantity, action.nation);
    this.addRegularsToRegion(action.quantity, action.nation, region);
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
    const constraints: WotrRecruitmentConstraints = { points: 2, exludedRegions: new Set() };
    if (frontId === "free-peoples") {
      return this.nationStore
        .freePeoplesNations()
        .some(nation => this.canRecruitReinforcements(nation, constraints));
    } else {
      return this.nationStore
        .shadowNations()
        .some(nation => this.canRecruitReinforcements(nation, constraints));
    }
  }

  validFrontReinforcementUnits(
    frontId: WotrFrontId,
    constraints: WotrRecruitmentConstraints
  ): WotrReinforcementUnit[] {
    if (frontId === "free-peoples") {
      return this.nationStore
        .freePeoplesNations()
        .filter(nation => this.canRecruitReinforcements(nation, constraints))
        .reduce<WotrReinforcementUnit[]>(
          (acc, nation) => [...acc, ...this.validReinforcementUnits(nation, constraints)],
          []
        );
    } else {
      return this.nationStore
        .shadowNations()
        .filter(nation => this.canRecruitReinforcements(nation, constraints))
        .reduce<WotrReinforcementUnit[]>(
          (acc, nation) => [...acc, ...this.validReinforcementUnits(nation, constraints)],
          []
        );
    }
  }

  validReinforcementUnits(
    nation: WotrNation,
    constraints: WotrRecruitmentConstraints
  ): WotrReinforcementUnit[] {
    const units: WotrReinforcementUnit[] = [];
    if (this.nationStore.hasRegularReinforcements(nation)) {
      units.push({ front: nation.front, nation: nation.id, type: "regular" });
    }
    if (constraints.points >= 2 && this.nationStore.hasEliteReinforcements(nation)) {
      units.push({ front: nation.front, nation: nation.id, type: "elite" });
    }
    if (this.nationStore.hasLeaderReinforcements(nation)) {
      units.push({ front: nation.front, nation: nation.id, type: "leader" });
    }
    if (this.nationStore.hasNazgulReinforcements(nation)) {
      units.push({ front: nation.front, nation: nation.id, type: "nazgul" });
    }
    return units;
  }

  canRecruitReinforcements(nation: WotrNation, constraints: WotrRecruitmentConstraints): boolean {
    if (nation.politicalStep !== "atWar") {
      return false;
    }
    if (!this.nationStore.hasReinforcements(nation, constraints.points)) {
      return false;
    }
    return this.regionStore.hasRecruitmentSettlement(nation, constraints.exludedRegions);
  }

  canFrontMoveArmies(frontId: WotrFrontId): boolean {
    return this.regionStore.regions().some(region => {
      if (!region.army) return false;
      if (region.army.front !== frontId) return false;
      return this.canMoveArmy(region.army, region);
    });
  }

  canFrontMoveArmiesWithLeader(frontId: WotrFrontId): boolean {
    return this.regionStore.regions().some(region => {
      if (!region.army) return false;
      if (region.army.front !== frontId) return false;
      if (!this.hasArmyLeadership(region.army)) return false;
      return this.canMoveArmy(region.army, region);
    });
  }

  private hasArmyLeadership(army: WotrArmy): boolean {
    return this.getArmyLeadership(army) > 0;
  }

  getArmyLeadership(army: WotrArmy): number {
    let leadership = 0;
    if (army.elites) {
      leadership += this.getEliteUnitsLeadership(army.elites);
    }
    if (army.leaders) {
      leadership += this.getLeadersLeadership(army.leaders);
    }
    if (army.nNazgul) {
      leadership += this.getNazgulLeadership(army.nNazgul);
    }
    if (army.characters) {
      leadership += this.getCharactersLeadership(army.characters);
    }
    return leadership;
  }

  private getEliteUnitsLeadership(elites: WotrNationUnit[]) {
    return elites.reduce((l, armyUnit) => {
      if (armyUnit.nation === "isengard" && this.characterStore.isInPlay("saruman")) {
        return l + 1;
      }
      return l;
    }, 0);
  }

  private getLeadersLeadership(leaders: WotrNationUnit[]) {
    return leaders.length;
  }

  private getNazgulLeadership(nNazgul: number) {
    return nNazgul;
  }

  private getCharactersLeadership(characters: WotrCharacterId[]) {
    return characters.reduce((l, characterId) => {
      return l + this.characterStore.character(characterId).leadership;
    }, 0);
  }

  private canMoveArmy(army: WotrArmy, region: WotrRegion): boolean {
    const armyAtWar = this.isArmyAtWar(army);
    const armyUnitNations = this.armyUnitNations(army);
    return region.neighbors.some(neighbor => {
      if (neighbor.impassable) return false;
      if (!this.regionStore.isFreeForArmyMovement(neighbor.id, army.front)) return false;
      if (armyAtWar) return true;
      const neighborRegion = this.regionStore.region(neighbor.id);
      if (!neighborRegion.nationId) return true;
      return armyUnitNations.some(nation => nation === neighborRegion.nationId);
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

  canFrontAttackArmiesWithLeader(frontId: WotrFrontId): boolean {
    return this.regionStore.regions().some(region => {
      if (!region.army) return false;
      if (region.army.front !== frontId) return false;
      if (!this.hasArmyLeadership(region.army)) return false;
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

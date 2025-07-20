import { Injectable, inject } from "@angular/core";
import { WotrCharacterElimination } from "../character/wotr-character-actions";
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
import { WotrArmyUtils } from "./wotr-army.utils";
import {
  WotrArmyMovement,
  WotrEliteUnitDisband,
  WotrEliteUnitDowngrade,
  WotrEliteUnitElimination,
  WotrEliteUnitRecruitment,
  WotrLeaderElimination,
  WotrLeaderRecruitment,
  WotrNazgulElimination,
  WotrNazgulMovement,
  WotrNazgulRecruitment,
  WotrRegularUnitDisband,
  WotrRegularUnitElimination,
  WotrRegularUnitRecruitment,
  WotrUnitAction
} from "./wotr-unit-actions";
import {
  WotrArmy,
  WotrNationUnit,
  WotrRegionUnits,
  WotrReinforcementUnit,
  WotrUnits
} from "./wotr-unit.models";

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
  private armyUtil = inject(WotrArmyUtils);

  init() {
    this.actionService.registerActions(this.getActionAppliers() as any);
    this.actionService.registerActionLoggers(this.getActionLoggers() as any);
  }

  getActionAppliers(): WotrActionApplierMap<WotrUnitAction> {
    return {
      "army-movements": async (action, front) => {
        for (const movement of action.movements) {
          this.moveArmy(movement, front);
        }
      },
      "nazgul-movement": async (action, front) => {
        this.moveNazgul(action);
      },
      "regular-unit-recruitment": async (action, front) => this.recruitRegularUnit(action),
      "regular-unit-elimination": async (action, front) => this.eliminateRegularUnit(action),
      "regular-unit-upgrade": async (action, front) => {
        this.recruitEliteUnit({
          type: "elite-unit-recruitment",
          region: action.region,
          quantity: action.quantity,
          nation: action.nation
        });
        this.eliminateRegularUnit({
          type: "regular-unit-elimination",
          region: action.region,
          quantity: action.quantity,
          nation: action.nation
        });
      },
      "regular-unit-disband": async (action, front) => this.disbandRegularUnit(action),
      "elite-unit-recruitment": async (action, front) => this.recruitEliteUnit(action),
      "elite-unit-elimination": async (action, front) => this.eliminateEliteUnit(action),
      "elite-unit-downgrade": async (action, front) => {
        this.eliminateEliteUnit({
          type: "elite-unit-elimination",
          region: action.region,
          quantity: action.quantity,
          nation: action.nation
        });
        this.recruitRegularUnit({
          type: "regular-unit-recruitment",
          region: action.region,
          quantity: action.quantity,
          nation: action.nation
        });
      },
      "elite-unit-disband": async (action, front) => this.disbandEliteUnit(action),
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

  moveNazgul(action: WotrNazgulMovement) {
    const fromRegion = this.regionStore.region(action.fromRegion);
    this.removeNazgulFromRegion(action.nNazgul, fromRegion);
    const toRegion = this.regionStore.region(action.toRegion);
    this.addNazgulToRegion(action.nNazgul, toRegion);
  }

  moveArmy(movement: WotrArmyMovement, frontId: WotrFrontId) {
    this.regionStore.moveArmy(movement.fromRegion, movement.toRegion, movement.leftUnits);
    this.nationService.checkNationActivationByArmyMovement(movement.toRegion, frontId);
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

  eliminateEliteUnit(action: WotrEliteUnitElimination) {
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
  }

  disbandEliteUnit(action: WotrEliteUnitDisband) {
    const region = this.regionStore.region(action.region);
    this.removeElitesFromRegion(action.quantity, action.nation, region);
    this.nationStore.addElitesToReinforcements(action.quantity, action.nation);
  }

  recruitRegularUnit(action: WotrRegularUnitRecruitment) {
    const region = this.regionStore.region(action.region);
    this.nationStore.removeRegularsFromReinforcements(action.quantity, action.nation);
    this.addRegularsToRegion(action.quantity, action.nation, region);
  }

  eliminateRegularUnit(action: WotrRegularUnitElimination) {
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
  }

  disbandRegularUnit(action: WotrRegularUnitDisband) {
    const region = this.regionStore.region(action.region);
    this.removeRegularsFromRegion(action.quantity, action.nation, region);
    this.nationStore.addRegularsToReinforcements(action.quantity, action.nation);
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
      "regular-unit-upgrade": (action, front, f) => [
        f.player(front),
        " upgrades regular units in ",
        f.region(action.region)
      ],
      "regular-unit-disband": (action, front, f) => [
        f.player(front),
        " disbands regular units in ",
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
      "elite-unit-downgrade": (action, front, f) => [
        f.player(front),
        " downgrades elite units in ",
        f.region(action.region)
      ],
      "elite-unit-disband": (action, front, f) => [
        f.player(front),
        " disbands elite units in ",
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
        " removes Nazgul from ",
        f.region(action.region)
      ],
      "nazgul-recruitment": (action, front, f) => [
        f.player(front),
        " recruits Nazgul in ",
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

  async chooseCasualties(hitPoints: number, regionId: WotrRegionId, player: WotrPlayer) {
    const region = this.regionStore.region(regionId);
    const underSiege = region.underSiegeArmy?.front === player.frontId;
    const army = underSiege ? region.underSiegeArmy! : region.army!;
    return this.chooseFrontCasualties(player, hitPoints, army, regionId, underSiege);
  }

  async chooseFrontCasualties(
    player: WotrPlayer,
    nTotalHits: number | 0,
    army: WotrArmy,
    regionId: WotrRegionId,
    underSiege: boolean
  ) {
    if (!nTotalHits) return null;
    const nHits = this.armyUtil.nHits(army);
    if (nTotalHits < nHits) {
      const story = await player.chooseCasualties(nTotalHits);
      const actions = filterActions<
        WotrRegularUnitElimination | WotrEliteUnitElimination | WotrEliteUnitDowngrade
      >(story, "regular-unit-elimination", "elite-unit-elimination", "elite-unit-downgrade");
      return actions;
    } else {
      const story = await player.eliminateArmy();
      const actions = filterActions<
        | WotrRegularUnitElimination
        | WotrEliteUnitElimination
        | WotrLeaderElimination
        | WotrNazgulElimination
        | WotrCharacterElimination
      >(
        story,
        "regular-unit-elimination",
        "elite-unit-elimination",
        "leader-elimination",
        "nazgul-elimination",
        "character-elimination"
      );
      return actions;
    }
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
      units.push({ nation: nation.id, type: "regular" });
    }
    if (constraints.points >= 2 && this.nationStore.hasEliteReinforcements(nation)) {
      units.push({ nation: nation.id, type: "elite" });
    }
    if (this.nationStore.hasLeaderReinforcements(nation)) {
      units.push({ nation: nation.id, type: "leader" });
    }
    if (this.nationStore.hasNazgulReinforcements(nation)) {
      units.push({ nation: nation.id, type: "nazgul" });
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
    return this.regionStore.regions().some(region => this.canMoveArmyFromRegion(region, frontId));
  }

  armyMovementStartingRegions(frontId: WotrFrontId): WotrRegionId[] {
    return this.regionStore
      .regions()
      .filter(region => this.canMoveArmyFromRegion(region, frontId))
      .map(region => region.id);
  }

  armyWithLeaderMovementStartingRegions(frontId: WotrFrontId): WotrRegionId[] {
    return this.regionStore
      .regions()
      .filter(region => region.army && this.doesArmyHaveLeadership(region.army, true))
      .filter(region => this.canMoveArmyFromRegion(region, frontId))
      .map(region => region.id);
  }

  armyMovementTargetRegions(army: WotrRegionUnits, frontId: WotrFrontId): WotrRegionId[] {
    const region = this.regionStore.region(army.regionId);
    const neighbors = region.neighbors
      .filter(neighbor => !neighbor.impassable)
      .filter(neighbor => this.regionStore.isFreeForArmyMovement(neighbor.id, frontId));
    const notAtWarNations = this.armyUnitNations(army).filter(
      nation => !this.nationStore.isAtWar(nation)
    );
    return neighbors
      .filter(neighbor => {
        const neighborRegion = this.regionStore.region(neighbor.id);
        if (!neighborRegion.nationId) return true;
        if (notAtWarNations.length === 0) return true;
        if (notAtWarNations.length === 1) return neighborRegion.nationId === notAtWarNations[0];
        return false;
      })
      .map(neighbor => neighbor.id);
  }

  canMoveArmyFromRegion(region: WotrRegion, frontId: WotrFrontId): boolean {
    if (!region.army) return false;
    if (region.army.front !== frontId) return false;
    return this.canMoveArmy(region.army, region);
  }

  canFrontMoveArmiesWithLeader(frontId: WotrFrontId): boolean {
    return this.regionStore.regions().some(region => {
      if (!region.army) return false;
      if (region.army.front !== frontId) return false;
      if (!this.doesArmyHaveLeadership(region.army, true)) return false;
      return this.canMoveArmy(region.army, region);
    });
  }

  private doesArmyHaveLeadership(army: WotrArmy, moveable: boolean): boolean {
    return this.getArmyLeadership(army, moveable) > 0;
  }

  getArmyLeadership(army: WotrArmy, moveable: boolean): number {
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
      leadership += this.getCharactersLeadership(army.characters, moveable);
    }
    return leadership;
  }

  getArmyCombatStrength(army: WotrArmy): number {
    let combatStrength = 0;
    if (army.regulars) {
      combatStrength += army.regulars.reduce((cs, unit) => cs + unit.quantity, 0);
    }
    if (army.elites) {
      combatStrength += army.elites.reduce((cs, unit) => cs + unit.quantity, 0);
    }
    // TODO characters
    return combatStrength;
  }

  private getEliteUnitsLeadership(elites: WotrNationUnit[]) {
    return elites.reduce((l, armyUnit) => {
      if (armyUnit.nation === "isengard" && this.characterStore.isInPlay("saruman")) {
        return l + armyUnit.quantity;
      }
      return l;
    }, 0);
  }

  private getLeadersLeadership(leaders: WotrNationUnit[]) {
    return leaders.reduce((l, unit) => l + unit.quantity, 0);
  }

  private getNazgulLeadership(nNazgul: number) {
    return nNazgul;
  }

  private getCharactersLeadership(characters: WotrCharacterId[], moveable: boolean): number {
    return characters.reduce((l, characterId) => {
      const character = this.characterStore.character(characterId);
      const leadership = moveable && character.level === 0 ? 0 : character.leadership;
      return l + leadership;
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

  private armyUnitNations(army: WotrUnits): WotrNationId[] {
    const nations = new Set<WotrNationId>();
    army.regulars?.forEach(nation => nations.add(nation.nation));
    army.elites?.forEach(nation => nations.add(nation.nation));
    army.leaders?.forEach(nation => nations.add(nation.nation));
    return Array.from(nations);
  }
  private isArmyAtWar(army: WotrArmy): boolean {
    const nations = this.armyUnitNations(army);
    return nations.some(nation => this.nationStore.isAtWar(nation));
  }

  canFrontAttack(frontId: WotrFrontId): boolean {
    return this.regionStore
      .regions()
      .some(region => this.canFrontAttackFromRegion(region, frontId));
  }

  private canFrontAttackFromRegion(region: WotrRegion, frontId: WotrFrontId): boolean {
    if (region.army?.front === frontId) {
      return this.canArmyAttack(region.army, region);
    } else if (region.underSiegeArmy?.front === frontId) {
      return this.canArmyAttack(region.underSiegeArmy, region);
    }
    return false;
  }

  attackStartingRegions(frontId: WotrFrontId): WotrRegion[] {
    return this.regionStore
      .regions()
      .filter(region => this.canFrontAttackFromRegion(region, frontId));
  }

  attackWithLeadersStartingRegions(frontId: WotrFrontId): WotrRegion[] {
    return this.regionStore
      .regions()
      .filter(region => this.canFrontAttackWithLeadersFromRegion(region, frontId));
  }

  private canFrontAttackWithLeadersFromRegion(region: WotrRegion, frontId: WotrFrontId): boolean {
    if (region.army?.front === frontId) {
      if (!this.doesArmyHaveLeadership(region.army, false)) return false;
      return this.canArmyAttack(region.army, region);
    } else if (region.underSiegeArmy?.front === frontId) {
      if (!this.doesArmyHaveLeadership(region.underSiegeArmy, false)) return false;
      return this.canArmyAttack(region.underSiegeArmy, region);
    }
    return false;
  }

  attackTargetRegions(region: WotrRegion, frontId: WotrFrontId): WotrRegion[] {
    if (region.army?.front === frontId) {
      const regions: WotrRegion[] = [];
      if (region.underSiegeArmy) {
        regions.push(region);
      }
      for (const neighbor of region.neighbors) {
        if (neighbor.impassable) continue;
        const targetRegion = this.regionStore.region(neighbor.id);
        if (!targetRegion.army) continue;
        if (targetRegion.army.front === frontId) continue;
        regions.push(targetRegion);
      }
      return regions;
    } else if (region.underSiegeArmy?.front === frontId) {
      return [region];
    }
    throw new Error("Region does not have an army or under siege army for the given front.");
  }

  canFrontAttackWithLeader(frontId: WotrFrontId): boolean {
    return this.regionStore.regions().some(region => {
      if (!region.army) return false;
      if (region.army.front !== frontId) return false;
      if (!this.doesArmyHaveLeadership(region.army, false)) return false;
      return this.canArmyAttack(region.army, region);
    });
  }

  canArmyAttack(army: WotrArmy, region: WotrRegion): boolean {
    if (!this.isArmyAtWar(army)) return false;
    if (region.underSiegeArmy) return true;
    return region.neighbors.some(neighbor => {
      if (neighbor.impassable) return false;
      const neighborRegion = this.regionStore.region(neighbor.id);
      if (!neighborRegion.army) return false;
      if (neighborRegion.army.front === army.front) return false;
      return true;
    });
  }
}

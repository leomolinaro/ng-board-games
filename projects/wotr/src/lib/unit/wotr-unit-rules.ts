import { inject, Injectable } from "@angular/core";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrCharacterStore } from "../character/wotr-character-store";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrNation, WotrNationId } from "../nation/wotr-nation-models";
import { WotrNationStore } from "../nation/wotr-nation-store";
import { WotrRegion, WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrRecruitmentConstraints } from "./wotr-unit-handler";
import {
  WotrArmy,
  WotrNationUnit,
  WotrRegionUnits,
  WotrReinforcementUnit,
  WotrUnits
} from "./wotr-unit-models";
import { WotrUnitModifiers } from "./wotr-unit-modifiers";

@Injectable({ providedIn: "root" })
export class WotrUnitRules {
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);
  private characterStore = inject(WotrCharacterStore);
  private unitModifiers = inject(WotrUnitModifiers);

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
    if (this.nationStore.hasRegularReinforcements(nation.id)) {
      units.push({ nation: nation.id, type: "regular" });
    }
    if (constraints.points >= 2 && this.nationStore.hasEliteReinforcements(nation.id)) {
      units.push({ nation: nation.id, type: "elite" });
    }
    if (this.nationStore.hasLeaderReinforcements(nation.id)) {
      units.push({ nation: nation.id, type: "leader" });
    }
    if (this.nationStore.hasNazgulReinforcements(nation.id)) {
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
    if (army.leaders) {
      leadership += this.getLeadersLeadership(army.leaders);
    }
    if (army.nNazgul) {
      leadership += this.getNazgulLeadership(army.nNazgul);
    }
    if (army.characters) {
      leadership += this.getCharactersLeadership(army.characters, moveable);
    }
    leadership += this.unitModifiers.getLeadership(army);
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

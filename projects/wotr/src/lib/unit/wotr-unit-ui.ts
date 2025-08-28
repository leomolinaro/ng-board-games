import { inject, Injectable } from "@angular/core";
import { attack } from "../battle/wotr-battle-actions";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameUi, WotrUiChoice } from "../game/wotr-game-ui";
import { WotrNationStore } from "../nation/wotr-nation-store";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import {
  armyMovement,
  eliminateRegularUnit,
  moveArmies,
  recruitEliteUnit,
  recruitLeader,
  recruitNazgul,
  recruitRegularUnit,
  WotrArmyMovement,
  WotrNazgulMovement
} from "./wotr-unit-actions";
import { WotrRecruitmentConstraints, WotrUnitHandler } from "./wotr-unit-handler";
import { WotrArmy, WotrRegionUnits, WotrReinforcementUnit } from "./wotr-unit-models";
import { WotrUnitRules } from "./wotr-unit-rules";
import { WotrUnitUtils } from "./wotr-unit-utils";

@Injectable({ providedIn: "root" })
export class WotrUnitUi {
  private ui = inject(WotrGameUi);
  private unitRules = inject(WotrUnitRules);
  private unitUtils = inject(WotrUnitUtils);
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);
  private unitHandler = inject(WotrUnitHandler);

  async moveNazgulMinions(frontId: WotrFrontId): Promise<WotrNazgulMovement[]> {
    throw new Error("Method not implemented.");
  }

  async moveArmies(numberOfMoves: number, frontId: WotrFrontId): Promise<WotrArmyMovement[]> {
    let continueMoving = true;
    let doneMoves = 0;
    const movements: WotrArmyMovement[] = [];
    while (continueMoving) {
      const movement = await this.moveArmy(frontId);
      movements.push(movement);
      continueMoving = false;
      doneMoves++;
      if (doneMoves < numberOfMoves) {
        continueMoving = await this.ui.askConfirm(
          "Continue moving armies?",
          "Move another",
          "Stop moving"
        );
      }
    }
    return movements;
  }

  async moveArmy(frontId: WotrFrontId): Promise<WotrArmyMovement> {
    const candidateRegions = this.unitRules.armyMovementStartingRegions(frontId);
    const movingArmy = await this.ui.askRegionUnits("Select units to move", {
      regionIds: candidateRegions,
      type: "moveArmy",
      withLeaders: false,
      retroguard: null,
      required: true
    });
    return this.moveThisArmy(movingArmy, frontId);
  }

  async attack(frontId: WotrFrontId): Promise<WotrAction[]> {
    const attackingUnits = await this.askAttackingUnits(frontId, false);
    return this.attackWithArmy(attackingUnits, frontId);
  }

  private async askAttackingUnits(
    frontId: WotrFrontId,
    withLeaders: boolean
  ): Promise<WotrRegionUnits> {
    const candidateRegions = withLeaders
      ? this.unitRules.attackWithLeadersStartingRegions(frontId)
      : this.unitRules.attackStartingRegions(frontId);
    return this.ui.askRegionUnits("Select units to attack", {
      type: "attack",
      regionIds: candidateRegions.map(region => region.id),
      withLeaders,
      frontId
    });
  }

  private async attackWithArmy(
    attackingUnits: WotrRegionUnits,
    frontId: WotrFrontId
  ): Promise<WotrAction[]> {
    const fromRegion = this.regionStore.region(attackingUnits.regionId);
    const fromArmy =
      fromRegion.army?.front === frontId ? fromRegion.army : fromRegion.underSiegeArmy!;
    const retroguard = this.unitUtils.splitUnits(fromArmy, attackingUnits);
    const targetRegions = this.unitRules.attackTargetRegions(fromRegion, frontId);
    const toRegionId = await this.ui.askRegion(
      "Select region to attack",
      targetRegions.map(region => region.id)
    );
    return [attack(fromRegion.id, toRegionId, retroguard)];
  }

  async attackWithLeader(frontId: WotrFrontId): Promise<WotrAction[]> {
    const attackingUnits = await this.askAttackingUnits(frontId, true);
    return this.attackWithArmy(attackingUnits, frontId);
  }

  private async moveThisArmy(
    movingArmy: WotrRegionUnits,
    frontId: WotrFrontId
  ): Promise<WotrArmyMovement> {
    const fromRegion = this.regionStore.region(movingArmy.regionId);
    const toRegionId = await this.ui.askRegion(
      "Select region to move in",
      this.unitRules.armyMovementTargetRegions(movingArmy, frontId)
    );
    const leftUnits = this.unitUtils.splitUnits(fromRegion.army, movingArmy);
    const movement = armyMovement(movingArmy.regionId, toRegionId, leftUnits);
    this.unitHandler.moveArmy(movement, frontId);
    await this.checkStackingLimit(toRegionId, frontId);
    return movement;
  }

  async moveArmyWithLeader(frontId: WotrFrontId): Promise<WotrArmyMovement> {
    const candidateRegions = this.unitRules.armyWithLeaderMovementStartingRegions(frontId);
    const movingArmy = await this.ui.askRegionUnits("Select units to move", {
      regionIds: candidateRegions,
      type: "moveArmy",
      withLeaders: true,
      retroguard: null,
      required: true
    });
    return this.moveThisArmy(movingArmy, frontId);
  }

  async checkStackingLimit(regionId: WotrRegionId, frontId: WotrFrontId): Promise<WotrAction[]> {
    const region = this.regionStore.region(regionId);
    if (region.army?.front === frontId) {
      return this.checkArmyStackingLimit(region.army, regionId, 10, false);
    }
    if (region.underSiegeArmy?.front === frontId) {
      return this.checkArmyStackingLimit(region.underSiegeArmy, regionId, 5, true);
    }
    return [];
  }

  private async checkArmyStackingLimit(
    army: WotrArmy,
    regionId: WotrRegionId,
    stackingLimit: number,
    underSiege: boolean
  ): Promise<WotrAction[]> {
    const nArmyUnits = this.unitUtils.nArmyUnits(army);
    if (nArmyUnits <= stackingLimit) return [];
    const units = await this.ui.askRegionUnits("Choose a unit to remove", {
      regionIds: [regionId],
      type: "disband",
      nArmyUnits: nArmyUnits - stackingLimit,
      underSiege
    });
    const actions: WotrAction[] = [];
    units.regulars?.forEach(unit =>
      actions.push(eliminateRegularUnit(regionId, unit.nation, unit.quantity))
    );
    units.elites?.forEach(unit =>
      actions.push(eliminateRegularUnit(regionId, unit.nation, unit.quantity))
    );
    return actions;
  }

  async recrtuiUnits(frontId: WotrFrontId): Promise<WotrAction[]> {
    const actions: WotrAction[] = [];
    let points = 0;
    const exludedRegions = new Set<WotrRegionId>();
    let canPass = false;
    while (points < 2) {
      const constraints: WotrRecruitmentConstraints = {
        points: 2 - points,
        exludedRegions: exludedRegions
      };
      const validUnits = this.unitRules.validFrontReinforcementUnits(frontId, constraints);
      if (!validUnits.length) return actions;
      const unit = await this.ui.askReinforcementUnit("Choose a unit to recruit", {
        units: validUnits,
        frontId: frontId,
        canPass
      });
      if (unit === false) return actions;
      points += unit.type === "elite" ? 2 : 1;
      const nation = this.nationStore.nation(unit.nation);
      const validRegions = this.regionStore
        .recruitmentRegions(nation)
        .filter(r => !exludedRegions.has(r.id));
      const regionId = await this.ui.askRegion(
        "Choose a region to recruit in",
        validRegions.map(r => r.id)
      );
      exludedRegions.add(regionId);
      actions.push(this.recruitUnit(unit, regionId));
      actions.push(...(await this.checkStackingLimit(regionId, frontId)));
      canPass = true;
    }
    return actions;
  }

  recruitUnit(unit: WotrReinforcementUnit, regionId: WotrRegionId) {
    switch (unit.type) {
      case "regular": {
        const action = recruitRegularUnit(regionId, unit.nation, 1);
        this.unitHandler.recruitRegularUnit(action);
        return action;
      }
      case "elite": {
        const action = recruitEliteUnit(regionId, unit.nation, 1);
        this.unitHandler.recruitEliteUnit(action);
        return action;
      }
      case "leader": {
        const action = recruitLeader(regionId, unit.nation, 1);
        this.unitHandler.recruitLeader(action);
        return action;
      }
      case "nazgul": {
        const action = recruitNazgul(regionId, 1);
        this.unitHandler.recruitNazgul(action);
        return action;
      }
    }
  }

  attackArmyChoice: WotrUiChoice = {
    label: () => "Attack",
    isAvailable: (frontId: WotrFrontId) => this.unitRules.canFrontAttack(frontId),
    actions: async (frontId: WotrFrontId) => this.attack(frontId)
  };

  moveArmiesChoice: WotrUiChoice = {
    label: () => "Move armies",
    isAvailable: (frontId: WotrFrontId) => this.unitRules.canFrontMoveArmies(frontId),
    actions: async (frontId: WotrFrontId) => {
      const movements = await this.moveArmies(2, frontId);
      return [moveArmies(...movements)];
    }
  };

  recruitReinforcementsChoice: WotrUiChoice = {
    label: () => "Recruit reinforcements",
    isAvailable: (frontId: WotrFrontId) => this.unitRules.canFrontRecruitReinforcements(frontId),
    actions: async (frontId: WotrFrontId) => this.recrtuiUnits(frontId)
  };

  leaderArmyMoveChoice: WotrUiChoice = {
    label: () => "Move army with leader",
    isAvailable: (frontId: WotrFrontId) => this.unitRules.canFrontMoveArmiesWithLeader(frontId),
    actions: async (frontId: WotrFrontId) => {
      const movement = await this.moveArmyWithLeader(frontId);
      return [moveArmies(movement)];
    }
  };

  leaderArmyAttackChoice: WotrUiChoice = {
    label: () => "Attack with leader",
    isAvailable: (frontId: WotrFrontId) => this.unitRules.canFrontAttackWithLeader(frontId),
    actions: async (frontId: WotrFrontId) => this.attackWithLeader(frontId)
  };
}

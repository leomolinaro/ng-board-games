import { inject, Injectable } from "@angular/core";
import { attack } from "../battle/wotr-battle-actions";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameUiStore } from "../game/wotr-game-ui.store";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrArmyUtils } from "./wotr-army.utils";
import {
  armyMovement,
  eliminateRegularUnit,
  WotrArmyMovement,
  WotrNazgulMovement
} from "./wotr-unit-actions";
import { WotrArmy, WotrRegionUnits } from "./wotr-unit.models";
import { WotrUnitService } from "./wotr-unit.service";

@Injectable({ providedIn: "root" })
export class WotrUnitPlayerService {
  private ui = inject(WotrGameUiStore);
  private unitService = inject(WotrUnitService);
  private armyUtils = inject(WotrArmyUtils);
  private regionStore = inject(WotrRegionStore);

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
    const candidateRegions = this.unitService.armyMovementStartingRegions(frontId);
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
      ? this.unitService.attackWithLeadersStartingRegions(frontId)
      : this.unitService.attackStartingRegions(frontId);
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
    const retroguard = this.armyUtils.splitUnits(fromArmy, attackingUnits);
    const targetRegions = this.unitService.attackTargetRegions(fromRegion, frontId);
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
      this.unitService.armyMovementTargetRegions(movingArmy, frontId)
    );
    const leftUnits = this.armyUtils.splitUnits(fromRegion.army, movingArmy);
    const movement = armyMovement(movingArmy.regionId, toRegionId, leftUnits);
    this.unitService.moveArmy(movement, frontId);
    await this.checkStackingLimit(toRegionId, frontId);
    return movement;
  }

  async moveArmyWithLeader(frontId: WotrFrontId): Promise<WotrArmyMovement> {
    const candidateRegions = this.unitService.armyWithLeaderMovementStartingRegions(frontId);
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
    const nArmyUnits = this.armyUtils.nArmyUnits(army);
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
}

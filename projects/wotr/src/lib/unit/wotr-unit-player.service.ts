import { inject, Injectable } from "@angular/core";
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
import { WotrArmy } from "./wotr-unit.models";
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
      const candidateRegions = this.unitService.moveArmiesStartingRegions(frontId);
      const movingArmy = await this.ui.askRegionUnits("Select units to move", {
        regionIds: candidateRegions,
        underSiege: false
      });
      const fromRegion = this.regionStore.region(movingArmy.regionId);
      const toRegionId = await this.ui.askRegion(
        "Select region to move in",
        this.unitService.moveArmyTargetRegions(movingArmy, frontId)
      );
      const leftUnits = this.armyUtils.splitUnits(fromRegion.army, movingArmy);
      const movement = armyMovement(movingArmy.regionId, toRegionId, leftUnits);
      this.unitService.moveArmy(movement, frontId);
      await this.checkStackingLimit(toRegionId, frontId);
      movements.push(movement);
      continueMoving = false;
      doneMoves++;
      if (doneMoves < numberOfMoves) {
        continueMoving = await this.ui.askConfirm("Continue moving armies?");
      }
    }
    return movements;
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
      equalsNArmyUnits: nArmyUnits - stackingLimit,
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

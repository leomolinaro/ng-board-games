import { inject, Injectable } from '@angular/core';
import type {
  BritAreaId,
  BritColor,
  BritLandAreaId,
  BritNationId,
} from '../brit-components.models';
import { BritComponents } from '../brit-components.service';
import type { BritAreaUnit } from '../brit-game-state.models';
import { BritRulesService } from '../brit-rules/brit-rules.service';
import type {
  BritArmyMovement,
  BritArmyMovements,
  BritArmyPlacement,
  BritBattleInitiation,
} from '../brit-story.models';
import { BritGameStore } from './brit-game.store';
import type { BritPlayerService } from './brit-player.service';
import { BritUiStore } from './brit-ui.store';

@Injectable()
export class BritPlayerLocalService implements BritPlayerService {
  private game = inject(BritGameStore);
  private ui = inject(BritUiStore);
  private rules = inject(BritRulesService);
  private components = inject(BritComponents);

  async armyPlacement(
    nInfantries: number,
    nationId: BritNationId,
    playerId: BritColor,
  ): Promise<BritArmyPlacement> {
    const placement: BritArmyPlacement = {
      infantryPlacement: [],
    };
    for (let index = 0; index < nInfantries; index++) {
      const landAreaId = await this.chooseLandForPlacement(
        index + 1,
        nInfantries,
        nationId,
        playerId,
      );
      this.game.applyInfantryPlacement(landAreaId, nationId);
      const ipIndex = placement.infantryPlacement.findIndex(
        (ip) => (typeof ip === 'object' ? ip.areaId : ip) === landAreaId,
      );
      if (ipIndex === -1) {
        placement.infantryPlacement.push(landAreaId);
      } else {
        let ip = placement.infantryPlacement[ipIndex];
        ip = {
          areaId: landAreaId,
          quantity: typeof ip === 'object' ? ip.quantity + 1 : 2,
        };
        placement.infantryPlacement[ipIndex] = ip;
      }
    }
    return placement;
  }

  private chooseLandForPlacement(
    iInfantry: number,
    nTotInfantries: number,
    nationId: BritNationId,
    playerId: BritColor,
  ): Promise<BritLandAreaId> {
    const validLands = this.rules.populationIncrease.getValidLandsForPlacement(
      nationId,
      this.game,
    );
    this.ui.updateUi('Choose land for placement', (s) => ({
      ...s,
      ...this.ui.resetUi(),
      turnPlayer: playerId,
      message: `Choose a land area to place an infantry on (${iInfantry} / ${nTotInfantries}).`,
      validAreas: validLands,
      canCancel: iInfantry !== 1,
    }));
    return this.ui.landAreaChange.get();
  }

  async armyMovements(
    nationId: BritNationId,
    playerId: BritColor,
  ): Promise<BritArmyMovements> {
    const armyMovements: BritArmyMovements = { movements: [] };

    const movementOrPass = await this.armyMovement(
      nationId,
      playerId,
      armyMovements.movements,
    );
    if (movementOrPass !== 'pass') {
      armyMovements.movements.push(movementOrPass);
      this.game.applyArmyMovement(movementOrPass, true);
      await this.armyMovement(nationId, playerId, armyMovements.movements);
    }
    return armyMovements;
  }

  private async armyMovement(
    nationId: BritNationId,
    playerId: BritColor,
    movements: BritArmyMovement[],
  ): Promise<BritArmyMovement | 'pass'> {
    let unitsOrPass = await this.chooseUnitsForMovement(
      nationId,
      playerId,
      movements,
    );
    const armyMovementOrPass =
      unitsOrPass === 'pass'
        ? 'pass'
        : { units: unitsOrPass, toAreaId: undefined! };
    if (armyMovementOrPass === 'pass') return 'pass';
    if (armyMovementOrPass.toAreaId) return armyMovementOrPass;
    this.ui.updateUi('Units selected', (s) => ({
      ...s,
      selectedUnits: armyMovementOrPass.units,
    }));
    if (armyMovementOrPass.units.length > 0) {
      const unitsOrAreaId = await this.chooseUnitsOrAreaForMovement(
        nationId,
        playerId,
        armyMovementOrPass.units,
      );
      return typeof unitsOrAreaId === 'string'
        ? { ...armyMovementOrPass, toAreaId: unitsOrAreaId }
        : { ...armyMovementOrPass, units: unitsOrAreaId };
    }
    unitsOrPass = await this.chooseUnitsForMovement(
      nationId,
      playerId,
      movements,
    );
    return unitsOrPass === 'pass'
      ? 'pass'
      : { ...armyMovementOrPass, units: unitsOrPass };
  }

  private async chooseUnitsForMovement(
    nationId: BritNationId,
    playerId: BritColor,
    movements: BritArmyMovement[],
  ): Promise<BritAreaUnit[] | 'pass'> {
    const validUnits = this.rules.movement.getValidUnitsForMovement(
      nationId,
      this.game,
    );
    this.ui.updateUi('Select units for movement', (s) => ({
      ...s,
      ...this.ui.resetUi(),
      turnPlayer: playerId,
      message: 'Select one or more units to be moved.',
      validUnits: validUnits,
      selectedUnits: [],
      canCancel: movements.length > 0,
      canPass: true,
    }));
    return (
      (await Promise.race([
        this.ui.selectedUnitsChange.get(),
        this.ui.passChange.get(),
      ])) ?? 'pass'
    );
  }

  private async chooseUnitsOrAreaForMovement(
    nationId: BritNationId,
    playerId: BritColor,
    selectedUnits: BritAreaUnit[],
  ): Promise<BritAreaUnit[] | BritAreaId> {
    const areaId = selectedUnits[0].areaId;
    const validUnits = this.rules.movement.getValidUnitsByAreaForMovement(
      nationId,
      areaId,
      this.game,
    );
    const validAreas = this.rules.movement.getValidAreasForMovement(
      areaId,
      nationId,
      this.game,
    );
    this.ui.updateUi('Select area or units for movement', (s) => ({
      ...s,
      ...this.ui.resetUi(),
      turnPlayer: playerId,
      message:
        'Choose an area to move the selected units to, or select more units to be moved.',
      validUnits: validUnits,
      validAreas: validAreas,
      selectedUnits: selectedUnits,
      canCancel: true,
    }));
    return Promise.race([
      this.ui.selectedUnitsChange.get(),
      this.ui.areaChange.get(),
    ]);
  }

  async battleInitiation(playerId: BritColor): Promise<BritBattleInitiation> {
    const landId = await this.chooseLandForBattle(playerId);
    await this.confirmBattleInitiation(landId, playerId);
    return { landId };
  }

  private async chooseLandForBattle(
    playerId: BritColor,
  ): Promise<BritLandAreaId> {
    const validAreas = this.rules.battlesRetreats.getValidAreasForBattle(
      this.game,
    );
    this.ui.updateUi('Select area for battle', (s) => ({
      ...s,
      ...this.ui.resetUi(),
      turnPlayer: playerId,
      message: 'Choose an area to resolve the battle into.',
      validAreas: validAreas,
    }));
    return this.ui.landAreaChange.get();
  }

  private async confirmBattleInitiation(
    landId: BritLandAreaId,
    playerId: BritColor,
  ): Promise<void> {
    this.ui.updateUi('Confirm battle initiation', (s) => ({
      ...s,
      ...this.ui.resetUi(),
      turnPlayer: playerId,
      message: `Confirm to initiate the battle in ${this.components.AREA[landId].name}.`,
      validAreas: [landId],
      canConfirm: true,
      canCancel: true,
    }));
    return this.ui.confirmChange.get();
  }
}

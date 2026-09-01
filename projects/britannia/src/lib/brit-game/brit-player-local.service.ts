import { Injectable, inject } from '@angular/core';
import { forN } from '@leobg/commons/utils';
import type { Observable } from 'rxjs';
import { EMPTY, expand, last, map, mapTo, race, switchMap } from 'rxjs';
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

  armyPlacement$(
    nInfantries: number,
    nationId: BritNationId,
    playerId: BritColor,
  ): Observable<BritArmyPlacement> {
    const placement: BritArmyPlacement = {
      infantryPlacement: [],
    };
    return forN(nInfantries, (index) => {
      return this.chooseLandForPlacement$(
        index + 1,
        nInfantries,
        nationId,
        playerId,
      ).pipe(
        map((landAreaId) => {
          this.game.applyInfantryPlacement(landAreaId, nationId);
          const ipIndex = placement.infantryPlacement.findIndex(
            (ip) => (typeof ip === 'object' ? ip.areaId : ip) === landAreaId,
          );
          if (ipIndex >= 0) {
            let ip = placement.infantryPlacement[ipIndex];
            ip = {
              areaId: landAreaId,
              quantity: typeof ip === 'object' ? ip.quantity + 1 : 2,
            };
            placement.infantryPlacement[ipIndex] = ip;
          } else {
            placement.infantryPlacement.push(landAreaId);
          }
          return void 0;
        }),
      );
    }).pipe(mapTo(placement));
  }

  private chooseLandForPlacement$(
    iInfantry: number,
    nTotInfantries: number,
    nationId: BritNationId,
    playerId: BritColor,
  ): Observable<BritLandAreaId> {
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
    return this.ui.areaChange$<BritLandAreaId>();
  }

  armyMovements$(
    nationId: BritNationId,
    playerId: BritColor,
  ): Observable<BritArmyMovements> {
    const armyMovements: BritArmyMovements = { movements: [] };
    return this.armyMovement$(nationId, playerId, armyMovements.movements).pipe(
      expand<BritArmyMovement | 'pass', Observable<BritArmyMovement | 'pass'>>(
        (movementOrPass) => {
          if (movementOrPass === 'pass') {
            return EMPTY;
          } else {
            armyMovements.movements.push(movementOrPass);
            this.game.applyArmyMovement(movementOrPass, true);
            return this.armyMovement$(
              nationId,
              playerId,
              armyMovements.movements,
            );
          }
        },
      ),
      last(),
      mapTo(armyMovements),
    );
  }

  private armyMovement$(
    nationId: BritNationId,
    playerId: BritColor,
    movements: BritArmyMovement[],
  ): Observable<BritArmyMovement | 'pass'> {
    return this.chooseUnitsForMovement$(nationId, playerId, movements).pipe(
      map((unitsOrPass) =>
        unitsOrPass === 'pass'
          ? 'pass'
          : { units: unitsOrPass, toAreaId: null! },
      ),
      expand<BritArmyMovement | 'pass', Observable<BritArmyMovement | 'pass'>>(
        (armyMovementOrPass) => {
          if (armyMovementOrPass === 'pass') {
            return EMPTY;
          } else if (armyMovementOrPass.toAreaId) {
            return EMPTY;
          } else {
            this.ui.updateUi('Units selected', (s) => ({
              ...s,
              selectedUnits: armyMovementOrPass.units,
            }));
            if (armyMovementOrPass.units.length) {
              return this.chooseUnitsOrAreaForMovement$(
                nationId,
                playerId,
                armyMovementOrPass.units,
              ).pipe(
                map((unitsOrAreaId) => {
                  if (typeof unitsOrAreaId === 'string') {
                    return { ...armyMovementOrPass, toAreaId: unitsOrAreaId };
                  } else {
                    return { ...armyMovementOrPass, units: unitsOrAreaId };
                  }
                }),
              );
            } else {
              return this.chooseUnitsForMovement$(
                nationId,
                playerId,
                movements,
              ).pipe(
                map((unitsOrPass) =>
                  unitsOrPass === 'pass'
                    ? 'pass'
                    : { ...armyMovementOrPass, units: unitsOrPass },
                ),
              );
            }
          }
        },
      ),
      last(),
    );
  }

  private chooseUnitsForMovement$(
    nationId: BritNationId,
    playerId: BritColor,
    movements: BritArmyMovement[],
  ): Observable<BritAreaUnit[] | 'pass'> {
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
      canCancel: !!movements.length,
      canPass: true,
    }));
    return race<[BritAreaUnit[], 'pass']>(
      this.ui.selectedUnitsChange$(),
      this.ui.passChange$().pipe(mapTo('pass')),
    );
  }

  private chooseUnitsOrAreaForMovement$(
    nationId: BritNationId,
    playerId: BritColor,
    selectedUnits: BritAreaUnit[],
  ): Observable<BritAreaUnit[] | BritAreaId> {
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
    return race(this.ui.selectedUnitsChange$(), this.ui.areaChange$());
  }

  battleInitiation$(
    nationId: BritNationId,
    playerId: BritColor,
  ): Observable<BritBattleInitiation> {
    return this.chooseLandForBattle$(nationId, playerId).pipe(
      switchMap((landId) => {
        return this.confirmBattleInitiation$(landId, playerId).pipe(
          map(() => ({ landId })),
        );
      }),
    );
  }

  private chooseLandForBattle$(
    nationId: BritNationId,
    playerId: BritColor,
  ): Observable<BritLandAreaId> {
    const validAreas = this.rules.battlesRetreats.getValidAreasForBattle(
      nationId,
      this.game,
    );
    this.ui.updateUi('Select area for battle', (s) => ({
      ...s,
      ...this.ui.resetUi(),
      turnPlayer: playerId,
      message: 'Choose an area to resolve the battle into.',
      validAreas: validAreas,
    }));
    return this.ui.areaChange$<BritLandAreaId>();
  }

  private confirmBattleInitiation$(
    landId: BritLandAreaId,
    playerId: BritColor,
  ): Observable<void> {
    this.ui.updateUi('Confirm battle initiation', (s) => ({
      ...s,
      ...this.ui.resetUi(),
      turnPlayer: playerId,
      message: `Confirm to initiate the battle in ${this.components.AREA[landId].name}.`,
      validAreas: [landId],
      canConfirm: true,
      canCancel: true,
    }));
    return this.ui.confirmChange$();
  }
}

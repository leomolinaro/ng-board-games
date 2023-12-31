import { Injectable } from '@angular/core';
import { BritAreaId, BritNationId } from '../brit-components.models';
import { BritComponentsService } from '../brit-components.service';
import { BritAreaUnit, BritGameState } from '../brit-game-state.models';

// interface BritMovingGroup {
//   areaUnit: BritAreaUnit[];
//   movements: number;
// }

@Injectable({
  providedIn: 'root',
})
export class BritRulesMovementService {
  constructor(private components: BritComponentsService) {}

  getValidUnitsForMovement(
    nationId: BritNationId,
    state: BritGameState
  ): BritAreaUnit[] {
    const units: BritAreaUnit[] = [];
    this.components.AREA_IDS.forEach((areaId) => {
      const areaUnits = this.getValidUnitsByNationByArea(
        areaId,
        nationId,
        state
      );
      units.push(...areaUnits);
    });
    return units;
  } // getValidUnitsForMovement

  getValidUnitsByAreaForMovement(
    nationId: BritNationId,
    areaId: BritAreaId,
    state: BritGameState
  ): BritAreaUnit[] {
    return this.getValidUnitsByNationByArea(areaId, nationId, state);
  } // getValidUnitsByAreaForMovement

  private getValidUnitsByNationByArea(
    areaId: BritAreaId,
    nationId: BritNationId,
    state: BritGameState
  ): BritAreaUnit[] {
    const areaState = state.areas[areaId];
    const areaUnits = areaState.units.filter((u) => u.nationId === nationId);
    const area = this.components.AREA[areaId];
    const validUnits: BritAreaUnit[] = [];
    for (const areaUnit of areaUnits) {
      if (
        areaUnit.nMovements > 0 &&
        area.type === 'land' &&
        area.difficultTerrain
      ) {
        continue;
      }
      // TODO molte regole...

      if (areaUnit.type === 'cavalry' || areaUnit.nationId === 'romans') {
        if (areaUnit.nMovements < 3) {
          validUnits.push(areaUnit);
        }
      } else if (areaUnit.type === 'infantry') {
        if (areaUnit.nMovements < 2) {
          validUnits.push(areaUnit);
        }
      } else if (areaUnit.type === 'leader') {
      } // if - else
    } // for
    return validUnits;
  } // getValidAreaUnitsByNationByArea

  getValidAreasForMovement(
    areaId: BritAreaId,
    nationId: BritNationId,
    state: BritGameState
  ): BritAreaId[] {
    const validAreas: BritAreaId[] = [];
    const area = this.components.getArea(areaId);
    area.neighbors.forEach((n) => {
      const { id: neiAreaId, strait } =
        typeof n === 'object' ? n : { id: n, strait: false };
      const neiArea = this.components.getArea(neiAreaId);
      if (neiArea.type === 'land') {
        validAreas.push(neiAreaId);
      } // if
    });
    return validAreas;
  } // getValidAreasForMovement
} // BritRulesMovementService

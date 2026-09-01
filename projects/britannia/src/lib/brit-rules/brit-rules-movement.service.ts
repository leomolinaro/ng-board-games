import { Injectable, inject } from '@angular/core';
import type { BritAreaId, BritNationId } from '../brit-components.models';
import { BritComponents } from '../brit-components.service';
import type { BritAreaUnit } from '../brit-game-state.models';
import type { BritGameStore } from '../brit-game/brit-game.store';

@Injectable({
  providedIn: 'root',
})
export class BritRulesMovementService {
  private components = inject(BritComponents);

  getValidUnitsForMovement(
    nationId: BritNationId,
    game: BritGameStore,
  ): BritAreaUnit[] {
    const units: BritAreaUnit[] = [];
    this.components.AREA_IDS.forEach((areaId) => {
      const areaUnits = this.getValidUnitsByNationByArea(
        areaId,
        nationId,
        game,
      );
      units.push(...areaUnits);
    });
    return units;
  }

  getValidUnitsByAreaForMovement(
    nationId: BritNationId,
    areaId: BritAreaId,
    game: BritGameStore,
  ): BritAreaUnit[] {
    return this.getValidUnitsByNationByArea(areaId, nationId, game);
  }

  private getValidUnitsByNationByArea(
    areaId: BritAreaId,
    nationId: BritNationId,
    game: BritGameStore,
  ): BritAreaUnit[] {
    const areaState = game.getArea(areaId);
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
      }
    }
    return validUnits;
  }

  getValidAreasForMovement(
    areaId: BritAreaId,
    _nationId: BritNationId,
    _game: BritGameStore,
  ): BritAreaId[] {
    const validAreas: BritAreaId[] = [];
    const area = this.components.getArea(areaId);
    area.neighbors.forEach((n) => {
      const { id: neiAreaId, strait } =
        typeof n === 'object' ? n : { id: n, strait: false };
      const neiArea = this.components.getArea(neiAreaId);
      if (neiArea.type === 'land') {
        validAreas.push(neiAreaId);
      }
    });
    return validAreas;
  }
}

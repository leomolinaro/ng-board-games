import { Injectable } from '@angular/core';
import { BritAreaId, BritNationId } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritAreaUnit, BritGameState } from "../brit-game-state.models";

@Injectable({
  providedIn: 'root'
})
export class BritRulesMovementService {

  constructor (
    private components: BritComponentsService
  ) { }

  getValidUnitsForMovement (nationId: BritNationId, state: BritGameState): BritAreaUnit[] {
    return this.getPlacedMovingUnitsByNation (nationId, state);
  } // getValidUnitsForMovement

  getValidUnitsByAreaForMovement (nationId: BritNationId, areaId: BritAreaId, state: BritGameState): BritAreaUnit[] {
    return this.getPlacedMovingUnitsByNationByArea (areaId, nationId, state);
  } // getValidUnitsByAreaForMovement

  getValidAreasForMovement (areaId: BritAreaId, nationId: BritNationId, state: BritGameState): BritAreaId[] {
    const validAreas: BritAreaId[] = [];
    const area = this.components.getArea (areaId);
    area.neighbors.forEach (n => {
      const { id: neiAreaId, strait } = typeof n === "object" ? n : { id: n, strait: false };
      const neiArea = this.components.getArea (neiAreaId);
      if (neiArea.type === "land") {
        validAreas.push (neiAreaId);
      } // if
    });
    return validAreas;
  } // getValidAreasForMovement

  private getPlacedMovingUnitsByNation (nationId: BritNationId, state: BritGameState): BritAreaUnit[] {
    const units: BritAreaUnit[] = [];
    this.components.AREA_IDS.forEach (areaId => {
      const areaState = state.areas[areaId];
      areaState.units.forEach (unit => {
        if (unit.nationId !== nationId) { return; }
        if (unit.type === "infantry" || unit.type === "cavalry" || unit.type === "leader") {
          units.push (unit);
        } // if
      });
    });
    return units;
  } // getPlacedMovingUnitsByNation

  private getPlacedMovingUnitsByNationByArea (areaId: BritAreaId, nationId: BritNationId, state: BritGameState): BritAreaUnit[] {
    const units: BritAreaUnit[] = [];
    const areaState = state.areas[areaId];
    areaState.units.forEach (unit => {
      if (unit.nationId !== nationId) { return; }
      if (unit.type === "infantry" || unit.type === "cavalry" || unit.type === "leader") {
        units.push (unit);
      } // if
    });
    return units;
  } // getPlacedMovingUnitsByNationByArea

} // BritRulesMovementService

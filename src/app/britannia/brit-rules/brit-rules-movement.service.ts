import { Injectable } from '@angular/core';
import { BritAreaId, BritNationId, BritUnitId } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritGameState } from "../brit-game-state.models";

@Injectable({
  providedIn: 'root'
})
export class BritRulesMovementService {

  constructor (
    private components: BritComponentsService
  ) { }

  getValidUnitsForMovement (nationId: BritNationId, state: BritGameState): BritUnitId[] {
    return this.getPlacedMovingUnitsByNation (nationId, state);
  } // getValidUnitsForMovement

  getValidUnitsByAreaForMovement (nationId: BritNationId, areaId: BritAreaId, state: BritGameState): BritUnitId[] {
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

  private getPlacedMovingUnitsByNation (nationId: BritNationId, state: BritGameState): BritUnitId[] {
    const unitIds: BritUnitId[] = [];
    this.components.AREA_IDS.forEach (areaId => {
      const areaState = state.areas[areaId];
      areaState.unitIds.forEach (unitId => {
        const unit = this.components.getUnit (unitId);
        if (unit.nationId !== nationId) { return; }
        if ( unit.type === "infantry" || unit.type === "cavalry" || unit.type === "leader") {
          unitIds.push (unitId);
        } // if
      });
    });
    return unitIds;
  } // getPlacedMovingUnitsByNation

  private getPlacedMovingUnitsByNationByArea (areaId: BritAreaId, nationId: BritNationId, state: BritGameState): BritUnitId[] {
    const unitIds: BritUnitId[] = [];
    const areaState = state.areas[areaId];
    areaState.unitIds.forEach (unitId => {
      const unit = this.components.getUnit (unitId);
      if (unit.nationId !== nationId) { return; }
      if (unit.type === "infantry" || unit.type === "cavalry" || unit.type === "leader") {
        unitIds.push (unitId);
      } // if
    });
    return unitIds;
  } // getPlacedMovingUnitsByNationByArea

  getAreaByUnit (unitId: BritUnitId, state: BritGameState): BritAreaId | undefined {
    return this.components.AREA_IDS.find (areaId => {
      const areaState = state.areas[areaId];
      return areaState.unitIds.includes (unitId);
    });
  } // getAreaByUnit
  
} // BritRulesMovementService

import { Injectable } from '@angular/core';
import { BritAreaId, BritNationId } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritAreaUnit, BritGameState } from "../brit-game-state.models";
import { BritArmyMovement } from "../brit-story.models";

// interface BritMovingGroup {
//   areaUnit: BritAreaUnit[];
//   movements: number;
// }

@Injectable({
  providedIn: 'root'
})
export class BritRulesMovementService {

  constructor (
    private components: BritComponentsService
  ) { }

  getValidUnitsForMovement (nationId: BritNationId, movements: BritArmyMovement[], state: BritGameState): BritAreaUnit[] {
    const areaUnits = this.getMovableAreaUnitsByNation (nationId, state);
    // const movementsByTargetArea = arrayUtil.group (movements, m => m.toAreaId);
    const validAreaUnits: BritAreaUnit[] = [];
    for (const areaUnit of areaUnits) {
    //   const movementsToArea = movementsByTargetArea[areaUnit.areaId];
    //   if (areaMovements) {
    //     areaMovements.find (m => m.)
    //   } else {
        validAreaUnits.push (areaUnit);
    //   } // if - else
    } // for
    return validAreaUnits;
  } // getValidUnitsForMovement

  getValidUnitsByAreaForMovement (nationId: BritNationId, areaId: BritAreaId, state: BritGameState): BritAreaUnit[] {
    return this.getMovableAreaUnitsByNationByArea (areaId, nationId, state);
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

  private getMovableAreaUnitsByNation (nationId: BritNationId, state: BritGameState): BritAreaUnit[] {
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
  } // getMovableAreaUnitsByNation

  private getMovableAreaUnitsByNationByArea (areaId: BritAreaId, nationId: BritNationId, state: BritGameState): BritAreaUnit[] {
    const units: BritAreaUnit[] = [];
    const areaState = state.areas[areaId];
    areaState.units.forEach (unit => {
      if (unit.nationId !== nationId) { return; }
      if (unit.type === "infantry" || unit.type === "cavalry" || unit.type === "leader") {
        units.push (unit);
      } // if
    });
    return units;
  } // getMovableAreaUnitsByNationByArea

} // BritRulesMovementService

import { Injectable } from '@angular/core';
import { BritLandAreaId, BritNationId } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritGameState } from "../brit-game-state.models";

@Injectable({
  providedIn: 'root'
})
export class BritRulesBattlesRetreatsService {

  constructor (
    private components: BritComponentsService
  ) { }

  hasBattlesToResolve (nationId: BritNationId, state: BritGameState) {
    for (const landId of this.components.LAND_AREA_IDS) {
      if (this.isBattleArea (landId, state)) { return true; }
    } // for
    return false;
  } // hasBattlesToResolve

  private isBattleArea (landId: BritLandAreaId, state: BritGameState) {
    const areaState = state.areas[landId];
    let nationId: BritNationId | null = null;
    for (const unit of areaState.units) {
      if (nationId) {
        if (unit.nationId !== nationId) { return true; }
      } else {
        nationId = unit.nationId;
      } // if - else
    } // for
    return false;
  } // isBattleArea

  getValidAreasForBattle (nationId: BritNationId, state: BritGameState) {
    const validAreas: BritLandAreaId[] = [];
    for (const landId of this.components.LAND_AREA_IDS) {
      if (this.isBattleArea (landId, state)) { validAreas.push (landId); }
    } // for
    return validAreas;
  } // getValidAreasForBattle

} // BritRulesBattlesRetreatsService

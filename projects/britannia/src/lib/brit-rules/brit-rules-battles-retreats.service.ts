import { Injectable, inject } from '@angular/core';
import type { BritLandAreaId, BritNationId } from '../brit-components.models';
import { BritComponents } from '../brit-components.service';
import { BritGameStore } from '../brit-game/brit-game.store';

@Injectable({
  providedIn: 'root',
})
export class BritRulesBattlesRetreatsService {
  private components = inject(BritComponents);

  hasBattlesToResolve(nationId: BritNationId, game: BritGameStore) {
    for (const landId of this.components.LAND_AREA_IDS) {
      if (this.isBattleArea(landId, game)) {
        return true;
      }
    }
    return false;
  }

  private isBattleArea(landId: BritLandAreaId, game: BritGameStore) {
    const areaState = game.getArea(landId);
    let nationId: BritNationId | null = null;
    for (const unit of areaState.units) {
      if (nationId) {
        if (unit.nationId !== nationId) {
          return true;
        }
      } else {
        nationId = unit.nationId;
      }
    }
    return false;
  }

  getValidAreasForBattle(nationId: BritNationId, game: BritGameStore) {
    const validAreas: BritLandAreaId[] = [];
    for (const landId of this.components.LAND_AREA_IDS) {
      if (this.isBattleArea(landId, game)) {
        validAreas.push(landId);
      }
    }
    return validAreas;
  }
}

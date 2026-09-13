import { Injectable, inject } from '@angular/core';
import type {
  BritArea,
  BritAreaId,
  BritLandArea,
  BritLandAreaId,
  BritNationId,
  BritPopulation,
  BritRoundId,
} from '../brit-components.models';
import { BritComponents } from '../brit-components.service';
import type { BritGameStore } from '../brit-game/brit-game.store';

export interface BritPopulationIncreaseData {
  nInfantries: number;
  type: 'infantry-placement' | 'roman-reinforcements';
  populationMarker: BritPopulation | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class BritRulesPopulationIncreaseService {
  private components = inject(BritComponents);

  private NON_DIFFICULT_TERRAIN_STACKING_LIMIT = 3;
  private DIFFICULT_TERRAIN_STACKING_LIMIT = 2;
  private DIFFICULT_TERRAIN_OVERSTACKING_LIMIT = 4;
  private ROMAN_REINFORCEMENTS_12_plus = [0, 0, 0, 0];
  private ROMAN_REINFORCEMENTS_11 = [1, 0, 0, 0];
  private ROMAN_REINFORCEMENTS_10 = [1, 1, 0, 0];
  private ROMAN_REINFORCEMENTS_9 = [1, 1, 1, 0];
  private ROMAN_REINFORCEMENTS_7_8 = [2, 2, 1, 1];
  private ROMAN_REINFORCEMENTS_6 = [3, 3, 2, 2];
  private ROMAN_REINFORCEMENTS_5 = [3, 3, 3, 3];
  private ROMAN_REINFORCEMENTS_4 = [4, 4, 3, 3];

  isNationActive(nationId: BritNationId, game: BritGameStore): boolean {
    return game.getNation(nationId).active;
  }

  getValidLandsForPlacement(
    nationId: BritNationId,
    game: BritGameStore,
  ): BritLandAreaId[] {
    if (nationId === 'romans') {
      return [];
    }
    const validLands: BritLandAreaId[] = [];
    const fullLands: BritLandAreaId[] = [];
    let overstackedLand: BritLandArea | undefined;
    let overstackedArmiesCount: number | undefined;
    const lands = this.getOccupiedLandsByNation(nationId, game);
    for (const land of lands) {
      const nArmies = this.getNPlacedArmiesByArea(land.id, game);
      if (land.difficultTerrain) {
        if (nArmies < this.DIFFICULT_TERRAIN_STACKING_LIMIT) {
          validLands.push(land.id);
        } else if (nArmies === this.DIFFICULT_TERRAIN_STACKING_LIMIT) {
          fullLands.push(land.id);
        } else {
          overstackedLand = land;
          overstackedArmiesCount = nArmies;
        }
      } else {
        if (nArmies < this.NON_DIFFICULT_TERRAIN_STACKING_LIMIT) {
          validLands.push(land.id);
        } else if (nArmies === this.NON_DIFFICULT_TERRAIN_STACKING_LIMIT) {
          fullLands.push(land.id);
        } else {
          overstackedLand = land;
          overstackedArmiesCount = nArmies;
        }
      }
    }
    if (overstackedLand) {
      if (
        !overstackedLand.difficultTerrain ||
        overstackedArmiesCount! < this.DIFFICULT_TERRAIN_OVERSTACKING_LIMIT
      ) {
        validLands.push(overstackedLand.id);
      }
    } else {
      for (const l of fullLands) validLands.push(l);
    }
    return validLands;
  }

  calculatePopulationIncreaseData(
    nationId: BritNationId,
    roundId: BritRoundId,
    game: BritGameStore,
  ): BritPopulationIncreaseData {
    if (nationId === 'romans') {
      const nArmies = this.getNPlacedArmiesByNation('romans', game);
      return {
        nInfantries: this.getRomanReinforcements(nArmies, roundId),
        type: 'roman-reinforcements',
        populationMarker: undefined,
      };
    }
    const lands = this.getOccupiedLandsByNation(nationId, game);
    const nation = game.getNation(nationId);
    let populationPoints = nation.population ?? 0;
    let onlyDifficultTerrains = true;
    for (const land of lands) {
      if (land.difficultTerrain) {
        populationPoints += 1;
      } else {
        populationPoints += 2;
        onlyDifficultTerrains = false;
      }
    }
    let nInfantries = Math.floor(populationPoints / 6);
    let populationMarker = (populationPoints % 6) as BritPopulation;
    // Check armies limit.
    if (nInfantries > nation.nInfantries) {
      nInfantries = nation.nInfantries;
      populationMarker = 5;
    }
    // Check the stacking limits. The only limiting case is when there are only difficult terrains.
    if (onlyDifficultTerrains) {
      let availableSlots = 0;
      let overstackedArmiesCount: number | undefined;
      for (const land of lands) {
        const nArmies = this.getNPlacedArmiesByArea(land.id, game);
        if (nArmies <= this.DIFFICULT_TERRAIN_STACKING_LIMIT) {
          availableSlots += this.DIFFICULT_TERRAIN_STACKING_LIMIT - nArmies;
        } else {
          overstackedArmiesCount = nArmies;
        }
      }
      availableSlots += overstackedArmiesCount
        ? this.DIFFICULT_TERRAIN_OVERSTACKING_LIMIT - overstackedArmiesCount
        : this.DIFFICULT_TERRAIN_OVERSTACKING_LIMIT -
          this.DIFFICULT_TERRAIN_STACKING_LIMIT;
      if (nInfantries > availableSlots) {
        nInfantries = availableSlots;
        populationMarker = 5;
      }
    }
    return {
      nInfantries,
      type: 'infantry-placement',
      populationMarker,
    };
  }

  hasPopulationMarker(nationId: BritNationId): boolean {
    return nationId !== 'romans';
  }

  private getRomanReinforcements(
    nArmies: number,
    roundId: BritRoundId,
  ): number {
    if (roundId < 2 || roundId > 5) {
      return 0;
    }
    const index = roundId - 2;
    switch (nArmies) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
        return this.ROMAN_REINFORCEMENTS_4[index];
      case 5:
        return this.ROMAN_REINFORCEMENTS_5[index];
      case 6:
        return this.ROMAN_REINFORCEMENTS_6[index];
      case 7:
      case 8:
        return this.ROMAN_REINFORCEMENTS_7_8[index];
      case 9:
        return this.ROMAN_REINFORCEMENTS_9[index];
      case 10:
        return this.ROMAN_REINFORCEMENTS_10[index];
      case 11:
        return this.ROMAN_REINFORCEMENTS_11[index];
      default:
        return this.ROMAN_REINFORCEMENTS_12_plus[index];
    }
  }

  private getNPlacedArmiesByArea(
    areaId: BritAreaId,
    game: BritGameStore,
  ): number {
    let armiesCount = 0;
    for (const unit of game.getArea(areaId).units) {
      // const unit = this.components.UNIT[unitId];
      if (unit.type === 'infantry' || unit.type === 'cavalry') {
        armiesCount += unit.quantity;
      }
    }
    return armiesCount;
  }

  private getNPlacedArmiesByNation(
    nationId: BritNationId,
    game: BritGameStore,
  ): number {
    let counter = 0;
    for (const area of this.getOccupiedAreasByNation(nationId, game)) {
      counter += this.getNPlacedArmiesByArea(area.id, game);
    }
    return counter;
  }

  private getOccupiedLandsByNation(
    nationId: BritNationId,
    game: BritGameStore,
  ): BritLandArea[] {
    const lands: BritLandArea[] = [];
    for (const landId of this.components.LAND_AREA_IDS) {
      const landState = game.getArea(landId);
      if (landState.units.some((u) => u.nationId === nationId)) {
        lands.push(this.components.getLandArea(landId));
      }
    }
    return lands;
  }

  private getOccupiedAreasByNation(
    nationId: BritNationId,
    game: BritGameStore,
  ): BritArea[] {
    const areas: BritArea[] = [];
    for (const areaId of this.components.AREA_IDS) {
      const areaState = game.getArea(areaId);
      if (areaState.units.some((u) => u.nationId === nationId)) {
        areas.push(this.components.getArea(areaId));
      }
    }
    return areas;
  }
}

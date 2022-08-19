import { Injectable } from '@angular/core';
import { BritLandArea, BritLandAreaId, BritNationId, BritPopulation, BritUnit } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritGameState } from "../brit-game-state.models";

export interface BritPopulationIncreaseData {
  nInfantries: number;
  populationMarker: BritPopulation | null;
} // BritPopulationIncreaseData

const NON_DIFFICULT_TERRAIN_STACKING_LIMIT = 3;
const DIFFICULT_TERRAIN_STACKING_LIMIT = 2;
const DIFFICULT_TERRAIN_OVERSTACKING_LIMIT = 4;

@Injectable({
  providedIn: 'root'
})
export class BritRulesPopulationIncreaseService {

  constructor (
    private components: BritComponentsService
  ) { }
  
  isNationActive (nationId: BritNationId, state: BritGameState): boolean {
    return state.nations[nationId].active;
  } // isNationActive
  
  getValidLandsForPlacement (nationId: BritNationId, playerId: string, state: BritGameState): BritLandAreaId[] {
    if (nationId === "romans") {
      return [];
    } else {
      const validLands: BritLandAreaId[] = [];
      const fullLands: BritLandAreaId[] = [];
      let overstackedLand: BritLandArea | null = null;
      let overstackedArmiesCount: number | null = null;
      const lands = this.getOccupiedLandsByNation (nationId, state);
      for (const land of lands) {
        const nArmies = this.getNArmiesByLand (land, state);
        if (land.difficultTerrain) {
          if (nArmies < DIFFICULT_TERRAIN_STACKING_LIMIT) {
            validLands.push (land.id);
          } else if (nArmies === DIFFICULT_TERRAIN_STACKING_LIMIT) {
            fullLands.push (land.id);
          } else {
            overstackedLand = land;
            overstackedArmiesCount = nArmies;
          } // if - else
        } else {
          if (nArmies < NON_DIFFICULT_TERRAIN_STACKING_LIMIT) {
            validLands.push (land.id);
          } else if (nArmies === NON_DIFFICULT_TERRAIN_STACKING_LIMIT) {
            fullLands.push (land.id);
          } else {
            overstackedLand = land;
            overstackedArmiesCount = nArmies;
          } // if - else
        } // if - else
      } // for
      if (overstackedLand) {
        if (!overstackedLand.difficultTerrain || overstackedArmiesCount! < DIFFICULT_TERRAIN_OVERSTACKING_LIMIT) {
          validLands.push (overstackedLand.id);
        } // if - else
      } else {
        fullLands.forEach (l => validLands.push (l));
      } // if - else
      return validLands;
    } // if - else
  } // getValidLandsForPlacement
  
  calculatePopulationIncreaseData (nationId: BritNationId, state: BritGameState): BritPopulationIncreaseData {
    if (nationId === "romans") {
      return { nInfantries: 0, populationMarker: null };
    } else {
      const lands = this.getOccupiedLandsByNation (nationId, state);
      const nation = state.nations[nationId];
      let populationPoints = nation.population || 0;
      let onlyDifficultTerrains = true;
      for (const land of lands) {
        if (land.difficultTerrain) {
          populationPoints += 1;
        } else {
          populationPoints += 2;
          onlyDifficultTerrains = false;
        } // if - else
      } // for
      let nInfantries = Math.floor (populationPoints / 6);
      let populationMarker = populationPoints % 6 as BritPopulation;
      // Check armies limit.
      if (nInfantries > nation.infantries.length) {
        nInfantries = nation.infantries.length;
        populationMarker = 5;
      } // if
      // Check the stacking limits. The only limiting case is when there are only difficult terrains.
      if (onlyDifficultTerrains) {
        let availableSlots = 0;
        let overstackedArmiesCount: number | null = null;
        for (const land of lands) {
          const nArmies = this.getNArmiesByLand (land, state);
          if (nArmies <= DIFFICULT_TERRAIN_STACKING_LIMIT) {
            availableSlots += DIFFICULT_TERRAIN_STACKING_LIMIT - nArmies;
          } else {
            overstackedArmiesCount = nArmies;
          } // if
        } // for
        if (overstackedArmiesCount) {
          availableSlots += DIFFICULT_TERRAIN_OVERSTACKING_LIMIT - overstackedArmiesCount;
        } else {
          availableSlots += DIFFICULT_TERRAIN_OVERSTACKING_LIMIT - DIFFICULT_TERRAIN_STACKING_LIMIT;
        } // if - else
        if (nInfantries > availableSlots) {
          nInfantries = availableSlots;
          populationMarker = 5;
        } // if
      } // if
      return { nInfantries, populationMarker };
    } // if - else
  } // calculatePopulationIncreaseData
  
  private isArmyUnit (unit: BritUnit) {
    return unit.type === "infantry" || unit.type === "cavalry";
  } // isArmyUnit
  
  private getNArmiesByLand (land: BritLandArea, state: BritGameState) {
    return land.units.reduce ((armiesCount, unitId) => {
      const unit = state.units[unitId];
      if (this.isArmyUnit (unit)) { armiesCount++; }
      return armiesCount;
    }, 0);
  } // getNArmiesByLand
  
  private getOccupiedLandsByNation (nationId: BritNationId, state: BritGameState) {
    const lands: BritLandArea[] = [];
    for (const landId of this.components.LAND_AREA_IDS) {
      const land = state.areas[landId] as BritLandArea;
      if (land.units.some (u => state.units[u].nation === nationId)) {
        lands.push (land);
      } // if
    } // for
    return lands;
  } // getOccupiedLandsByNation
  
} // BritRulesPopulationIncreaseService

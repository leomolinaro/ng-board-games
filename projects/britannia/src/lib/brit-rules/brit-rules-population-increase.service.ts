import { Injectable } from "@angular/core";
import { BritArea, BritAreaId, BritLandArea, BritLandAreaId, BritNationId, BritPopulation, BritRoundId } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritGameState } from "../brit-game-state.models";

export interface BritPopulationIncreaseData {
  nInfantries: number;
  type: "infantry-placement" | "roman-reinforcements";
  populationMarker: BritPopulation | null;
} // BritPopulationIncreaseData

@Injectable ({
  providedIn: "root",
})
export class BritRulesPopulationIncreaseService {

  constructor (private components: BritComponentsService) {}

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

  isNationActive (nationId: BritNationId, state: BritGameState): boolean {
    return state.nations[nationId].active;
  } // isNationActive

  getValidLandsForPlacement (nationId: BritNationId, playerId: string, state: BritGameState): BritLandAreaId[] {
    if (nationId === "romans") { return []; }
    const validLands: BritLandAreaId[] = [];
    const fullLands: BritLandAreaId[] = [];
    let overstackedLand: BritLandArea | null = null;
    let overstackedArmiesCount: number | null = null;
    const lands = this.getOccupiedLandsByNation (nationId, state);
    for (const land of lands) {
      const nArmies = this.getNPlacedArmiesByArea (land.id, state);
      if (land.difficultTerrain) {
        if (nArmies < this.DIFFICULT_TERRAIN_STACKING_LIMIT) {
          validLands.push (land.id);
        } else if (nArmies === this.DIFFICULT_TERRAIN_STACKING_LIMIT) {
          fullLands.push (land.id);
        } else {
          overstackedLand = land;
          overstackedArmiesCount = nArmies;
        } // if - else
      } else {
        if (nArmies < this.NON_DIFFICULT_TERRAIN_STACKING_LIMIT) {
          validLands.push (land.id);
        } else if (nArmies === this.NON_DIFFICULT_TERRAIN_STACKING_LIMIT) {
          fullLands.push (land.id);
        } else {
          overstackedLand = land;
          overstackedArmiesCount = nArmies;
        } // if - else
      } // if - else
    } // for
    if (overstackedLand) {
      if (
        !overstackedLand.difficultTerrain ||
        overstackedArmiesCount! < this.DIFFICULT_TERRAIN_OVERSTACKING_LIMIT
      ) {
        validLands.push (overstackedLand.id);
      } // if - else
    } else {
      fullLands.forEach ((l) => validLands.push (l));
    } // if - else
    return validLands;
  } // getValidLandsForPlacement

  calculatePopulationIncreaseData (nationId: BritNationId, roundId: BritRoundId, state: BritGameState): BritPopulationIncreaseData {
    if (nationId === "romans") {
      const nArmies = this.getNPlacedArmiesByNation ("romans", state);
      return {
        nInfantries: this.getRomanReinforcements (nArmies, roundId),
        type: "roman-reinforcements",
        populationMarker: null,
      };
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
      let populationMarker = (populationPoints % 6) as BritPopulation;
      // Check armies limit.
      if (nInfantries > nation.nInfantries) {
        nInfantries = nation.nInfantries;
        populationMarker = 5;
      } // if
      // Check the stacking limits. The only limiting case is when there are only difficult terrains.
      if (onlyDifficultTerrains) {
        let availableSlots = 0;
        let overstackedArmiesCount: number | null = null;
        for (const land of lands) {
          const nArmies = this.getNPlacedArmiesByArea (land.id, state);
          if (nArmies <= this.DIFFICULT_TERRAIN_STACKING_LIMIT) {
            availableSlots += this.DIFFICULT_TERRAIN_STACKING_LIMIT - nArmies;
          } else {
            overstackedArmiesCount = nArmies;
          } // if
        } // for
        if (overstackedArmiesCount) {
          availableSlots +=
            this.DIFFICULT_TERRAIN_OVERSTACKING_LIMIT - overstackedArmiesCount;
        } else {
          availableSlots +=
            this.DIFFICULT_TERRAIN_OVERSTACKING_LIMIT -
            this.DIFFICULT_TERRAIN_STACKING_LIMIT;
        } // if - else
        if (nInfantries > availableSlots) {
          nInfantries = availableSlots;
          populationMarker = 5;
        } // if
      } // if
      return {
        nInfantries,
        type: "infantry-placement",
        populationMarker,
      };
    } // if - else
  } // calculatePopulationIncreaseData

  hasPopulationMarker (nationId: BritNationId) {
    return nationId !== "romans";
  } // hasPopulationMarker

  private getRomanReinforcements (nArmies: number, roundId: BritRoundId) {
    if (roundId < 2 || roundId > 5) { return 0; }
    const index = roundId - 2;
    switch (nArmies) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4: return this.ROMAN_REINFORCEMENTS_4[index];
      case 5: return this.ROMAN_REINFORCEMENTS_5[index];
      case 6: return this.ROMAN_REINFORCEMENTS_6[index];
      case 7:
      case 8: return this.ROMAN_REINFORCEMENTS_7_8[index];
      case 9: return this.ROMAN_REINFORCEMENTS_9[index];
      case 10: return this.ROMAN_REINFORCEMENTS_10[index];
      case 11: return this.ROMAN_REINFORCEMENTS_11[index];
      default: return this.ROMAN_REINFORCEMENTS_12_plus[index];
    } // switch
  } // getRomanReinforcements

  private getNPlacedArmiesByArea (areaId: BritAreaId, state: BritGameState) {
    return state.areas[areaId].units.reduce ((armiesCount, unit) => {
      // const unit = this.components.UNIT[unitId];
      if (unit.type === "infantry" || unit.type === "cavalry") { armiesCount += unit.quantity; }
      return armiesCount;
    }, 0);
  } // getNPlacedArmiesByArea

  private getNPlacedArmiesByNation (nationId: BritNationId, state: BritGameState) {
    return this.getOccupiedAreasByNation (nationId, state)
    .reduce ((counter, area) => counter + this.getNPlacedArmiesByArea (area.id, state), 0);
  } // getNPlacedArmiesByNation

  private getOccupiedLandsByNation (nationId: BritNationId, state: BritGameState) {
    const lands: BritLandArea[] = [];
    for (const landId of this.components.LAND_AREA_IDS) {
      const landState = state.areas[landId];
      if (landState.units.some ((u) => u.nationId === nationId)) {
        lands.push (this.components.getLandArea (landId));
      } // if
    } // for
    return lands;
  } // getOccupiedLandsByNation

  private getOccupiedAreasByNation (nationId: BritNationId, state: BritGameState) {
    const areas: BritArea[] = [];
    for (const areaId of this.components.AREA_IDS) {
      const areaState = state.areas[areaId];
      if (areaState.units.some ((u) => u.nationId === nationId)) {
        areas.push (this.components.getArea (areaId));
      } // if
    } // for
    return areas;
  } // getOccupiedLandsByNation
  
} // BritRulesPopulationIncreaseService

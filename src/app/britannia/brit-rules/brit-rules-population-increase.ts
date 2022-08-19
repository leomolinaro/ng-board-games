import { BRIT_LAND_AREAS } from "../brit-constants";
import { BritGameStore } from "../brit-game/brit-game.store";
import { BritLandArea, BritLandAreaId, BritNationId, BritPopulation, BritUnit } from "../brit-models";

const NON_DIFFICULT_TERRAIN_STACKING_LIMIT = 3;
const DIFFICULT_TERRAIN_STACKING_LIMIT = 2;
const DIFFICULT_TERRAIN_OVERSTACKING_LIMIT = 4;

export function isNationActive (nationId: BritNationId, game: BritGameStore): boolean {
  return game.getNation (nationId).active;
} // isNationActive

export function getValidLandsForPlacement (nationId: BritNationId, playerId: string, game: BritGameStore): BritLandAreaId[] {
  if (nationId === "romans") {
    return [];
  } else {
    const validLands: BritLandAreaId[] = [];
    const fullLands: BritLandAreaId[] = [];
    let overstackedLand: BritLandArea | null = null;
    let overstackedArmiesCount: number | null = null;
    const lands = getOccupiedLandsByNation (nationId, game);
    for (const land of lands) {
      const nArmies = getNArmiesByLand (land, game);
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

export interface BritPopulationIncreaseData {
  nInfantries: number;
  populationMarker: BritPopulation | null;
} // BritPopulationIncreaseData

export function calculatePopulationIncreaseData (nationId: BritNationId, game: BritGameStore): BritPopulationIncreaseData {
  if (nationId === "romans") {
    return { nInfantries: 0, populationMarker: null };
  } else {
    const lands = getOccupiedLandsByNation (nationId, game);
    let populationPoints = game.getNation (nationId).population || 0;
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
    const nation = game.getNation (nationId);
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
        const nArmies = getNArmiesByLand (land, game);
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

function isArmyUnit (unit: BritUnit) {
  return unit.type === "infantry" || unit.type === "cavalry";
} // isArmyUnit

function getNArmiesByLand (land: BritLandArea, game: BritGameStore) {
  return land.units.reduce ((armiesCount, unitId) => {
    const unit = game.getUnit (unitId);
    if (isArmyUnit (unit)) { armiesCount++; }
    return armiesCount;
  }, 0);
} // getNArmiesByLand

function getOccupiedLandsByNation (nationId: BritNationId, game: BritGameStore) {
  const lands: BritLandArea[] = [];
  for (const landId of BRIT_LAND_AREAS) {
    const land = game.getLandArea (landId);
    if (land.units.some (u => game.getUnit (u).nation === nationId)) {
      lands.push (land);
    } // if
  } // for
  return lands;
} // getOccupiedLandsByNation

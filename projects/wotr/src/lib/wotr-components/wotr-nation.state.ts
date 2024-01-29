import { WotrFrontId } from "./wotr-front.models";
import { WotrNation, WotrNationId, WotrPoliticalStep } from "./wotr-nation.models";

export interface WotrNationState {
  map: Record<WotrNationId, WotrNation>;
  fpNationIds: WotrNationId[];
  sNationIds: WotrNationId[];
}

export function initNationState (): WotrNationState {
  return {
    fpNationIds: ["dwarves", "elves", "gondor", "north", "rohan"],
    sNationIds: ["isengard", "sauron", "southrons"],
    map: {
      dwarves: initFreePeopleNation ("dwarves", "Dwarves", 5, 5, 4, "Dwarves regular", "Dwarves elite", "Dwarves leader"),
      elves: initFreePeopleNation ("elves", "Elves", 5, 10, 4, "Elves regular", "Elves elite", "Elves leader"),
      gondor: initFreePeopleNation ("gondor", "Gondor", 15, 5, 4, "Gondor regular", "Gondor elite", "Gondor leader"),
      rohan: initFreePeopleNation ("rohan", "Rohan", 10, 5, 4, "Rohan regular", "Rohan elite", "Rohan leader"),
      north: initFreePeopleNation ("north", "The North", 10, 5, 4, "Northern regular", "Northern elite", "Northern leader"),
      isengard: initShadowNation ("isengard", "Isengard", 12, 6, 0, "Isengard regular", "Isengard elite"),
      sauron: initShadowNation ("sauron", "Sauron", 36, 6, 8, "Sauron regular", "Sauron elite"),
      southrons: initShadowNation ("southrons", "Southrons & Esterlings", 24, 6, 0, "Southrons & Esterlings regular", "Southrons & Esterlings elite"),
    }
  };
}

function initFreePeopleNation (
  id: WotrNationId, name: string,
  nRegulars: number, nElites: number, nLeaders: number,
  regularLabel: string, eliteLabel: string, leaderLabel: string
): WotrNation { return initNation (id, name, "free-peoples", nRegulars, nElites, nLeaders, 0, regularLabel, eliteLabel, leaderLabel); }

function initShadowNation (
  id: WotrNationId, name: string,
  nRegulars: number, nElites: number, nNazgul: number,
  regularLabel: string, eliteLabel: string
) { return initNation (id, name, "shadow", nRegulars, nElites, 0, nNazgul, regularLabel, eliteLabel, null); }

function initNation (
  id: WotrNationId, name: string, front: WotrFrontId,
  nRegulars: number, nElites: number, nLeaders: number, nNazgul: number,
  regularLabel: string, eliteLabel: string, leaderLabel: string | null
): WotrNation {
  return {
    id, name, front,
    regularLabel, eliteLabel, leaderLabel,
    units: { regular: nRegulars, elite: nElites, leader: nLeaders,nazgul: nNazgul },
    reinforcements: { regular: nRegulars, elite: nElites, leader: nLeaders, nazgul: nNazgul },
    casualties: { regular: 0, elite: 0, leader: 0 },
    active: false,
    politicalStep: 3
  };
}

export function getNation (id: WotrNationId, state: WotrNationState) { return state.map[id]; }
export function getFreePeopleNations (state: WotrNationState) { return state.fpNationIds.map (id => state.map[id]); }
export function getShadowNations (state: WotrNationState) { return state.sNationIds.map (id => state.map[id]); }

export function removeRegularsFromReinforcements (quantity: number, nation: WotrNation) {
  return { ...nation, reinforcements: { ...nation.reinforcements, regular: nation.reinforcements.regular - quantity } };
}

export function removeElitesFromReinforcements (quantity: number, nation: WotrNation) {
  return { ...nation, reinforcements: { ...nation.reinforcements, elite: nation.reinforcements.elite - quantity } };
}

export function removeLeadersFromReinforcements (quantity: number, nation: WotrNation) {
  return { ...nation, reinforcements: { ...nation.reinforcements, leader: nation.reinforcements.leader - quantity } };
}

export function removeNazgulFromReinforcements (quantity: number, nation: WotrNation) {
  return { ...nation, reinforcements: { ...nation.reinforcements, nazgul: nation.reinforcements.nazgul - quantity } };
}

export function setActive (active: boolean, nation: WotrNation) {
  return { ...nation, active };
}

export function setPoliticalStep (politicalStep: WotrPoliticalStep, nation: WotrNation) {
  return { ...nation, politicalStep };
}

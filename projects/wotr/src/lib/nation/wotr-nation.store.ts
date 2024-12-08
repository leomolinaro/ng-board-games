import { Injectable, Signal, computed } from "@angular/core";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrFreeGenericUnitType, WotrGenericUnitType, WotrNation, WotrNationId, WotrPoliticalStep } from "./wotr-nation.models";

export interface WotrNationState {
  map: Record<WotrNationId, WotrNation>;
  fpNationIds: WotrNationId[];
  sNationIds: WotrNationId[];
}

export function initialeState (): WotrNationState {
  return {
    fpNationIds: ["dwarves", "elves", "gondor", "north", "rohan"],
    sNationIds: ["isengard", "sauron", "southrons"],
    map: {
      dwarves: initialFreePeopleNation ("dwarves", "Dwarves", false, 3, 5, 5, 4, "Dwarves regular", "Dwarves elite", "Dwarves leader"),
      elves: initialFreePeopleNation ("elves", "Elves", true, 3, 5, 10, 4, "Elves regular", "Elves elite", "Elves leader"),
      gondor: initialFreePeopleNation ("gondor", "Gondor", false, 2, 15, 5, 4, "Gondor regular", "Gondor elite", "Gondor leader"),
      rohan: initialFreePeopleNation ("rohan", "Rohan", false, 3, 10, 5, 4, "Rohan regular", "Rohan elite", "Rohan leader"),
      north: initialFreePeopleNation ("north", "The North", false, 3, 10, 5, 4, "Northern regular", "Northern elite", "Northern leader"),
      isengard: initialShadowNation ("isengard", "Isengard", true, 1, 12, 6, 0, "Isengard regular", "Isengard elite"),
      sauron: initialShadowNation ("sauron", "Sauron", true, 1, 36, 6, 8, "Sauron regular", "Sauron elite"),
      southrons: initialShadowNation ("southrons", "Southrons & Esterlings", true, 2, 24, 6, 0, "Southrons & Esterlings regular", "Southrons & Esterlings elite"),
    }
  };
}

function initialFreePeopleNation (
  id: WotrNationId, name: string,
  active: boolean, politicalStep: WotrPoliticalStep,
  nRegulars: number, nElites: number, nLeaders: number,
  regularLabel: string, eliteLabel: string, leaderLabel: string
): WotrNation { return initialNation (id, name, "free-peoples", active, politicalStep, nRegulars, nElites, nLeaders, 0, regularLabel, eliteLabel, leaderLabel); }

function initialShadowNation (
  id: WotrNationId, name: string,
  active: boolean, politicalStep: WotrPoliticalStep,
  nRegulars: number, nElites: number, nNazgul: number,
  regularLabel: string, eliteLabel: string
) { return initialNation (id, name, "shadow", active, politicalStep, nRegulars, nElites, 0, nNazgul, regularLabel, eliteLabel, null); }

function initialNation (
  id: WotrNationId, name: string, front: WotrFrontId,
  active: boolean, politicalStep: WotrPoliticalStep,
  nRegulars: number, nElites: number, nLeaders: number, nNazgul: number,
  regularLabel: string, eliteLabel: string, leaderLabel: string | null
): WotrNation {
  return {
    id, name, front,
    regularLabel, eliteLabel, leaderLabel,
    units: { regular: nRegulars, elite: nElites, leader: nLeaders,nazgul: nNazgul },
    reinforcements: { regular: nRegulars, elite: nElites, leader: nLeaders, nazgul: nNazgul },
    casualties: { regular: 0, elite: 0, leader: 0 },
    active,
    politicalStep
  };
}

@Injectable ()
export class WotrNationStore {

  update!: (actionName: string, updater: (a: WotrNationState) => WotrNationState) => void;
  state!: Signal<WotrNationState>;

  freePeoplesNations = computed (() => { const s = this.state (); return s.fpNationIds.map (id => s.map[id]); });
  shadowNations = computed (() => { const s = this.state (); return s.sNationIds.map (id => s.map[id]); });
  nationById = computed (() => this.state ().map);
  nation (id: WotrNationId) { return this.state ().map[id]; }
  nations = computed (() => { const s = this.state (); return [...s.fpNationIds, ...s.sNationIds].map (id => s.map[id]); });

  private updateNation (actionName: string, nationId: WotrNationId, updater: (a: WotrNation) => WotrNation) {
    this.update (actionName, s => ({ ...s, map: { ...s.map, [nationId]: updater (s.map[nationId]) } }));
  }

  private updateUnitReinforcements (unitType: WotrGenericUnitType, deltaQuantity: number, nationId: WotrNationId) {
    this.updateNation ("updateUnitReinforcements", nationId, nation => ({
      ...nation, reinforcements: { ...nation.reinforcements, [unitType]: nation.reinforcements[unitType] + deltaQuantity }
    }));
  }

  addRegularsToReinforcements (quantity: number, nationId: WotrNationId) { this.updateUnitReinforcements ("regular", quantity, nationId); }
  removeRegularsFromReinforcements (quantity: number, nationId: WotrNationId) { this.updateUnitReinforcements ("regular", -quantity, nationId); }
  addElitesToReinforcements (quantity: number, nationId: WotrNationId) { this.updateUnitReinforcements ("elite", quantity, nationId); }
  removeElitesFromReinforcements (quantity: number, nationId: WotrNationId) { this.updateUnitReinforcements ("elite", -quantity, nationId); }
  addLeadersToReinforcements (quantity: number, nationId: WotrNationId) { this.updateUnitReinforcements ("leader", quantity, nationId); }
  removeLeadersFromReinforcements (quantity: number, nationId: WotrNationId) { this.updateUnitReinforcements ("leader", -quantity, nationId); }
  addNazgulToReinforcements (quantity: number) { this.updateUnitReinforcements ("nazgul", quantity, "sauron"); }
  removeNazgulFromReinforcements (quantity: number) { this.updateUnitReinforcements ("nazgul", -quantity, "sauron"); }

  private updateUnitCasualties (unitType: WotrFreeGenericUnitType, deltaQuantity: number, nationId: WotrNationId) {
    this.updateNation ("updateUnitCasualties", nationId, nation => ({
      ...nation, casualties: { ...nation.casualties, [unitType]: nation.casualties[unitType] + deltaQuantity }
    }));
  }

  addRegularsToCasualties (quantity: number, nationId: WotrNationId) { this.updateUnitCasualties ("regular", quantity, nationId); }
  removeRegularsFromCasualties (quantity: number, nationId: WotrNationId) { this.updateUnitCasualties ("regular", -quantity, nationId); }
  addElitesToCasualties (quantity: number, nationId: WotrNationId) { this.updateUnitCasualties ("elite", quantity, nationId); }
  removeElitesFromCasualties (quantity: number, nationId: WotrNationId) { this.updateUnitCasualties ("elite", -quantity, nationId); }
  addLeadersToCasualties (quantity: number, nationId: WotrNationId) { this.updateUnitCasualties ("leader", quantity, nationId); }
  removeLeadersFromCasualties (quantity: number, nationId: WotrNationId) { this.updateUnitCasualties ("leader", -quantity, nationId); }

  activate (active: boolean, nationId: WotrNationId) {
    this.updateNation ("setActive", nationId, nation => ({
      ...nation, active
    }));
  }

  setPoliticalStep (politicalStep: WotrPoliticalStep, nationId: WotrNationId) {
    this.updateNation ("setPoliticalStep", nationId, nation => ({
      ...nation, politicalStep
    }));
  }

  advance (quantity: number, nationId: WotrNationId) {
    this.updateNation ("advancePoliticalStep", nationId, nation => {
      let next: WotrPoliticalStep;
      for (let i = 0; i < quantity; i++) {
        next = this.getNextPoliticalStep (nation.politicalStep);
      }
      return {
        ...nation,
        politicalStep: next!
      };
    });
  }

  private getNextPoliticalStep (politicalStep: WotrPoliticalStep): WotrPoliticalStep {
    switch (politicalStep) {
      case 3: return 2;
      case 2: return 1;
      case 1:
      case "atWar": return "atWar";
    }
  }

}
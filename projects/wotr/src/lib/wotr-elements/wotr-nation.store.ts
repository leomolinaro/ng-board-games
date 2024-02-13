import { Injectable } from "@angular/core";
import { WotrFrontId } from "./wotr-front.models";
import { WotrNation, WotrNationId, WotrPoliticalStep } from "./wotr-nation.models";

export interface WotrNationState {
  map: Record<WotrNationId, WotrNation>;
  fpNationIds: WotrNationId[];
  sNationIds: WotrNationId[];
}

@Injectable ({
  providedIn: "root"
})
export class WotrNationStore {

  update!: (actionName: string, updater: (a: WotrNationState) => WotrNationState) => void;

  init (): WotrNationState {
    return {
      fpNationIds: ["dwarves", "elves", "gondor", "north", "rohan"],
      sNationIds: ["isengard", "sauron", "southrons"],
      map: {
        dwarves: this.initFreePeopleNation ("dwarves", "Dwarves", 5, 5, 4, "Dwarves regular", "Dwarves elite", "Dwarves leader"),
        elves: this.initFreePeopleNation ("elves", "Elves", 5, 10, 4, "Elves regular", "Elves elite", "Elves leader"),
        gondor: this.initFreePeopleNation ("gondor", "Gondor", 15, 5, 4, "Gondor regular", "Gondor elite", "Gondor leader"),
        rohan: this.initFreePeopleNation ("rohan", "Rohan", 10, 5, 4, "Rohan regular", "Rohan elite", "Rohan leader"),
        north: this.initFreePeopleNation ("north", "The North", 10, 5, 4, "Northern regular", "Northern elite", "Northern leader"),
        isengard: this.initShadowNation ("isengard", "Isengard", 12, 6, 0, "Isengard regular", "Isengard elite"),
        sauron: this.initShadowNation ("sauron", "Sauron", 36, 6, 8, "Sauron regular", "Sauron elite"),
        southrons: this.initShadowNation ("southrons", "Southrons & Esterlings", 24, 6, 0, "Southrons & Esterlings regular", "Southrons & Esterlings elite"),
      }
    };
  }

  private initFreePeopleNation (
    id: WotrNationId, name: string,
    nRegulars: number, nElites: number, nLeaders: number,
    regularLabel: string, eliteLabel: string, leaderLabel: string
  ): WotrNation { return this.initNation (id, name, "free-peoples", nRegulars, nElites, nLeaders, 0, regularLabel, eliteLabel, leaderLabel); }

  private initShadowNation (
    id: WotrNationId, name: string,
    nRegulars: number, nElites: number, nNazgul: number,
    regularLabel: string, eliteLabel: string
  ) { return this.initNation (id, name, "shadow", nRegulars, nElites, 0, nNazgul, regularLabel, eliteLabel, null); }

  private initNation (
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

  getNation (id: WotrNationId, state: WotrNationState) { return state.map[id]; }
  getFreePeopleNations (state: WotrNationState) { return state.fpNationIds.map (id => state.map[id]); }
  getShadowNations (state: WotrNationState) { return state.sNationIds.map (id => state.map[id]); }

  private updateNation (actionName: string, nationId: WotrNationId, updater: (a: WotrNation) => WotrNation) {
    this.update (actionName, s => ({ ...s, map: { ...s.map, [nationId]: updater (s.map[nationId]) } }));
  }

  removeRegularsFromReinforcements (quantity: number, nationId: WotrNationId) {
    this.updateNation ("removeRegularsFromReinforcements", nationId, nation => ({
      ...nation, reinforcements: { ...nation.reinforcements, regular: nation.reinforcements.regular - quantity }
    }));
  }

  removeElitesFromReinforcements (quantity: number, nationId: WotrNationId) {
    this.updateNation ("removeElitesFromReinforcements", nationId, nation => ({
      ...nation, reinforcements: { ...nation.reinforcements, elite: nation.reinforcements.elite - quantity }
    }));
  }

  removeLeadersFromReinforcements (quantity: number, nationId: WotrNationId) {
    this.updateNation ("removeLeadersFromReinforcements", nationId, nation => ({
      ...nation, reinforcements: { ...nation.reinforcements, leader: nation.reinforcements.leader - quantity }
    }));
  }

  removeNazgulFromReinforcements (quantity: number, nationId: WotrNationId) {
    this.updateNation ("removeNazgulFromReinforcements", nationId, nation => ({
      ...nation, reinforcements: { ...nation.reinforcements, nazgul: nation.reinforcements.nazgul - quantity }
    }));
  }

  setActive (active: boolean, nationId: WotrNationId) {
    this.updateNation ("setActive", nationId, nation => ({
      ...nation, active
    }));
  }

  setPoliticalStep (politicalStep: WotrPoliticalStep, nationId: WotrNationId) {
    this.updateNation ("setPoliticalStep", nationId, nation => ({
      ...nation, politicalStep
    }));
  }

}
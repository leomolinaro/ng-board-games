import { Injectable } from "@angular/core";
import { cardScenarios } from "../card/wotr-card-scenarios";
import { characterScenarios } from "../character/wotr-character-scenarios";
import { huntScenarios } from "../hunt/wotr-hunt-scenarios";
import { fullGameScenarios } from "./full-games/wotr-full-game-scenarios";
import {
  WotrScenario,
  WotrScenarioGroup,
  WotrScenarioGroupInfo,
  WotrScenarioInfo
} from "./wotr-scenario";

@Injectable({ providedIn: "root" })
export class WotrScenarios {
  private infos: WotrScenarioGroupInfo[];
  private map: Record<string, WotrScenario>;
  private flatInfos: WotrScenarioInfo[];

  constructor() {
    this.map = {};
    this.infos = [];
    this.flatInfos = [];
    this.addScenarioGroup(fullGameScenarios(), this.infos);
    this.addScenarioGroup(cardScenarios(), this.infos);
    this.addScenarioGroup(characterScenarios(), this.infos);
    this.addScenarioGroup(huntScenarios(), this.infos);
  }

  private addScenarioGroup(
    group: WotrScenarioGroup,
    groupInfos: (WotrScenarioGroupInfo | WotrScenarioInfo)[]
  ) {
    const scenarioGroupInfo: WotrScenarioGroupInfo = {
      id: group.id,
      type: "group",
      name: group.name,
      scenarios: []
    };
    groupInfos.push(scenarioGroupInfo);
    for (const scenario of group.scenarios) {
      if ("scenarios" in scenario) {
        this.addScenarioGroup(scenario, scenarioGroupInfo.scenarios);
      } else {
        this.addScenarios([scenario], scenarioGroupInfo.scenarios);
      }
    }
  }

  private addScenarios(
    scenarios: WotrScenario[],
    groupInfos: (WotrScenarioGroupInfo | WotrScenarioInfo)[]
  ) {
    for (const scenario of scenarios) {
      this.map[scenario.id] = scenario;
      const scenarioInfo: WotrScenarioInfo = {
        id: scenario.id,
        type: "scenario",
        name: scenario.name,
        description: scenario.description
      };
      groupInfos.push(scenarioInfo);
      this.flatInfos.push(scenarioInfo);
    }
  }

  getScenarioInfos() {
    return this.infos;
  }

  getFlatScenarioInfos(): WotrScenarioInfo[] {
    return this.flatInfos;
  }

  getScenario(id: string): WotrScenario {
    const game = this.map[id];
    if (!game) throw new Error(`Example game with id ${id} not found`);
    return game;
  }
}

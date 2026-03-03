import { Injectable } from "@angular/core";
import { cardScenarios } from "../card/wotr-card-scenarios";
import { characterScenarios } from "../character/wotr-character-scenarios";
import { huntScenarios } from "../hunt/wotr-hunt-scenarios";
import { fullGameScenarios } from "./full-games/wotr-full-game-scenarios";
import { WotrScenario, WotrScenarioInfo } from "./wotr-scenario";

@Injectable({ providedIn: "root" })
export class WotrScenarios {
  private infos: WotrScenarioInfo[];
  private map: Record<string, WotrScenario>;

  constructor() {
    this.map = {};
    this.infos = [];
    this.addScenarios(fullGameScenarios());
    this.addScenarios(cardScenarios());
    this.addScenarios(characterScenarios());
    this.addScenarios(huntScenarios());
  }

  private addScenarios(scenarios: WotrScenario[]) {
    for (const scenario of scenarios) {
      this.map[scenario.id] = scenario;
      this.infos.push({
        id: scenario.id,
        name: scenario.name,
        description: scenario.description
      });
    }
  }

  getScenarioInfos() {
    return this.infos;
  }

  getScenario(id: string): WotrScenario {
    const game = this.map[id];
    if (!game) throw new Error(`Example game with id ${id} not found`);
    return game;
  }
}

import { Injectable } from "@angular/core";
import { cardSimulations } from "../card/wotr-card-simulations";
import { fullGameSimulations } from "./full-games/wotr-full-game-simulations";
import { WotrSimulation, WotrSimulationInfo } from "./wotr-simulation";
import { characterSimulations } from "../character/wotr-character-simulations";

@Injectable({ providedIn: "root" })
export class WotrSimulations {
  private infos: WotrSimulationInfo[];
  private map: Record<string, WotrSimulation>;

  constructor() {
    this.map = {};
    this.infos = [];
    this.addSimulations(fullGameSimulations());
    this.addSimulations(cardSimulations());
    this.addSimulations(characterSimulations());
  }

  private addSimulations(simulations: WotrSimulation[]) {
    for (const simulation of simulations) {
      this.map[simulation.id] = simulation;
      this.infos.push({
        id: simulation.id,
        name: simulation.name,
        description: simulation.description
      });
    }
  }

  getSimulationInfos() {
    return this.infos;
  }

  getSimulation(id: string): WotrSimulation {
    const game = this.map[id];
    if (!game) throw new Error(`Example game with id ${id} not found`);
    return game;
  }
}

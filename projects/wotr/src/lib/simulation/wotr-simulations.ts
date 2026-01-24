import { Injectable } from "@angular/core";
import { cardSimulations } from "../card/wotr-card-simulations";
import { fullGameSimulations } from "./full-games/wotr-full-game-simulations";
import { WotrSimulation, WotrSimulationInfo } from "./wotr-simulation";

@Injectable({ providedIn: "root" })
export class WotrSimulations {
  private infos: WotrSimulationInfo[];
  private map: Record<string, WotrSimulation>;

  constructor() {
    this.map = {};
    this.infos = [];
    this.addSimulations(fullGameSimulations());
    this.addSimulations(cardSimulations());
  }

  private addSimulations(simulations: WotrSimulation[]) {
    for (const { id, name, loadDefinition } of simulations) {
      this.map[id] = { id, name, loadDefinition };
      this.infos.push({ id, name });
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

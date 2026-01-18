import { Injectable } from "@angular/core";
import { WotrSimulation, WotrSimulationDefinition, WotrSimulationInfo } from "./wotr-simulation";

@Injectable({
  providedIn: "root"
})
export class WotrSimulations {
  private infos: WotrSimulationInfo[];
  private map: Record<string, WotrSimulation>;

  constructor() {
    this.map = {};
    this.infos = [];
    this.addSimulation("very-late-minions", "Very Late Minions", () =>
      import("./list/very-late-minions").then(e => e.simulation)
    );
    this.addSimulation("there-is-another-way", "There Is Another Way", () =>
      import("./list/there-is-another-way").then(e => e.simulation)
    );
    this.addSimulation("elven-cloaks-01", "Elven Cloaks 01", () =>
      import("../card/cards/free-peoples-character-cards/01-elven-cloaks-simulation").then(
        e => e.simulation01
      )
    );
  }

  private addSimulation(id: string, name: string, loader: () => Promise<WotrSimulationDefinition>) {
    this.map[id] = { id, name, loadDefinition: loader };
    this.infos.push({ id, name });
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

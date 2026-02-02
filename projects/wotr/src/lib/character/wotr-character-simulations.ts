import { WotrSimulation } from "../simulation/wotr-simulation";
import { charactersSimulations } from "./characters/wotr-characters-simulations";

export function characterSimulations(): WotrSimulation[] {
  return [
    // TODO separate simulations for ui checks or story effects
    ...charactersSimulations()
  ];
}

import { WotrSimulation } from "../../simulation/wotr-simulation";
import { meriadocPeregrinSimulations } from "./meriadoc-peregrin-simulations";

export function charactersSimulations(): WotrSimulation[] {
  return [
    // TODO separate simulations for ui checks or story effects
    ...meriadocPeregrinSimulations()
  ];
}

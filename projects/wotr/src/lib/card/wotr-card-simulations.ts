import { WotrSimulation } from "../simulation/wotr-simulation";
import { freePeoplesCharacterCardSimulations } from "./cards/free-peoples-character-cards/wotr-free-peoples-character-card-simulations";

export function cardSimulations(): WotrSimulation[] {
  return [...freePeoplesCharacterCardSimulations()];
}

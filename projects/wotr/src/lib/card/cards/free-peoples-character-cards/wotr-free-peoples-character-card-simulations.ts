import { WotrSimulation } from "../../../simulation/wotr-simulation";
import { elvenCloaksSimulations } from "./01-elven-cloaks-simulation";
import { axeAndBowSimulations } from "./06-axe-and-bow-simulation.ts";

export function freePeoplesCharacterCardSimulations(): WotrSimulation[] {
  return [...elvenCloaksSimulations(), ...axeAndBowSimulations()];
}

import { WotrSimulation } from "../../../simulation/wotr-simulation";
import { elvenCloaksSimulations } from "./01-elven-cloaks-simulation";
import { mithrilCoatAndStingSimulations } from "./05-mithril-coat-and-sting-simulations";
import { axeAndBowSimulations } from "./06-axe-and-bow-simulation.ts";
import { hornOfGondorSimulations } from "./07-horn-of-gondor-simulation";

export function freePeoplesCharacterCardSimulations(): WotrSimulation[] {
  return [
    ...elvenCloaksSimulations(),
    ...mithrilCoatAndStingSimulations(),
    ...axeAndBowSimulations(),
    ...hornOfGondorSimulations()
  ];
}

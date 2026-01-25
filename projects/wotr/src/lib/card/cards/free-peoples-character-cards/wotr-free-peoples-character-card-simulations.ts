import { WotrSimulation } from "../../../simulation/wotr-simulation";
import { elvenCloaksSimulations } from "./01-elven-cloaks-simulation";
import { mithrilCoatAndStingSimulations } from "./05-mithril-coat-and-sting-simulations";
import { axeAndBowSimulations } from "./06-axe-and-bow-simulation";
import { hornOfGondorSimulations } from "./07-horn-of-gondor-simulation";
import { wizardsStaff } from "./08-wizards-staff-simulation";

export function freePeoplesCharacterCardSimulations(): WotrSimulation[] {
  return [
    // TODO separate simulations for ui checks or story effects
    ...elvenCloaksSimulations(),
    ...mithrilCoatAndStingSimulations(),
    ...axeAndBowSimulations(),
    ...hornOfGondorSimulations(),
    ...wizardsStaff()
  ];
}

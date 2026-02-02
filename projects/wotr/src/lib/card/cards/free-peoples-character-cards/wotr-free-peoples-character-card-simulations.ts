import { WotrSimulation } from "../../../simulation/wotr-simulation";
import { elvenCloaksSimulations } from "./01-elven-cloaks-simulations";
import { mithrilCoatAndStingSimulations } from "./05-mithril-coat-and-sting-simulations";
import { axeAndBowSimulations } from "./06-axe-and-bow-simulations";
import { hornOfGondorSimulations } from "./07-horn-of-gondor-simulations";
import { wizardsStaff } from "./08-wizards-staff-simulations";

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

import { WotrScenario } from "../../../scenario/wotr-scenario";
import { elvenCloaksScenarios } from "./01-elven-cloaks-scenarios";
import { mithrilCoatAndStingScenarios } from "./05-mithril-coat-and-sting-scenarios";
import { axeAndBowScenarios } from "./06-axe-and-bow-scenarios";
import { hornOfGondorScenarios } from "./07-horn-of-gondor-scenarios";
import { wizardsStaff } from "./08-wizards-staff-scenarios";

export function freePeoplesCharacterCardScenarios(): WotrScenario[] {
  return [
    // TODO separate scenarios for ui checks or story effects
    ...elvenCloaksScenarios(),
    ...mithrilCoatAndStingScenarios(),
    ...axeAndBowScenarios(),
    ...hornOfGondorScenarios(),
    ...wizardsStaff()
  ];
}

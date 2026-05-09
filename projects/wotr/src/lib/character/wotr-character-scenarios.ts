import { WotrScenarioGroup } from "../scenario/wotr-scenario";
import { gandalfTheWhiteScenarios } from "./characters/gandalf-the-white-scenarios";
import { brandScenarios } from "./characters/kome/brand-scenarios";
import { meriadocPeregrinScenarios } from "./characters/meriadoc-peregrin-scenarios";

export function characterScenarios(): WotrScenarioGroup {
  return {
    id: "characters",
    name: "Characters",
    scenarios: [meriadocPeregrinScenarios(), gandalfTheWhiteScenarios(), brandScenarios()]
  };
}

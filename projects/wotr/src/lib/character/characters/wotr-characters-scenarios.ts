import { WotrScenario } from "../../scenario/wotr-scenario";
import { gandalfTheWhiteScenarios } from "./gandalf-the-white-scenarios";
import { brandScenarios } from "./kome/brand-scenarios";
import { meriadocPeregrinScenarios } from "./meriadoc-peregrin-scenarios";

export function charactersScenarios(): WotrScenario[] {
  return [...meriadocPeregrinScenarios(), ...gandalfTheWhiteScenarios(), ...brandScenarios()];
}

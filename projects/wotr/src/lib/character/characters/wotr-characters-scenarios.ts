import { WotrScenario } from "../../scenario/wotr-scenario";
import { gandalfTheWhiteScenarios } from "./gandalf-the-white-scenarios";
import { meriadocPeregrinScenarios } from "./meriadoc-peregrin-scenarios";

export function charactersScenarios(): WotrScenario[] {
  return [...meriadocPeregrinScenarios(), ...gandalfTheWhiteScenarios()];
}

import { WotrScenario } from "../../scenario/wotr-scenario";
import { meriadocPeregrinScenarios } from "./meriadoc-peregrin-scenarios";

export function charactersScenarios(): WotrScenario[] {
  return [...meriadocPeregrinScenarios()];
}

import { WotrScenario } from "../scenario/wotr-scenario";
import { charactersScenarios } from "./characters/wotr-characters-scenarios";

export function characterScenarios(): WotrScenario[] {
  return [...charactersScenarios()];
}

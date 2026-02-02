import { WotrScenario } from "../scenario/wotr-scenario";
import { charactersScenarios } from "./characters/wotr-characters-scenarios";

export function characterScenarios(): WotrScenario[] {
  return [
    // TODO separate scenarios for ui checks or story effects
    ...charactersScenarios()
  ];
}

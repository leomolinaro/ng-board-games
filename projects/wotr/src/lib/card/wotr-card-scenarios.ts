import { WotrScenarioGroup } from "../scenario/wotr-scenario";
import { freePeoplesCharacterCardScenarios } from "./cards/free-peoples-character-cards/wotr-free-peoples-character-card-scenarios";

export function cardScenarios(): WotrScenarioGroup {
  return {
    id: "cards",
    name: "Cards",
    scenarios: [freePeoplesCharacterCardScenarios()]
  };
}

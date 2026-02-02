import { WotrScenario } from "../scenario/wotr-scenario";
import { freePeoplesCharacterCardScenarios } from "./cards/free-peoples-character-cards/wotr-free-peoples-character-card-scenarios";

export function cardScenarios(): WotrScenario[] {
  return [...freePeoplesCharacterCardScenarios()];
}

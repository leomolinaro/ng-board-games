import { WotrScenarioGroup } from "../../scenario/wotr-scenario";
import { bladeOfWesternesse } from "./blade-of-westernesse-scenarios";

export function combatCardScenarios(): WotrScenarioGroup {
  return {
    id: "combat-cards",
    name: "Combat Cards",
    scenarios: [bladeOfWesternesse()]
  };
}

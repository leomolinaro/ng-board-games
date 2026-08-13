import { WotrScenarioGroup } from "../../../scenario/wotr-scenario";
import { theFightingUrukHai } from "./02-the-fighting-uruk-hai";

export function shadowStrategyCardScenarios(): WotrScenarioGroup {
  return {
    id: "shadow-strategy-cards",
    name: "Shadow Strategy Cards",
    scenarios: [theFightingUrukHai()]
  };
}

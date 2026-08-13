import { WotrScenarioGroup } from "../../../scenario/wotr-scenario";
import { helpUnlookedFor } from "./10-help-unlooked-for";

export function freePeoplesStrategyCardScenarios(): WotrScenarioGroup {
  return {
    id: "free-peoples-strategy-cards",
    name: "Free Peoples Strategy Cards",
    scenarios: [helpUnlookedFor()]
  };
}

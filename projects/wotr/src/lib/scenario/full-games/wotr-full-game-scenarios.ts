import { WotrScenario } from "../wotr-scenario";
import { scenario as thereIsAnotherWay } from "./there-is-another-way";
import { scenario as veryLateMinions } from "./very-late-minions";

export function fullGameScenarios(): WotrScenario[] {
  return [
    {
      id: "very-late-minions",
      name: "Very Late Minions",
      loadDefinition: () => veryLateMinions
    },
    {
      id: "there-is-another-way",
      name: "There Is Another Way",
      loadDefinition: () => thereIsAnotherWay
    }
  ];
}

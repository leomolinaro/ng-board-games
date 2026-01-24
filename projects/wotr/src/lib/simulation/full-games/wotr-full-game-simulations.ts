import { WotrSimulation } from "../wotr-simulation";
import { simulation as thereIsAnotherWay } from "./there-is-another-way";
import { simulation as veryLateMinions } from "./very-late-minions";

export function fullGameSimulations(): WotrSimulation[] {
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

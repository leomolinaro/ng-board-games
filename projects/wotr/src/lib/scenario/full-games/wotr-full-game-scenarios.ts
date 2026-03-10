import { WotrScenario } from "../wotr-scenario";
import { scenario as myGame1 } from "./my-game-1";
import { scenario as myGame2 } from "./my-game-2";
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
    },
    {
      id: "my-game-1",
      name: "My Game 1",
      loadDefinition: () => myGame1
    },
    {
      id: "my-game-2",
      name: "My Game 2",
      loadDefinition: () => myGame2
    }
  ];
}

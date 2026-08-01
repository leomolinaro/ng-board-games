import { declareFellowship } from "../../../fellowship/wotr-fellowship-actions";
import { WotrScenario, WotrScenarioGroup } from "../../../scenario/wotr-scenario";
import { WotrStoriesBuilder } from "../../../scenario/wotr-story-builder";
import { playCardOnTable } from "../../wotr-card-actions";

export function balrogOfMoria(): WotrScenarioGroup {
  return {
    id: "balrog-of-moria",
    name: "Balrog of Moria",
    scenarios: [balrogOfMoria01]
  };
}

const balrogOfMoria01: WotrScenario = {
  id: "balrog-of-moria-01",
  name: "Balrog of Moria",
  description: "When The Fellowship is declared through Moria and the Balrog card is in play",
  loadDefinition: () => ({
    setup: setupBuilder => setupBuilder.shuffledDecks().fellowshipProgress(4).huntPool("1").build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw("Balrog of Moria"),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice(),
      b.s().rollActionDice("character"),
      b.s().characterDie(playCardOnTable("Balrog of Moria")),

      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(declareFellowship("dimrill-dale"))
    ]
  })
};

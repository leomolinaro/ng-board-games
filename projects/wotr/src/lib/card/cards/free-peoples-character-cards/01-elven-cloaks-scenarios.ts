import { declareFellowship } from "../../../fellowship/wotr-fellowship-actions";
import { WotrScenario, WotrScenarioGroup } from "../../../scenario/wotr-scenario";
import { WotrStoriesBuilder } from "../../../scenario/wotr-story-builder";

export function elvenCloaksScenarios(): WotrScenarioGroup {
  return {
    id: "elven-cloaks",
    name: "Elven Cloaks",
    scenarios: [elvenCloaks01, elvenCloaks02]
  };
}

const elvenCloaks01: WotrScenario = {
  id: "elven-cloaks-01",
  name: "Elven Cloaks",
  description: "When Fellowship in a region",
  loadDefinition: () => ({
    setup: setupBuilder => setupBuilder.shuffledDecks().build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Elven Cloaks"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(0),
      b.fpT().rollActionDice("event"),
      b.s().rollActionDice()
    ]
  })
};

const elvenCloaks02: WotrScenario = {
  id: "elven-cloaks-02",
  name: "Elven Cloaks",
  description: "When Fellowship on the Mordor track",
  loadDefinition: () => ({
    setup: setupBuilder => setupBuilder.shuffledDecks().fellowshipProgress(10).build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Elven Cloaks"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(declareFellowship("morannon")),
      b.s().huntAllocation(0),
      b.fpT().rollActionDice("event"),
      b.s().rollActionDice()
    ]
  })
};

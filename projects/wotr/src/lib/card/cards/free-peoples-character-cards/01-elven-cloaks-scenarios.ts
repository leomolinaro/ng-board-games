import { declareFellowship } from "../../../fellowship/wotr-fellowship-actions";
import { WotrScenario } from "../../../scenario/wotr-scenario";
import { WotrStoriesBuilder } from "../../../scenario/wotr-story-builder";
import { WotrSetupBuilder } from "../../../setup/wotr-setup-builder";

export function elvenCloaksScenarios(): WotrScenario[] {
  return [elvenCloaks01, elvenCloaks02];
}

const elvenCloaks01: WotrScenario = {
  id: "elven-cloaks-01",
  name: "Elven Cloaks",
  description: "When Fellowship in a region",
  loadDefinition: () => ({
    setup: rules => new WotrSetupBuilder(rules).shuffledDecks().build(),
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
    setup: rules => new WotrSetupBuilder(rules).shuffledDecks().fellowshipProgress(10).build(),
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

import { declareFellowship } from "../../../fellowship/wotr-fellowship-actions";
import { WotrSetupBuilder } from "../../../setup/wotr-setup-builder";
import { WotrSimulation } from "../../../simulation/wotr-simulation";
import { WotrStoriesBuilder } from "../../../simulation/wotr-story-builder";

export function elvenCloaksSimulations(): WotrSimulation[] {
  return [elvenCloaks01, elvenCloaks02];
}

const elvenCloaks01: WotrSimulation = {
  id: "elven-cloaks-01",
  name: "Elven Cloaks",
  description: "Fellowship in region",
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

const elvenCloaks02: WotrSimulation = {
  id: "elven-cloaks-02",
  name: "Elven Cloaks",
  description: "Fellowship on the Mordor track",
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

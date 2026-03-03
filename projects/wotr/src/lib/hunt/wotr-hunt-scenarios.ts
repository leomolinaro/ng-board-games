import { WotrScenario } from "../scenario/wotr-scenario";
import { WotrStoriesBuilder } from "../scenario/wotr-story-builder";
import { WotrSetupBuilder } from "../setup/wotr-setup-builder";

export function huntScenarios(): WotrScenario[] {
  return [corruptionAttempt01];
}

const corruptionAttempt01: WotrScenario = {
  id: "corruption-attempt-01",
  name: "Corruption Attempt",
  description: "When Shadow can spend an eye die to perform a corruption attempt",
  loadDefinition: () => ({
    options: {
      expansions: ["kome"],
      variants: [],
      tokens: []
    },
    setup: rules => new WotrSetupBuilder(rules).build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character"),
      b.s().rollActionDice("character", "army"),
      b.fp().pass()
    ]
  })
};

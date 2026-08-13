import { WotrScenario, WotrScenarioGroup } from "../../../scenario/wotr-scenario";
import { WotrStoriesBuilder } from "../../../scenario/wotr-story-builder";

export function theShadowIsMoving(): WotrScenarioGroup {
  return {
    id: "the-shadow-is-moving",
    name: "The Shadow is Moving",
    scenarios: [theShadowIsMoving01]
  };
}

const theShadowIsMoving01: WotrScenario = {
  id: "the-shadow-is-moving-01",
  name: "The Shadow is Moving",
  description: "When The Shadow is Moving can be played",
  loadDefinition: () => ({
    setup: setupBuilder =>
      setupBuilder
        .shuffledDecks()
        .nation("sauron", true, "atWar")
        .nation("isengard", true, "atWar")
        .nation("southrons", true, "atWar")
        .region("noman-lands", "sauron", { nRegulars: 2 })
        .region("eastern-brown-lands", "sauron", { nRegulars: 2 })
        .region("eastern-emyn-muil", "sauron", { nRegulars: 2 })
        .region("dagorlad", "sauron", { nRegulars: 2 })
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw("The Shadow is Moving"),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice(),
      b.s().rollActionDice("army")
      // b.s().armyDieCard("The Shadow is Moving")
    ]
  })
};

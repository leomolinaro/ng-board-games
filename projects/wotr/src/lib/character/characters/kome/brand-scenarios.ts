import { attack, combatCard } from "../../../battle/wotr-battle-actions";
import { startCorruptionAttempt, stopCorruptionAttempt } from "../../../hunt/wotr-hunt-actions";
import { baseHuntTiles, komeHuntTiles } from "../../../hunt/wotr-hunt-models";
import { WotrScenario, WotrScenarioGroup } from "../../../scenario/wotr-scenario";
import { WotrStoriesBuilder } from "../../../scenario/wotr-story-builder";

export function brandScenarios(): WotrScenarioGroup {
  return {
    id: "brand",
    name: "Brand",
    scenarios: [brand01, brand02]
  };
}

const brand01: WotrScenario = {
  id: "brand-01",
  name: "Brand",
  description:
    "When Brand is corrupted, Free Peoples can recruit and has North Elite units reinforcements",
  loadDefinition: () => ({
    options: {
      expansions: ["kome"],
      variants: [],
      tokens: []
    },
    setup: setupBuilder =>
      setupBuilder
        .huntPool(...baseHuntTiles(), ...komeHuntTiles())
        .region("old-forest-road", "north", { nRegulars: 1, ruler: "brand" })
        .nation("north", true, "atWar")
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(2),
      b.fpT().rollActionDice("muster"),
      b.s().rollActionDice("character", "character"),
      b.fp().pass(),
      b.s().eyeDie(startCorruptionAttempt("brand", "2km")),
      b.s().corruptionStory(stopCorruptionAttempt("2km"))
    ]
  })
};

const brand02: WotrScenario = {
  id: "brand-02",
  name: "Brand",
  description:
    "When Brand is corrupted, Shadow attacks a North army and both players play combat cards",
  loadDefinition: () => ({
    options: {
      expansions: ["kome"],
      variants: [],
      tokens: []
    },
    setup: setupBuilder =>
      setupBuilder
        .shuffledDecks()
        .huntPool(...baseHuntTiles(), ...komeHuntTiles())
        .region("dale", "north", { nRegulars: 1, ruler: "brand" })
        .region("old-forest-road", "north", { nRegulars: 1 })
        .nation("sauron", true, "atWar")
        .region("narrows-of-the-forest", "sauron", { nRegulars: 1 })
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("The Spirit of Mordor"),
      b.s().firstPhaseDraw("The Shadow is Moving"),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(2),
      b.fpT().rollActionDice("muster"),
      b.s().rollActionDice("army", "character"),
      b.fp().pass(),
      b.s().eyeDie(startCorruptionAttempt("brand", "2km")),
      b.s().corruptionStory(stopCorruptionAttempt("2km")),
      b.fp().pass(),
      b.s().armyDie(attack("narrows-of-the-forest", "old-forest-road")),
      b.s().battleStory(combatCard("The Shadow is Moving")),
      b.fp().battleStory(combatCard("The Spirit of Mordor"))
    ]
  })
};

import { WotrVariantId } from "../expansion/wotr-expansion-models";
import { WotrStoryDoc } from "../game/wotr-story-models";
import { WotrScenario } from "../scenario/wotr-scenario";
import { WotrStoriesBuilder } from "../scenario/wotr-story-builder";
import { WotrSetupBuilder } from "../setup/wotr-setup-builder";
import {
  continueCorruptionAttempt,
  startCorruptionAttempt,
  stopCorruptionAttempt
} from "./wotr-hunt-actions";
import { baseHuntTiles, komeHuntTiles } from "./wotr-hunt-models";

export function huntScenarios(): WotrScenario[] {
  return [
    corruptionAttempt01,
    corruptionAttempt02,
    corruptionAttempt03,
    corruptionAttempt04,
    corruptionAttempt05,
    corruptionAttempt06,
    corruptionAttempt07
  ];
}

function baseCorruptionAttempt(
  id: string,
  description: string,
  huntAllocation: number,
  stories: (b: WotrStoriesBuilder) => WotrStoryDoc[],
  options?: { variants?: WotrVariantId[] }
): WotrScenario {
  return {
    id,
    name: "Corruption Attempt",
    description,
    loadDefinition: () => ({
      options: {
        expansions: ["kome"],
        variants: [...(options?.variants ?? []), "visibleCorruptionTiles"],
        tokens: []
      },
      setup: rules =>
        new WotrSetupBuilder(rules).huntPool(...baseHuntTiles(), ...komeHuntTiles()).build(),
      stories: (b: WotrStoriesBuilder) => [
        b.fpT().firstPhaseDraw(),
        b.s().firstPhaseDraw(),
        b.fp().fellowshipPhase(),
        b.s().huntAllocation(huntAllocation),
        b.fpT().rollActionDice("character"),
        b.s().rollActionDice("character"),
        b.fp().pass(),
        ...stories(b)
      ]
    })
  };
}

const corruptionAttempt01: WotrScenario = baseCorruptionAttempt(
  "corruption-attempt-01",
  "When Shadow can spend an eye die to perform a corruption attempt",
  2,
  () => []
);

const corruptionAttempt02: WotrScenario = baseCorruptionAttempt(
  "corruption-attempt-02",
  "When Shadow draws three corruption tiles and chooses the second one",
  4,
  (b: WotrStoriesBuilder) => [
    b.s().eyeDie(startCorruptionAttempt("dain", "1")),
    b.s().corruptionStory(continueCorruptionAttempt("3")),
    b.s().corruptionStory(continueCorruptionAttempt("2")),
    b.s().corruptionStory(stopCorruptionAttempt("3"))
  ]
);

const corruptionAttempt03: WotrScenario = baseCorruptionAttempt(
  "corruption-attempt-03",
  "When Shadow stops drawing corruption tiles since a king tile is drawn",
  4,
  (b: WotrStoriesBuilder) => [
    b.s().eyeDie(startCorruptionAttempt("dain", "1")),
    b.s().corruptionStory(continueCorruptionAttempt("2km")),
    b.s().corruptionStory(stopCorruptionAttempt("2km"))
  ]
);

const corruptionAttempt04: WotrScenario = baseCorruptionAttempt(
  "corruption-attempt-04",
  "When Shadow draws an Eye tile during a corruption attempt",
  4,
  (b: WotrStoriesBuilder) => [
    b.s().eyeDie(startCorruptionAttempt("dain", "1")),
    b.s().corruptionStory(continueCorruptionAttempt("er")),
    b.s().corruptionStory(continueCorruptionAttempt("3")),
    b.s().corruptionStory(continueCorruptionAttempt("2")),
    b.s().corruptionStory(stopCorruptionAttempt("2"))
  ]
);

const corruptionAttempt05: WotrScenario = baseCorruptionAttempt(
  "corruption-attempt-05",
  "When Shadow corrupts a sovereign",
  4,
  (b: WotrStoriesBuilder) => [
    b.s().eyeDie(startCorruptionAttempt("brand", "1")),
    b.s().corruptionStory(continueCorruptionAttempt("3")),
    b.s().corruptionStory(continueCorruptionAttempt("2")),
    b.s().corruptionStory(stopCorruptionAttempt("3"))
  ]
);

const corruptionAttempt06: WotrScenario = baseCorruptionAttempt(
  "corruption-attempt-06",
  "(Sequential corruption tile draw) When Shadow could draw two corruption tiles but chooses to stop after the first one",
  4,
  (b: WotrStoriesBuilder) => [
    b.s().eyeDie(startCorruptionAttempt("dain", "1")),
    b.s().corruptionStory(continueCorruptionAttempt("2")),
    b.s().corruptionStory(stopCorruptionAttempt("2"))
  ],
  { variants: ["sequentialCorruptionDraw"] }
);

const corruptionAttempt07: WotrScenario = baseCorruptionAttempt(
  "corruption-attempt-07",
  "(Sequential corruption tile draw) When Shadow could draw two corruption tiles but it is stopped after the first one since it is a king tile",
  4,
  (b: WotrStoriesBuilder) => [
    b.s().eyeDie(startCorruptionAttempt("dain", "1")),
    b.s().corruptionStory(continueCorruptionAttempt("2km")),
    b.s().corruptionStory(stopCorruptionAttempt("2km"))
  ],
  { variants: ["sequentialCorruptionDraw"] }
);

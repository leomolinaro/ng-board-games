import { eliminateCharacter } from "../../../character/wotr-character-actions";
import {
  chooseRandomCompanion,
  corruptFellowship,
  moveFelloswhip,
  separateCompanions
} from "../../../fellowship/wotr-fellowship-actions";
import { rollHuntDice } from "../../../hunt/wotr-hunt-actions";
import { WotrScenario } from "../../../scenario/wotr-scenario";
import { WotrStoriesBuilder } from "../../../scenario/wotr-story-builder";
import { WotrSetupBuilder } from "../../../setup/wotr-setup-builder";
import { discardCardFromTable, playCardOnTable } from "../../wotr-card-actions";

export function axeAndBowScenarios(): WotrScenario[] {
  return [axeAndBow01, axeAndBow02, axeAndBow03, axeAndBow04, axeAndBow05];
}

const axeAndBow01: WotrScenario = {
  id: "axe-and-bow-01",
  name: "Axe and Bow",
  description: "When 2 points of hunt damage are dealt",
  loadDefinition: () => ({
    setup: rules => new WotrSetupBuilder(rules).shuffledDecks().build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Axe and Bow"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice(),
      b.fp().characterDieCard("Axe and Bow", playCardOnTable("Axe and Bow")),
      b.fp().characterDie(moveFelloswhip()),
      b.s().huntStory(rollHuntDice(6)),
      b.s().drawHuntTile("2")
    ]
  })
};

const axeAndBow02: WotrScenario = {
  id: "axe-and-bow-02",
  name: "Axe and Bow",
  description: axeAndBow01.description + " and Axe and Bow is discarded",
  loadDefinition: () => {
    const axeAndBow01Def = axeAndBow01.loadDefinition();
    return {
      setup: axeAndBow01Def.setup,
      stories: (b: WotrStoriesBuilder) => [
        ...axeAndBow01Def.stories(b),
        b.fp().huntStory(discardCardFromTable("Axe and Bow"), corruptFellowship(1))
      ]
    };
  }
};

const axeAndBow03: WotrScenario = {
  id: "axe-and-bow-03",
  name: "Axe and Bow",
  description: "Legolas is eliminated from the fellowship",
  loadDefinition: () => ({
    setup: rules =>
      new WotrSetupBuilder(rules)
        .shuffledDecks()
        .fellowshipCompanions("gandalf-the-grey", "legolas")
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Axe and Bow"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice(),
      b.fp().characterDieCard("Axe and Bow", playCardOnTable("Axe and Bow")),
      b.fp().characterDie(moveFelloswhip()),
      b.s().rollHuntDice(6),
      b.s().drawHuntTile("1"),
      b.fp().huntStory(chooseRandomCompanion("legolas")),
      b.fp().huntStory(eliminateCharacter("legolas"))
    ]
  })
};

const axeAndBow04: WotrScenario = {
  id: "axe-and-bow-04",
  name: "Axe and Bow",
  description: "Legolas is separated from the fellowship",
  loadDefinition: () => ({
    setup: rules =>
      new WotrSetupBuilder(rules)
        .shuffledDecks()
        .fellowshipCompanions("gandalf-the-grey", "legolas")
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Axe and Bow"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(0),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice(),
      b.fp().characterDieCard("Axe and Bow", playCardOnTable("Axe and Bow")),
      b.fp().characterDie(separateCompanions("fords-of-bruinen", "legolas"))
    ]
  })
};

const axeAndBow05: WotrScenario = {
  id: "axe-and-bow-05",
  name: "Axe and Bow",
  description: "Boromir is separated from the fellowship",
  loadDefinition: () => ({
    setup: rules =>
      new WotrSetupBuilder(rules)
        .shuffledDecks()
        .fellowshipCompanions("gandalf-the-grey", "legolas", "boromir")
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Axe and Bow"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(0),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice(),
      b.fp().characterDieCard("Axe and Bow", playCardOnTable("Axe and Bow")),
      b.fp().characterDie(separateCompanions("fords-of-bruinen", "boromir"))
    ]
  })
};

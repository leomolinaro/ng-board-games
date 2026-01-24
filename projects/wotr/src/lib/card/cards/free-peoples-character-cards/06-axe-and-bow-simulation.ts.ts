import {
  chooseRandomCompanion,
  moveFelloswhip,
  separateCompanions
} from "../../../fellowship/wotr-fellowship-actions";
import { rollHuntDice } from "../../../hunt/wotr-hunt-actions";
import { WotrSetupBuilder } from "../../../setup/wotr-setup-builder";
import { WotrSimulation } from "../../../simulation/wotr-simulation";
import { WotrStoriesBuilder } from "../../../simulation/wotr-story-builder";
import { playCardOnTable } from "../../wotr-card-actions";

export function axeAndBowSimulations(): WotrSimulation[] {
  return [axeAndBow01, axeAndBow02, axeAndBow03];
}

const axeAndBow01: WotrSimulation = {
  id: "axe-and-bow-01",
  name: "Axe and Bow",
  description: "Absorb 2 hunt damage",
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

const axeAndBow02: WotrSimulation = {
  id: "axe-and-bow-02",
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
      b.fp().huntStory(chooseRandomCompanion("legolas"))
    ]
  })
};

const axeAndBow03: WotrSimulation = {
  id: "axe-and-bow-03",
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

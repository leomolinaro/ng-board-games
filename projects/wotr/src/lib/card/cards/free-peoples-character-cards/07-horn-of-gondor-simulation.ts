import { eliminateCharacter } from "../../../character/wotr-character-actions";
import {
  chooseRandomCompanion,
  corruptFellowship,
  moveFelloswhip,
  separateCompanions
} from "../../../fellowship/wotr-fellowship-actions";
import { rollHuntDice } from "../../../hunt/wotr-hunt-actions";
import { WotrSetupBuilder } from "../../../setup/wotr-setup-builder";
import { WotrSimulation } from "../../../simulation/wotr-simulation";
import { WotrStoriesBuilder } from "../../../simulation/wotr-story-builder";
import { discardCardFromTable, playCardOnTable } from "../../wotr-card-actions";

export function hornOfGondorSimulations(): WotrSimulation[] {
  return [hornOfGondor01, hornOfGondor02, hornOfGondor03, hornOfGondor04, hornOfGondor05];
}

const hornOfGondor01: WotrSimulation = {
  id: "horn-of-gondor-01",
  name: "Horn of Gondor",
  description: "When 2 points of hunt damage are dealt",
  loadDefinition: () => ({
    setup: rules => new WotrSetupBuilder(rules).shuffledDecks().build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Horn of Gondor"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice(),
      b.fp().characterDieCard("Horn of Gondor", playCardOnTable("Horn of Gondor")),
      b.fp().characterDie(moveFelloswhip()),
      b.s().huntStory(rollHuntDice(6)),
      b.s().drawHuntTile("2")
    ]
  })
};

const hornOfGondor02: WotrSimulation = {
  id: "horn-of-gondor-02",
  name: "Horn of Gondor",
  description: hornOfGondor01.description + " and Horn of Gondor is discarded",
  loadDefinition: () => {
    const hornOfGondor01Def = hornOfGondor01.loadDefinition();
    return {
      setup: hornOfGondor01Def.setup,
      stories: (b: WotrStoriesBuilder) => [
        ...hornOfGondor01Def.stories(b),
        b.fp().huntStory(discardCardFromTable("Horn of Gondor"), corruptFellowship(1))
      ]
    };
  }
};

const hornOfGondor03: WotrSimulation = {
  id: "horn-of-gondor-03",
  name: "Horn of Gondor",
  description: "Boromir is eliminated from the fellowship",
  loadDefinition: () => ({
    setup: rules =>
      new WotrSetupBuilder(rules)
        .shuffledDecks()
        .fellowshipCompanions("gandalf-the-grey", "boromir")
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Horn of Gondor"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice(),
      b.fp().characterDieCard("Horn of Gondor", playCardOnTable("Horn of Gondor")),
      b.fp().characterDie(moveFelloswhip()),
      b.s().rollHuntDice(6),
      b.s().drawHuntTile("1"),
      b.fp().huntStory(chooseRandomCompanion("boromir")),
      b.fp().huntStory(eliminateCharacter("boromir"))
    ]
  })
};

const hornOfGondor04: WotrSimulation = {
  id: "horn-of-gondor-04",
  name: "Horn of Gondor",
  description: "Boromir is separated from the fellowship",
  loadDefinition: () => ({
    setup: rules =>
      new WotrSetupBuilder(rules)
        .shuffledDecks()
        .fellowshipCompanions("gandalf-the-grey", "boromir")
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Horn of Gondor"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(0),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice(),
      b.fp().characterDieCard("Horn of Gondor", playCardOnTable("Horn of Gondor")),
      b.fp().characterDie(separateCompanions("fords-of-bruinen", "boromir"))
    ]
  })
};

const hornOfGondor05: WotrSimulation = {
  id: "horn-of-gondor-05",
  name: "Horn of Gondor",
  description: "Legolas is separated from the fellowship",
  loadDefinition: () => ({
    setup: rules =>
      new WotrSetupBuilder(rules)
        .shuffledDecks()
        .fellowshipCompanions("gandalf-the-grey", "legolas", "boromir")
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Horn of Gondor"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(0),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice(),
      b.fp().characterDieCard("Horn of Gondor", playCardOnTable("Horn of Gondor")),
      b.fp().characterDie(separateCompanions("fords-of-bruinen", "legolas"))
    ]
  })
};

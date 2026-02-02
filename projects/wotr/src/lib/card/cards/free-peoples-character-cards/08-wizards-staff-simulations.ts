import {
  declareFellowship,
  moveFelloswhip,
  revealFellowship
} from "../../../fellowship/wotr-fellowship-actions";
import { rollHuntDice } from "../../../hunt/wotr-hunt-actions";
import { WotrSetupBuilder } from "../../../setup/wotr-setup-builder";
import { WotrSimulation } from "../../../simulation/wotr-simulation";
import { WotrStoriesBuilder } from "../../../simulation/wotr-story-builder";
import { playCardOnTable } from "../../wotr-card-actions";

export function wizardsStaff(): WotrSimulation[] {
  return [
    wizardsStaff01,
    wizardsStaff02,
    wizardsStaff03,
    wizardsStaff04,
    wizardsStaff05,
    wizardsStaff06,
    wizardsStaff07,
    wizardsStaff08
  ];
}

const wizardsStaff01: WotrSimulation = {
  id: "wizards-staff-01",
  name: "Wizard's Staff",
  description: "When a hunt tile is being drawn after a standard hunt in a region",
  loadDefinition: () => ({
    setup: rules => new WotrSetupBuilder(rules).shuffledDecks().build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Wizard's Staff"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice(),
      b.fp().characterDieCard("Wizard's Staff", playCardOnTable("Wizard's Staff")),
      b.fp().characterDie(moveFelloswhip()),
      b.s().huntStory(rollHuntDice(6))
    ]
  })
};

const wizardsStaff02: WotrSimulation = {
  id: "wizards-staff-02",
  name: "Wizard's Staff",
  description: "When a hunt tile is being drawn after a hunt in Mordor",
  loadDefinition: () => ({
    setup: rules => new WotrSetupBuilder(rules).shuffledDecks().fellowshipProgress(10).build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Wizard's Staff"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(declareFellowship("morannon")),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice(),
      b.fp().characterDieCard("Wizard's Staff", playCardOnTable("Wizard's Staff")),
      b.fp().characterDie(moveFelloswhip())
    ]
  })
};

const wizardsStaff03: WotrSimulation = {
  id: "wizards-staff-03",
  name: "Wizard's Staff",
  description: "When a hunt tile is being drawn after the Fellowship is revealed in a Stronghold",
  loadDefinition: () => ({
    setup: rules => new WotrSetupBuilder(rules).shuffledDecks().fellowshipProgress(4).build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Wizard's Staff"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice(),
      b.fp().characterDieCard("Wizard's Staff", playCardOnTable("Wizard's Staff")),
      b.fp().characterDie(moveFelloswhip()),
      b.s().huntStory(rollHuntDice(6)),
      b.fp().skipCardReaction("Wizard's Staff"),
      b.s().drawHuntTile("0r"),
      b.fp().huntStory(revealFellowship("parth-celebrant"))
    ]
  })
};

const wizardsStaff04: WotrSimulation = {
  id: "wizards-staff-04",
  name: "Wizard's Staff",
  description: "When a hunt tile is being drawn due to Orc Patrol",
  loadDefinition: () => ({
    setup: rules => new WotrSetupBuilder(rules).shuffledDecks().fellowshipProgress(1).build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Wizard's Staff"),
      b.s().firstPhaseDraw("Orc Patrol"),
      b.fp().fellowshipPhase(declareFellowship("fords-of-bruinen")),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character"),
      b.s().rollActionDice("character"),
      b.fp().characterDieCard("Wizard's Staff", playCardOnTable("Wizard's Staff")),
      b.s().characterDieCard("Orc Patrol")
    ]
  })
};

const wizardsStaff05: WotrSimulation = {
  id: "wizards-staff-05",
  name: "Wizard's Staff",
  description: "When a hunt tile is being drawn due to Isildur's Bane",
  loadDefinition: () => ({
    setup: rules => new WotrSetupBuilder(rules).shuffledDecks().fellowshipProgress(1).build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Wizard's Staff"),
      b.s().firstPhaseDraw("Isildur's Bane"),
      b.fp().fellowshipPhase(declareFellowship("fords-of-bruinen")),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character"),
      b.s().rollActionDice("character"),
      b.fp().characterDieCard("Wizard's Staff", playCardOnTable("Wizard's Staff")),
      b.s().characterDieCard("Isildur's Bane")
    ]
  })
};

const wizardsStaff06: WotrSimulation = {
  id: "wizards-staff-06",
  name: "Wizard's Staff",
  description: "When a hunt tile is being drawn due to Foul Thing from the Deep",
  loadDefinition: () => ({
    setup: rules => new WotrSetupBuilder(rules).shuffledDecks().fellowshipProgress(1).build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Wizard's Staff"),
      b.s().firstPhaseDraw("Foul Thing from the Deep"),
      b.fp().fellowshipPhase(declareFellowship("fords-of-bruinen")),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character"),
      b.s().rollActionDice("character"),
      b.fp().characterDieCard("Wizard's Staff", playCardOnTable("Wizard's Staff")),
      b.s().characterDieCard("Foul Thing from the Deep")
    ]
  })
};

const wizardsStaff07: WotrSimulation = {
  id: "wizards-staff-07",
  name: "Wizard's Staff",
  description: "When a hunt tile is being drawn due to The Breaking of the Fellowship",
  loadDefinition: () => ({
    setup: rules => new WotrSetupBuilder(rules).shuffledDecks().fellowshipProgress(0).build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Wizard's Staff"),
      b.s().firstPhaseDraw("The Breaking of the Fellowship"),
      b.fp().fellowshipPhase(declareFellowship("fords-of-bruinen")),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice("character"),
      b.fp().characterDieCard("Wizard's Staff", playCardOnTable("Wizard's Staff")),
      b.s().pass(),
      b.fp().characterDie(moveFelloswhip()),
      b.s().rollHuntDice(6),
      b.fp().skipCardReaction("Wizard's Staff"),
      b.s().drawHuntTile("0r"),
      b.fp().huntStory(revealFellowship("fords-of-bruinen")),
      b.s().characterDieCard("The Breaking of the Fellowship")
    ]
  })
};

const wizardsStaff08: WotrSimulation = {
  id: "wizards-staff-08",
  name: "Wizard's Staff",
  description: "When a hunt tile is being drawn due to Balrog of Moria",
  loadDefinition: () => ({
    setup: rules => new WotrSetupBuilder(rules).shuffledDecks().fellowshipProgress(2).build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Wizard's Staff"),
      b.s().firstPhaseDraw("Balrog of Moria"),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice("character"),
      b.fp().characterDieCard("Wizard's Staff", playCardOnTable("Wizard's Staff")),
      b.s().characterDieCard("Balrog of Moria", playCardOnTable("Balrog of Moria")),
      b.fp().characterDie(moveFelloswhip()),
      b.s().rollHuntDice(6),
      b.fp().skipCardReaction("Wizard's Staff"),
      b.s().drawHuntTile("0r"),
      b.fp().huntStory(revealFellowship("moria"))
    ]
  })
};

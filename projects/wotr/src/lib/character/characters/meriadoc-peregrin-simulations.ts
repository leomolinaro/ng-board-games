import { moveFelloswhip } from "../../fellowship/wotr-fellowship-actions";
import { WotrSetupBuilder } from "../../setup/wotr-setup-builder";
import { WotrSimulation } from "../../simulation/wotr-simulation";
import { WotrStoriesBuilder } from "../../simulation/wotr-story-builder";

export function meriadocPeregrinSimulations(): WotrSimulation[] {
  return [meriadocPeregrin01];
}

const meriadocPeregrin01: WotrSimulation = {
  id: "meriadoc-peregrin-01",
  name: "Meriadoc and Peregrin",
  description:
    "When Meriadoc and Peregrin are the last companions in the Fellowship and a 2 points hunt tile is drawn",
  loadDefinition: () => ({
    setup: rules =>
      new WotrSetupBuilder(rules).fellowshipCompanions("meriadoc", "peregrin").build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character"),
      b.s().rollActionDice(),
      b.fp().characterDie(moveFelloswhip()),
      b.s().rollHuntDice(6),
      b.s().drawHuntTile("2")
    ]
  })
};

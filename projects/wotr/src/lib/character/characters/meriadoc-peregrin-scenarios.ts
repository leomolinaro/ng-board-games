import { moveFelloswhip } from "../../fellowship/wotr-fellowship-actions";
import { WotrScenario } from "../../scenario/wotr-scenario";
import { WotrStoriesBuilder } from "../../scenario/wotr-story-builder";
import { WotrSetupBuilder } from "../../setup/wotr-setup-builder";

export function meriadocPeregrinScenarios(): WotrScenario[] {
  return [meriadocPeregrin01, meriadocPeregrin02];
}

const meriadocPeregrin01: WotrScenario = {
  id: "meriadoc-peregrin-01",
  name: "Meriadoc and Peregrin",
  description:
    "When Meriadoc and Peregrin are the last companions in the Fellowship and a 2 points hunt tile is drawn",
  loadDefinition: () => ({
    setup: rules =>
      new WotrSetupBuilder(rules)
        .fellowshipCompanions("meriadoc", "peregrin")
        .fellowshipGuide("meriadoc")
        .huntPool("2")
        .build(),
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

const meriadocPeregrin02: WotrScenario = {
  id: "meriadoc-peregrin-02",
  name: "Meriadoc and Peregrin",
  description:
    "When Meriadoc and Peregrin are the last companions in the Fellowship in Mordor and a 2 points hunt tile is drawn",
  loadDefinition: () => ({
    setup: rules =>
      new WotrSetupBuilder(rules)
        .fellowshipCompanions("meriadoc", "peregrin")
        .fellowshipGuide("meriadoc")
        .fellowshipRegion("minas-morgul")
        .huntPool("2")
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character"),
      b.s().rollActionDice(),
      b.fp().characterDie(moveFelloswhip()),
      b.s().drawHuntTile("2")
    ]
  })
};

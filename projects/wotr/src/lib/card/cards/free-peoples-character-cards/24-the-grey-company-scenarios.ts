import { separateCompanions } from "../../../fellowship/wotr-fellowship-actions";
import { WotrScenario } from "../../../scenario/wotr-scenario";
import { WotrStoriesBuilder } from "../../../scenario/wotr-story-builder";
import { WotrSetupBuilder } from "../../../setup/wotr-setup-builder";

export function theGreyCompany(): WotrScenario[] {
  return [theGreyCompany01];
}

const theGreyCompany01: WotrScenario = {
  id: "the-grey-company-01",
  name: "The Grey Company",
  description: "When The Grey Company can be played",
  loadDefinition: () => ({
    setup: rules =>
      new WotrSetupBuilder(rules)
        .shuffledDecks()
        .fellowshipCompanions("strider")
        .fellowshipGuide("strider")
        .region("bree", "north", { nRegulars: 2 })
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("The Grey Company"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice(),
      b.fp().characterDie(separateCompanions("bree", "strider"))
    ]
  })
};

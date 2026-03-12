import { separateCompanions } from "../../fellowship/wotr-fellowship-actions";
import { advanceNation } from "../../nation/wotr-nation-actions";
import { WotrScenario } from "../../scenario/wotr-scenario";
import { WotrStoriesBuilder } from "../../scenario/wotr-story-builder";
import { WotrSetupBuilder } from "../../setup/wotr-setup-builder";
import { playCharacter } from "../wotr-character-actions";

export function gandalfTheWhiteScenarios(): WotrScenario[] {
  return [gandalfTheWhite01];
}

const gandalfTheWhite01: WotrScenario = {
  id: "gandalf-the-white-01",
  name: "Gandalf the White",
  description:
    "When Gandalf the White is in play with other companions and a Character die is rolled",
  loadDefinition: () => ({
    setup: rules =>
      new WotrSetupBuilder(rules)
        .fellowshipCompanions("gandalf-the-grey", "legolas", "meriadoc")
        .fellowshipGuide("gandalf-the-grey")
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(0),
      b.fpT().rollActionDice("character", "character", "will-of-the-west"),
      b.s().rollActionDice("muster", "muster", "muster", "muster"),
      b
        .fp()
        .characterDie(
          separateCompanions("north-dunland", "gandalf-the-grey", "legolas", "meriadoc")
        ),
      b.s().musterDie(advanceNation("isengard", 1)),
      b.fp().pass(),
      b.s().musterDie(playCharacter("orthanc", "saruman")),
      b.fp().willOfTheWestDie(playCharacter("north-dunland", "gandalf-the-white")),
      b.s().musterDie()
    ]
  })
};

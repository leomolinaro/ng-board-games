import { advanceArmy, attack, retreatIntoSiege } from "../../../battle/wotr-battle-actions";
import { declareFellowship } from "../../../fellowship/wotr-fellowship-actions";
import { WotrScenario, WotrScenarioGroup } from "../../../scenario/wotr-scenario";
import { WotrStoriesBuilder } from "../../../scenario/wotr-story-builder";
import { playCardOnTable } from "../../wotr-card-actions";

export function balrogOfMoria(): WotrScenarioGroup {
  return {
    id: "balrog-of-moria",
    name: "Balrog of Moria",
    scenarios: [balrogOfMoria01, balrogOfMoria02]
  };
}

const balrogOfMoria01: WotrScenario = {
  id: "balrog-of-moria-01",
  name: "Balrog of Moria",
  description: "When The Fellowship is declared through Moria and the Balrog card is in play",
  loadDefinition: () => ({
    setup: setupBuilder => setupBuilder.shuffledDecks().fellowshipProgress(4).huntPool("1").build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw("Balrog of Moria"),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice(),
      b.s().rollActionDice("character"),
      b.s().characterDie(playCardOnTable("Balrog of Moria")),

      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(declareFellowship("dimrill-dale"))
    ]
  })
};

const balrogOfMoria02: WotrScenario = {
  id: "balrog-of-moria-02",
  name: "Balrog of Moria",
  description: "When the Balrog card is in play and the Shadow is battling near Moria",
  loadDefinition: () => ({
    setup: setupBuilder =>
      setupBuilder
        .shuffledDecks()
        .region("lorien", "elves", { nRegulars: 1 })
        .region("dimrill-dale", "sauron", { nRegulars: 1 })
        .nation("sauron", true, "atWar")
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw("Balrog of Moria"),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(0),
      b.fpT().rollActionDice(),
      b.s().rollActionDice("character", "army", "army"),
      b.s().characterDie(playCardOnTable("Balrog of Moria")),
      b.s().armyDie(attack("dimrill-dale", "lorien")),
      b.fp().battleStory(retreatIntoSiege("lorien")),
      b.s().battleStory(advanceArmy()),
      b.s().armyDie(attack("lorien", "lorien"))
    ]
  })
};

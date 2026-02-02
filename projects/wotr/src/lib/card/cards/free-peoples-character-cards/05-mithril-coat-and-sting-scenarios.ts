import { moveFelloswhip } from "../../../fellowship/wotr-fellowship-actions";
import { WotrScenario } from "../../../scenario/wotr-scenario";
import { WotrStoriesBuilder } from "../../../scenario/wotr-story-builder";
import { WotrSetupBuilder } from "../../../setup/wotr-setup-builder";
import { playCardOnTable } from "../../wotr-card-actions";

export function mithrilCoatAndStingScenarios(): WotrScenario[] {
  return [mithrilCoatAndSting01];
}

const mithrilCoatAndSting01: WotrScenario = {
  id: "mithril-coat-and-sting-01",
  name: "Mithril Coat and Sting",
  description: "When a hunt tile is drawn after a standard hunt",
  loadDefinition: () => ({
    setup: rules => new WotrSetupBuilder(rules).shuffledDecks().fellowshipProgress(0).build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw("Mithril Coat and Sting"),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice("character", "character"),
      b.s().rollActionDice(),
      b.fp().characterDieCard("Mithril Coat and Sting", playCardOnTable("Mithril Coat and Sting")),
      b.fp().characterDie(moveFelloswhip()),
      b.s().rollHuntDice(6),
      b.s().drawHuntTile("1")
    ]
  })
};

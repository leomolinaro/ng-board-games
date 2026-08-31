import {
  advanceArmy,
  attack,
  noCombatCard,
  retreatIntoSiege,
} from '../../../battle/wotr-battle-actions';
import type {
  WotrScenario,
  WotrScenarioGroup,
} from '../../../scenario/wotr-scenario';
import type { WotrStoriesBuilder } from '../../../scenario/wotr-story-builder';

export function helpUnlookedFor(): WotrScenarioGroup {
  return {
    id: 'help-unlooked-for',
    name: 'Help Unlooked For',
    scenarios: [helpUnlookedFor01],
  };
}

const helpUnlookedFor01: WotrScenario = {
  id: 'help-unlooked-for-01',
  name: 'Help Unlooked For',
  description:
    "When a Free Peoples stronghold is under siege, a friendly army is in an adjacent region and Help Unlooked For card is in Free Peoples' hand",
  loadDefinition: () => ({
    setup: (setupBuilder) =>
      setupBuilder
        .shuffledDecks()
        .region('minas-tirith', 'gondor', { nRegulars: 2 })
        .region('osgiliath', 'sauron', { nRegulars: 5 })
        .region('druadan-forest', 'rohan', { nRegulars: 2 })
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw('Help Unlooked For'),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice('event'),
      b.s().rollActionDice('army', 'army'),
      b.fp().pass(),
      b.s().armyDie(attack('osgiliath', 'minas-tirith')),
      b.fp().battleStory(retreatIntoSiege('minas-tirith')),
      b.s().battleStory(advanceArmy()),
      b
        .fp()
        .eventDieCard(
          'Help Unlooked For',
          attack('druadan-forest', 'minas-tirith'),
        ),
      b.fp().battleStory(noCombatCard()),
      b.s().battleStory(noCombatCard()),
    ],
  }),
};

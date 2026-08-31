import {
  advanceArmy,
  attack,
  continueBattle,
  noCombatCard,
  retreatIntoSiege,
  rollCombatDice,
} from '../../../battle/wotr-battle-actions';
import type {
  WotrScenario,
  WotrScenarioGroup,
} from '../../../scenario/wotr-scenario';
import type { WotrStoriesBuilder } from '../../../scenario/wotr-story-builder';
import { downgradeEliteUnit } from '../../../unit/wotr-unit-actions';

export function theFightingUrukHai(): WotrScenarioGroup {
  return {
    id: 'the-fighting-uruk-hai',
    name: 'The Fighting Uruk-hai',
    scenarios: [theFightingUrukHai01],
  };
}

const theFightingUrukHai01: WotrScenario = {
  id: 'the-fighting-uruk-hai-01',
  name: 'The Fighting Uruk-hai',
  description:
    "When Isengard is besieging a stronghold and The Fighting Uruk-hai card is in Shadow's hand",
  loadDefinition: () => ({
    setup: (setupBuilder) =>
      setupBuilder
        .shuffledDecks()
        .region('fords-of-isen', 'isengard', { nRegulars: 2, nElites: 1 })
        .region('helms-deep', 'rohan', { nRegulars: 2 })
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw('The Fighting Uruk-hai'),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice(),
      b.s().rollActionDice('army', 'army'),
      b.s().armyDie(attack('fords-of-isen', 'helms-deep')),
      b.fp().battleStory(retreatIntoSiege('helms-deep')),
      b.s().battleStory(advanceArmy()),
      b
        .s()
        .armyDieCard(
          'The Fighting Uruk-hai',
          attack('helms-deep', 'helms-deep'),
        ),
      b.s().battleStory(noCombatCard()),
      b.sT().battleStory(rollCombatDice(1, 1)),
      b.fp().battleStory(rollCombatDice(1, 1)),
      b.s().battleStory(noCombatCard()),
      b.fp().battleStory(noCombatCard()),
      b.sT().battleStory(rollCombatDice(1, 1)),
      b.fp().battleStory(rollCombatDice(1, 1)),
      b.s().battleStory(noCombatCard()),
      b.fp().battleStory(noCombatCard()),
      b.sT().battleStory(rollCombatDice(1, 1)),
      b.fp().battleStory(rollCombatDice(1, 1)),
      b
        .s()
        .battleStory(
          continueBattle('helms-deep'),
          downgradeEliteUnit('helms-deep', 'isengard', 1),
        ),
    ],
  }),
};

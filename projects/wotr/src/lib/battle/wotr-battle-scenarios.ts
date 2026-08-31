import type { WotrScenario, WotrScenarioGroup } from '../scenario/wotr-scenario';
import type { WotrStoriesBuilder } from '../scenario/wotr-story-builder';
import { eliminateRegularUnit } from '../unit/wotr-unit-actions';
import {
  attack,
  noCombatCard,
  retreatIntoSiege,
  rollCombatDice,
} from './wotr-battle-actions';

export function battleScenarios(): WotrScenarioGroup {
  return {
    id: 'battle',
    name: 'Battle',
    scenarios: [battle01, battle02],
  };
}

const battle01: WotrScenario = {
  id: 'battle-01',
  name: 'Battle 01',
  description:
    'When a field battle in a settlement is being won by the attacker',
  loadDefinition: () => ({
    setup: (setupBuilder) =>
      setupBuilder
        .region('bree', 'north', { nRegulars: 2 })
        .region('weather-hills', 'sauron', { nRegulars: 2 })
        .nation('sauron', true, 'atWar')
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice(),
      b.s().rollActionDice('army'),
      b.s().armyDie(attack('weather-hills', 'bree')),
      b.s().battleStory(noCombatCard()),
      b.fp().battleStory(noCombatCard()),
      b.sT().battleStory(rollCombatDice(5, 5)),
      b.fp().battleStory(rollCombatDice(4, 4)),
      b.fp().battleStory(eliminateRegularUnit('bree', 'north', 2)),
      // b.s().battleStory(notAdvanceArmy("bree"))
    ],
  }),
};

const battle02: WotrScenario = {
  id: 'battle-02',
  name: 'Battle 02',
  description: 'When the defending army retreats into a siege',
  loadDefinition: () => ({
    setup: (setupBuilder) =>
      setupBuilder
        .region('grey-havens', 'elves', { nRegulars: 2 })
        .region('tower-hills', 'sauron', { nRegulars: 2 })
        .nation('sauron', true, 'atWar')
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice(),
      b.s().rollActionDice('army'),
      b.s().armyDie(attack('tower-hills', 'grey-havens')),
      b.fp().battleStory(retreatIntoSiege('grey-havens')),
    ],
  }),
};

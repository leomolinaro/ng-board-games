import { WotrScenario, WotrScenarioGroup } from '../../scenario/wotr-scenario';
import { WotrStoriesBuilder } from '../../scenario/wotr-story-builder';
import {
  attack,
  combatCard,
  noCombatCard,
  reRollCombatDice,
  rollCombatDice,
} from '../wotr-battle-actions';

export function daringDefiance(): WotrScenarioGroup {
  return {
    id: 'daring-defiance',
    name: 'Daring Defiance',
    scenarios: [daringDefiance01],
  };
}

const daringDefiance01: WotrScenario = {
  id: 'daring-defiance-01',
  name: 'Daring Defiance',
  description:
    'When a battle with Companions is ongoing and Daring Defiance is in the Free Peoples hand',
  loadDefinition: () => ({
    setup: (setupBuilder) =>
      setupBuilder
        .shuffledDecks()
        .region('bree', 'north', { nRegulars: 1 })
        .characterInArmy('meriadoc', 'bree')
        .region('weather-hills', 'sauron', { nRegulars: 1 })
        // .characterInArmy("the-witch-king", "weather-hills")
        .nation('sauron', true, 'atWar')
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw('I Will Go Alone'),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(0),
      b.fpT().rollActionDice(),
      b.s().rollActionDice('character'),
      b.s().characterDie(attack('weather-hills', 'bree')),
      b.s().battleStory(noCombatCard()),
    ],
  }),
};

const bladeOfWesternesse02: WotrScenario = {
  id: 'blade-of-westernesse-02',
  name: 'Blade of Westernesse',
  description:
    'When a battle with Hobbits and Minions is ongoing and Blade of Westernesse is played and can be used',
  loadDefinition: () => ({
    setup: (setupBuilder) =>
      setupBuilder
        .shuffledDecks()
        .region('bree', 'north', { nRegulars: 2 })
        .characterInArmy('meriadoc', 'bree')
        .region('weather-hills', 'sauron', { nRegulars: 2 })
        .characterInArmy('the-witch-king', 'weather-hills')
        .nation('sauron', true, 'atWar')
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw('Mithril Coat and Sting'),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(0),
      b.fpT().rollActionDice(),
      b.s().rollActionDice('character'),
      b.s().characterDie(attack('weather-hills', 'bree')),
      b.s().battleStory(noCombatCard()),
      b.fp().battleStory(combatCard('Mithril Coat and Sting')),
      b.sT().battleStory(rollCombatDice(1, 1)),
      b.fp().battleStory(rollCombatDice(1, 5)),
      b.sT().battleStory(reRollCombatDice(2, 2)),
      b.fp().battleStory(reRollCombatDice(5)),
    ],
  }),
};

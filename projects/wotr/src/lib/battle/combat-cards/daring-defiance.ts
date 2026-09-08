import type {
  WotrScenario,
  WotrScenarioGroup,
} from '../../scenario/wotr-scenario';
import type { WotrStoriesBuilder } from '../../scenario/wotr-story-builder';
import { attack, noCombatCard } from '../wotr-battle-actions';

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

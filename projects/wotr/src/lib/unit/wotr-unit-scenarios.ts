import type { WotrScenario, WotrScenarioGroup } from '../scenario/wotr-scenario';
import type { WotrStoriesBuilder } from '../scenario/wotr-story-builder';

export function unitScenarios(): WotrScenarioGroup {
  return {
    id: 'unit-scenarios',
    name: 'Unit Scenarios',
    scenarios: [unitsMovement01],
  };
}

const unitsMovement01: WotrScenario = {
  id: 'units-movement-01',
  name: 'Units Movement',
  description: 'When a hunt tile is drawn after a standard hunt',
  loadDefinition: () => ({
    setup: (setupBuilder) =>
      setupBuilder
        .region('noman-lands', 'sauron', { nRegulars: 2 })
        .region('eastern-emyn-muil', 'sauron', { nRegulars: 2 })
        .build(),
    stories: (b: WotrStoriesBuilder) => [
      b.fpT().firstPhaseDraw(),
      b.s().firstPhaseDraw(),
      b.fp().fellowshipPhase(),
      b.s().huntAllocation(1),
      b.fpT().rollActionDice(),
      b.s().rollActionDice('army'),
    ],
  }),
};

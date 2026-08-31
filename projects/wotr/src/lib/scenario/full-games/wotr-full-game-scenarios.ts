import { WotrScenarioGroup } from '../wotr-scenario';
import { scenario as myGame1 } from './my-game-1';
import { scenario as myGame2 } from './my-game-2';
import { scenario as myGame3 } from './my-game-3';
import { scenario as myGame4 } from './my-game-4';
import { scenario as myGame5 } from './my-game-5';
import { scenario as myGame6 } from './my-game-6';
import { scenario as thereIsAnotherWay } from './there-is-another-way';
import { scenario as veryLateMinions } from './very-late-minions';

export function fullGameScenarios(): WotrScenarioGroup {
  return {
    id: 'full-game',
    name: 'Full Game',
    scenarios: [
      {
        id: 'very-late-minions',
        name: 'Very Late Minions',
        loadDefinition: () => veryLateMinions,
      },
      {
        id: 'there-is-another-way',
        name: 'There Is Another Way',
        loadDefinition: () => thereIsAnotherWay,
      },
      {
        id: 'my-game-1',
        name: 'My Game, February 2026',
        loadDefinition: () => myGame1,
      },
      {
        id: 'my-game-2',
        name: 'My Game, March 2026',
        loadDefinition: () => myGame2,
      },
      {
        id: 'my-game-3',
        name: 'My Game, April 2026',
        loadDefinition: () => myGame3,
      },
      {
        id: 'my-game-4',
        name: 'My Game, May 2026',
        loadDefinition: () => myGame4,
      },
      {
        id: 'my-game-5',
        name: 'My Game, June 2026',
        loadDefinition: () => myGame5,
      },
      {
        id: 'my-game-6',
        name: 'My Game, August 2026',
        loadDefinition: () => myGame6,
      },
    ],
  };
}

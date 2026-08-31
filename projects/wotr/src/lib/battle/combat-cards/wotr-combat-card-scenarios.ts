import type { WotrScenarioGroup } from '../../scenario/wotr-scenario';
import { bladeOfWesternesse } from './blade-of-westernesse-scenarios';
import { daringDefiance } from './daring-defiance';

export function combatCardScenarios(): WotrScenarioGroup {
  return {
    id: 'combat-cards',
    name: 'Combat Cards',
    scenarios: [bladeOfWesternesse(), daringDefiance()],
  };
}

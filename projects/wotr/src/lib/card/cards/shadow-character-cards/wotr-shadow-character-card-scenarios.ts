import type { WotrScenarioGroup } from '../../../scenario/wotr-scenario';
import { balrogOfMoria } from './17-balrog-of-moria';

export function shadowCharacterCardScenarios(): WotrScenarioGroup {
  return {
    id: 'shadow-character-cards',
    name: 'Shadow Character Cards',
    scenarios: [balrogOfMoria()],
  };
}

import type { WotrScenarioGroup } from '../../../scenario/wotr-scenario';
import { theFightingUrukHai } from './02-the-fighting-uruk-hai';
import { theShadowIsMoving } from './19-the-shadow-is-moving';

export function shadowStrategyCardScenarios(): WotrScenarioGroup {
  return {
    id: 'shadow-strategy-cards',
    name: 'Shadow Strategy Cards',
    scenarios: [theFightingUrukHai(), theShadowIsMoving()],
  };
}

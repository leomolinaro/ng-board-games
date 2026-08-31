import { WotrScenarioGroup } from '../scenario/wotr-scenario';
import { freePeoplesCharacterCardScenarios } from './cards/free-peoples-character-cards/wotr-free-peoples-character-card-scenarios';
import { freePeoplesStrategyCardScenarios } from './cards/free-peoples-strategy-cards/wotr-free-peoples-strategy-card-scenarios';
import { shadowCharacterCardScenarios } from './cards/shadow-character-cards/wotr-shadow-character-card-scenarios';
import { shadowStrategyCardScenarios } from './cards/shadow-strategy-cards/wotr-shadow-strategy-card-scenarios';

export function cardScenarios(): WotrScenarioGroup {
  return {
    id: 'cards',
    name: 'Cards',
    scenarios: [
      freePeoplesCharacterCardScenarios(),
      freePeoplesStrategyCardScenarios(),
      shadowCharacterCardScenarios(),
      shadowStrategyCardScenarios(),
    ],
  };
}

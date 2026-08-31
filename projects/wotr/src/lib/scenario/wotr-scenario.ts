import type { WotrGameOptions } from '../game/options/wotr-game-options';
import type { WotrStoryDoc } from '../game/wotr-story-models';
import type { WotrSetupBuilder } from '../setup/wotr-setup-builder';
import type { WotrSetup } from '../setup/wotr-setup-rules';
import type { WotrStoriesBuilder } from './wotr-story-builder';

export interface WotrScenarioGroup {
  id: string;
  name: string;
  scenarios: (WotrScenario | WotrScenarioGroup)[];
}

export interface WotrScenario {
  id: string;
  name: string;
  description?: string;
  loadDefinition: () => WotrScenarioDefinition;
}

export interface WotrScenarioDefinition {
  setup?: (setupBuilder: WotrSetupBuilder) => WotrSetup;
  options?: WotrGameOptions;
  stories: (builder: WotrStoriesBuilder) => WotrStoryDoc[];
}

export interface WotrScenarioGroupInfo {
  id: string;
  type: 'group';
  name: string;
  leafGroup: boolean;
  scenarios: (WotrScenarioInfo | WotrScenarioGroupInfo)[];
}

export interface WotrScenarioInfo {
  id: string;
  type: 'scenario';
  name: string;
  description?: string;
}

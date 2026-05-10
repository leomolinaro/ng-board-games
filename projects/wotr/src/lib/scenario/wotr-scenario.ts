import { WotrGameOptions } from "../game/options/wotr-game-options";
import { WotrStoryDoc } from "../game/wotr-story-models";
import { WotrSetup, WotrSetupRules } from "../setup/wotr-setup-rules";
import { WotrStoriesBuilder } from "./wotr-story-builder";

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
  setup?: (rules: WotrSetupRules) => WotrSetup;
  options?: WotrGameOptions;
  stories: (builder: WotrStoriesBuilder) => WotrStoryDoc[];
}

export interface WotrScenarioGroupInfo {
  id: string;
  type: "group";
  name: string;
  leafGroup: boolean;
  scenarios: (WotrScenarioInfo | WotrScenarioGroupInfo)[];
}

export interface WotrScenarioInfo {
  id: string;
  type: "scenario";
  name: string;
  description?: string;
}

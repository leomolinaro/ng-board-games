import { WotrStoryDoc } from "../game/wotr-story-models";
import { WotrSetup, WotrSetupRules } from "../setup/wotr-setup-rules";
import { WotrStoriesBuilder } from "./wotr-story-builder";

export interface WotrScenario {
  id: string;
  name: string;
  description?: string;
  loadDefinition: () => WotrScenarioDefinition;
}

export interface WotrScenarioDefinition {
  setup?: (rules: WotrSetupRules) => WotrSetup;
  stories: (builder: WotrStoriesBuilder) => WotrStoryDoc[];
}

export interface WotrScenarioInfo {
  id: string;
  name: string;
  description?: string;
}

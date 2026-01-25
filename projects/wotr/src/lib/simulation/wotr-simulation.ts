import { WotrStoryDoc } from "../game/wotr-story-models";
import { WotrSetup, WotrSetupRules } from "../setup/wotr-setup-rules";
import { WotrStoriesBuilder } from "./wotr-story-builder";

export interface WotrSimulation {
  id: string;
  name: string;
  description?: string;
  loadDefinition: () => WotrSimulationDefinition;
}

export interface WotrSimulationDefinition {
  setup?: (rules: WotrSetupRules) => WotrSetup;
  stories: (builder: WotrStoriesBuilder) => WotrStoryDoc[];
}

export interface WotrSimulationInfo {
  id: string;
  name: string;
  description?: string;
}

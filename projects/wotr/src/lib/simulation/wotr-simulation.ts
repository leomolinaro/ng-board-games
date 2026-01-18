import { WotrStoryDoc } from "../game/wotr-story-models";
import { WotrSetup, WotrSetupRules } from "../setup/wotr-setup-rules";

export interface WotrSimulation {
  id: string;
  name: string;
  loadDefinition: () => Promise<WotrSimulationDefinition>;
}

export interface WotrSimulationDefinition {
  setup?: (rules: WotrSetupRules) => WotrSetup;
  stories: WotrStoryDoc[];
}

export interface WotrSimulationInfo {
  id: string;
  name: string;
}

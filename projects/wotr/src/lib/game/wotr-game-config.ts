import { WotrSetup, WotrSetupRules } from "../setup/wotr-setup-rules";

export interface WotrGameConfig {
  setup?: (rules: WotrSetupRules) => WotrSetup;
}

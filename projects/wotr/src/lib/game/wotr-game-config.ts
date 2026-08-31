import type { WotrSetup, WotrSetupRules } from '../setup/wotr-setup-rules';
import type { WotrGameOptions } from './options/wotr-game-options';

export interface WotrGameConfig {
  setup?: (rules: WotrSetupRules) => WotrSetup;
  options?: WotrGameOptions;
}

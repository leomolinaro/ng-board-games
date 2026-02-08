import { WotrActionTokenOption } from "../../action-die/wotr-action-die-models";
import { WotrExpansionId, WotrVariantId } from "../../expansion/wotr-expansion-models";

export const DEFAULT_OPTIONS: WotrGameOptions = {
  tokens: [],
  expansions: [],
  variants: []
};

export interface WotrGameOptions {
  tokens: WotrActionTokenOption[];
  expansions: WotrExpansionId[];
  variants: WotrVariantId[];
}

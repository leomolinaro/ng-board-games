import { WotrAction } from "../commons/wotr-action-models";
import { WotrModifier } from "../commons/wotr-modifier";

export interface WotrAbility<H = unknown> {
  modifier: WotrModifier<H>;
  handler: H;
}

export interface WotrUiAbility<H = unknown> extends WotrAbility<H> {
  play: () => Promise<WotrAction[]>;
}

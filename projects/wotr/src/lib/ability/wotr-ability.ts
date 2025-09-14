import { WotrAction } from "../commons/wotr-action-models";
import { WotrModifier } from "../commons/wotr-modifier";

export interface WotrAbility<E = unknown> {
  modifier: WotrModifier<E>;
  handler: E;
  name?: string;
  activate?: () => Promise<void>;
}

export interface WotrUiAbility<E = unknown> extends WotrAbility<E> {
  play: () => Promise<WotrAction[]>;
}

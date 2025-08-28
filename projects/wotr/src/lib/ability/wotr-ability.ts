import { WotrModifier } from "../commons/wotr-modifier";

export interface WotrAbility<E = unknown> {
  modifier: WotrModifier<E>;
  handler: E;
}

import type { WotrAction } from '../commons/wotr-action-models';
import type { WotrModifier } from '../commons/wotr-modifier';
import type { WotrGameUiContext } from '../game/wotr-game-ui-context';

export interface WotrAbility<H = unknown> {
  modifier: WotrModifier<H>;
  handler: H;
  destroy?: () => void;
}

export interface WotrUiAbility<H = unknown> extends WotrAbility<H> {
  play: (ui: WotrGameUiContext) => Promise<WotrAction[]>;
}

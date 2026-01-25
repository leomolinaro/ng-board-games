import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrUiChoice } from "../game/wotr-game-ui";
import { WotrHuntEffectParams, WotrHuntTileId } from "./wotr-hunt-models";

export class WotrHuntRollModifiers {
  rollModifiers: number[] = [];
  reRollModifiers: number[] = [];
}
export type WotrBeforeHuntRoll = (modifiers: WotrHuntRollModifiers) => Promise<void>;

export type WotrHuntDrawPrevented = () => Promise<boolean>;

export type WotrAfterTileDrawn = (tile: WotrHuntTileId) => Promise<WotrHuntTileId>;

export type WotrHuntEffectChoiceModifier = (
  params: WotrHuntEffectParams
) => WotrUiChoice<WotrHuntEffectParams>[];

@Injectable()
export class WotrHuntModifiers {
  public readonly beforeHuntRoll = new WotrModifier<WotrBeforeHuntRoll>();
  public async onBeforeHuntRoll(modifiers: WotrHuntRollModifiers): Promise<void> {
    for (const handler of this.beforeHuntRoll.get()) {
      await handler(modifiers);
    }
  }

  public readonly huntDrawPrevented = new WotrModifier<WotrHuntDrawPrevented>();
  public couldHuntDrawBePrevented(): boolean {
    return this.huntDrawPrevented.get().length > 0;
  }
  public async isHuntDrawPrevented(): Promise<boolean> {
    for (const handler of this.huntDrawPrevented.get()) {
      if (await handler()) {
        return true;
      }
    }
    return false;
  }

  public readonly afterTileDrawn = new WotrModifier<WotrAfterTileDrawn>();
  async onAfterTileDrawn(tile: WotrHuntTileId): Promise<WotrHuntTileId> {
    if (!this.afterTileDrawn.get().length) return tile;
    for (const handler of this.afterTileDrawn.get()) {
      tile = await handler(tile);
    }
    return tile;
  }

  public readonly huntEffectChoices = new WotrModifier<WotrHuntEffectChoiceModifier>();
  public getHuntEffectChoices(params: WotrHuntEffectParams): WotrUiChoice<WotrHuntEffectParams>[] {
    return this.huntEffectChoices
      .get()
      .reduce<
        WotrUiChoice<WotrHuntEffectParams>[]
      >((choices, modifier) => choices.concat(modifier(params)), []);
  }

  clear() {
    this.afterTileDrawn.clear();
    this.huntEffectChoices.clear();
    this.beforeHuntRoll.clear();
  }
}

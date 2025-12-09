import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrUiChoice } from "../game/wotr-game-ui";
import { WotrHuntEffectParams, WotrHuntTileId } from "./wotr-hunt-models";

export type WotrAfterTileDrawn = (tile: WotrHuntTileId) => Promise<WotrHuntTileId>;

export type WotrHuntEffectChoiceModifier = (
  params: WotrHuntEffectParams
) => WotrUiChoice<WotrHuntEffectParams>[];

@Injectable({ providedIn: "root" })
export class WotrHuntModifiers {
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
  }
}

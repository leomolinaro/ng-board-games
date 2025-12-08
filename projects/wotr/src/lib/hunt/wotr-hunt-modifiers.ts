import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrHuntTileId } from "./wotr-hunt-models";

export type WotrAfterTileDrawn = (tile: WotrHuntTileId) => Promise<WotrHuntTileId>;

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

  clear() {
    this.afterTileDrawn.clear();
  }
}

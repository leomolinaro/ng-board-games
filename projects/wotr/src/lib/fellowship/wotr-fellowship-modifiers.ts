import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrRegionId } from "../region/wotr-region-models";

export type WotrAfterFellowshipDeclaration = (regionId: WotrRegionId) => Promise<void>;

@Injectable({ providedIn: "root" })
export class WotrFellowshipModifiers {
  public readonly afterDeclaration = new WotrModifier<WotrAfterFellowshipDeclaration>();
  async onAfterFellowshipDeclaration(regionId: WotrRegionId): Promise<void> {
    if (!this.afterDeclaration.get().length) return;
    for (const handler of this.afterDeclaration.get()) {
      await handler(regionId);
    }
  }

  clear() {
    this.afterDeclaration.clear();
  }
}

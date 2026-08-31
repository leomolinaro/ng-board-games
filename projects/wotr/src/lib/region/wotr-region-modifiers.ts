import { Injectable } from '@angular/core';
import { WotrModifier } from '../commons/wotr-modifier';
import type { WotrFrontId } from '../front/wotr-front-models';
import type { WotrRegionId } from './wotr-region-models';

export type WotrAfterRegionControlChange = (
  regionId: WotrRegionId,
  frontId: WotrFrontId,
) => void;

@Injectable()
export class WotrRegionModifiers {
  public readonly afterRegionControlChange =
    new WotrModifier<WotrAfterRegionControlChange>();
  public onAfterRegionControlChange(
    regionId: WotrRegionId,
    frontId: WotrFrontId,
  ): void {
    this.afterRegionControlChange
      .get()
      .forEach((handler) => handler(regionId, frontId));
  }

  clear() {
    this.afterRegionControlChange.clear();
  }
}

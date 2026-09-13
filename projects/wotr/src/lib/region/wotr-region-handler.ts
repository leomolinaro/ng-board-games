import { Injectable, inject } from '@angular/core';
import type {
  WotrActionApplierMap,
  WotrActionLoggerMap,
} from '../commons/wotr-action-models';
import { WotrActionRegistry } from '../commons/wotr-action-registry';
import type { WotrFrontId } from '../front/wotr-front-models';
import type { WotrRegionAction } from './wotr-region-actions';
import type { WotrRegionId } from './wotr-region-models';
import { WotrRegionModifiers } from './wotr-region-modifiers';
import { WotrRegionStore } from './wotr-region-store';

@Injectable()
export class WotrRegionHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private regionStore = inject(WotrRegionStore);
  private regionModifiers = inject(WotrRegionModifiers);

  init(): void {
    this.actionRegistry.registerActions(this.getActionAppliers());
    this.actionRegistry.registerActionLoggers(this.getActionLoggers());
  }

  getActionAppliers(): WotrActionApplierMap<WotrRegionAction> {
    return {
      'region-choose': () => {
        /*empty*/
      },
    };
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrRegionAction> {
    return {
      'region-choose': (action, front, f) => [
        f.player(front),
        ' chooses ',
        f.region(action.region),
      ],
    };
  }

  setControlledBy(front: WotrFrontId, regionId: WotrRegionId): void {
    this.regionStore.setControlledBy(front, regionId);
    this.regionModifiers.onAfterRegionControlChange(regionId, front);
  }
}

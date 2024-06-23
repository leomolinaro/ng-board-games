import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrRegionAction } from "./wotr-region-actions";

@Injectable ()
export class WotrRegionActionsService {
  
  constructor () {
    this.actionService.registerActions (this.getActionAppliers () as any);
  }

  private actionService = inject (WotrActionService);
  
  getActionAppliers (): WotrActionApplierMap<WotrRegionAction> {
    return {
      "region-choose": async (action, front) => { /*empty*/ }
    };
  }

}

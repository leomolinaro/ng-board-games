import { Injectable } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrRegionAction } from "./wotr-region-actions";

@Injectable ()
export class WotrRegionActionsService {

  getActionAppliers (): WotrActionApplierMap<WotrRegionAction> {
    return {
      "region-choose": async (action, front) => { /*empty*/ }
    };
  }

}

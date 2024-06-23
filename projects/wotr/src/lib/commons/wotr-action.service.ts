import { Injectable } from "@angular/core";
import { objectUtil } from "@leobg/commons/utils";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrAction, WotrActionApplier } from "./wotr-action.models";

@Injectable ()
export class WotrActionService {

  private actionAppliers: Map<string, WotrActionApplier<WotrAction>> = new Map ();

  registerActions (actionAppliers: Record<string, WotrActionApplier<WotrAction>>) {
    objectUtil.forEachProp (actionAppliers, (actionType, actionApplier) => this.actionAppliers.set (actionType, actionApplier));
  }

  async applyAction (action: WotrAction, frontId: WotrFrontId) {
    const actionApplier = this.actionAppliers.get (action.type);
    if (!actionApplier) { throw new Error (`Unknown action ${action.type}`); }
    await actionApplier (action, frontId);
  }

}

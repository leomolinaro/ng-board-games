import { Injectable } from "@angular/core";
import { objectUtil } from "@leobg/commons/utils";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrAction, WotrActionApplier, WotrActionLogger, WotrFragmentCreator } from "./wotr-action.models";

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

  private actionLoggers: Map<string, WotrActionLogger<WotrAction>> = new Map ();

  registerActionLoggers (actionLoggers: Record<string, WotrActionLogger<WotrAction>>) {
    objectUtil.forEachProp (actionLoggers, (actionType, actionLogger) => this.actionLoggers.set (actionType, actionLogger));
  }

  getActionLogFragments<F> (action: WotrAction, front: WotrFrontId, fragmentCreator: WotrFragmentCreator<F>): (F | string)[] {
    const actionLogger = this.actionLoggers.get (action.type);
    if (!actionLogger) { throw new Error (`Unknown action log ${action.type}`); }
    return actionLogger (action, front, fragmentCreator);
  }

}

import { Injectable, inject } from "@angular/core";
import { objectUtil } from "@leobg/commons/utils";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrAction, WotrActionApplier, WotrActionLogger, WotrEffectLogger, WotrFragmentCreator } from "./wotr-action.models";
import { WotrEventService } from "./wotr-event.service";

@Injectable ()
export class WotrActionService {

  private eventService = inject (WotrEventService);

  private actionAppliers: Map<string, WotrActionApplier<WotrAction>> = new Map ();

  registerActions (actionAppliers: Record<string, WotrActionApplier<WotrAction>>) {
    objectUtil.forEachProp (actionAppliers, (actionType, actionApplier) => this.actionAppliers.set (actionType, actionApplier));
  }

  registerAction<A extends WotrAction> (actionType: A["type"], actionApplier: WotrActionApplier<A>) {
    this.actionAppliers.set (actionType, actionApplier as any);
  }

  async applyAction (action: WotrAction, frontId: WotrFrontId) {
    const actionApplier = this.actionAppliers.get (action.type);
    if (actionApplier) { await actionApplier (action, frontId); }
    await this.eventService.publish (action);
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

  private effectLoggers: Map<string, WotrEffectLogger<WotrAction>> = new Map ();

  registerEffectLoggers (effectLoggers: Record<string, WotrEffectLogger<WotrAction>>) {
    objectUtil.forEachProp (effectLoggers, (effectType, effectLogger) => this.effectLoggers.set (effectType, effectLogger));
  }

  getEffectLogFragments<F> (effect: WotrAction, fragmentCreator: WotrFragmentCreator<F>): (F | string)[] {
    const effectLogger = this.effectLoggers.get (effect.type);
    if (!effectLogger) { throw new Error (`Unknown effect log ${effect.type}`); }
    return effectLogger (effect, fragmentCreator);  }

}

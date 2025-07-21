import { Injectable, inject } from "@angular/core";
import { objectUtil } from "@leobg/commons/utils";
import { WotrFrontId } from "../front/wotr-front-models";
import {
  WotrAction,
  WotrActionApplier,
  WotrActionLogger,
  WotrEffectLogger,
  WotrFragmentCreator,
  WotrStory,
  WotrStoryApplier
} from "./wotr-action-models";
import { WotrEventService } from "./wotr-event-service";

@Injectable({ providedIn: "root" })
export class WotrActionService {
  private eventService = inject(WotrEventService);

  private actionAppliers: Map<string, WotrActionApplier<WotrAction>> = new Map();
  private storyAppliers: Map<string, WotrStoryApplier<WotrStory>> = new Map();
  private actionLoggers: Map<string, WotrActionLogger<WotrAction>> = new Map();
  private effectLoggers: Map<string, WotrEffectLogger<WotrAction>> = new Map();

  clear() {
    this.actionAppliers.clear();
    this.storyAppliers.clear();
    this.actionLoggers.clear();
    this.effectLoggers.clear();
  }

  registerActions(actionAppliers: Record<string, WotrActionApplier<WotrAction>>) {
    objectUtil.forEachProp(actionAppliers, (actionType, actionApplier) =>
      this.actionAppliers.set(actionType, actionApplier)
    );
  }

  registerAction<A extends WotrAction>(actionType: A["type"], actionApplier: WotrActionApplier<A>) {
    this.actionAppliers.set(actionType, actionApplier as any);
  }

  async applyAction(action: WotrAction, frontId: WotrFrontId) {
    const actionApplier = this.actionAppliers.get(action.type);
    if (actionApplier) {
      await actionApplier(action, frontId);
    }
    await this.eventService.publish(action);
  }

  registerStory<S extends WotrStory>(storyType: S["type"], storyApplier: WotrStoryApplier<S>) {
    this.storyAppliers.set(storyType, storyApplier as any);
  }

  async applyStory(story: WotrStory, frontId: WotrFrontId) {
    const storyApplier = this.storyAppliers.get(story.type);
    if (!storyApplier) {
      throw new Error(`Unknown story applier ${story.type}`);
    }
    await storyApplier(story, frontId);
  }

  registerActionLoggers(actionLoggers: Record<string, WotrActionLogger<WotrAction>>) {
    objectUtil.forEachProp(actionLoggers, (actionType, actionLogger) =>
      this.actionLoggers.set(actionType, actionLogger)
    );
  }

  getActionLogFragments<F>(
    action: WotrAction,
    front: WotrFrontId,
    fragmentCreator: WotrFragmentCreator<F>
  ): (F | string)[] {
    const actionLogger = this.actionLoggers.get(action.type);
    if (!actionLogger) {
      throw new Error(`Unknown action log ${action.type}`);
    }
    return actionLogger(action, front, fragmentCreator);
  }

  registerEffectLoggers(effectLoggers: Record<string, WotrEffectLogger<WotrAction>>) {
    objectUtil.forEachProp(effectLoggers, (effectType, effectLogger) =>
      this.effectLoggers.set(effectType, effectLogger)
    );
  }

  getEffectLogFragments<F>(
    effect: WotrAction,
    fragmentCreator: WotrFragmentCreator<F>
  ): (F | string)[] {
    const effectLogger = this.effectLoggers.get(effect.type);
    if (!effectLogger) {
      throw new Error(`Unknown effect log ${effect.type}`);
    }
    return effectLogger(effect, fragmentCreator);
  }
}

import { Injectable } from '@angular/core';
import { objectUtil } from '@leobg/commons/utils';
import type { WotrFrontId } from '../front/wotr-front-models';
import type { WotrLogFragment } from '../log/wotr-log-models';
import type {
  WotrAction,
  WotrActionApplier,
  WotrActionApplierMap,
  WotrActionLogger,
  WotrActionLoggerMap,
  WotrEffectLogger,
  WotrFragmentCreator,
  WotrStory,
  WotrStoryApplier,
} from './wotr-action-models';

@Injectable()
export class WotrActionRegistry {
  private actionAppliers = new Map<string, WotrActionApplier<WotrAction>>();
  private storyAppliers = new Map<string, WotrStoryApplier<WotrStory>>();
  private actionLoggers = new Map<string, WotrActionLogger<WotrAction>>();
  private effectLoggers = new Map<string, WotrEffectLogger<WotrAction>>();

  clear(): void {
    this.actionAppliers.clear();
    this.storyAppliers.clear();
    this.actionLoggers.clear();
    this.effectLoggers.clear();
  }

  registerActions<A extends WotrAction>(
    actionAppliers: WotrActionApplierMap<A>,
  ): void {
    for (const [actionType, value] of Object.entries(
      actionAppliers as WotrActionApplierMap<WotrAction>,
    )) {
      this.actionAppliers.set(actionType, value);
    }
  }

  registerAction<A extends WotrAction>(
    actionType: A['type'],
    actionApplier: WotrActionApplier<A>,
    actionLogger?: WotrActionLogger<A>,
  ): void {
    this.actionAppliers.set(
      actionType,
      actionApplier as WotrActionApplier<WotrAction>,
    );
    if (actionLogger)
      this.actionLoggers.set(
        actionType,
        actionLogger as WotrActionLogger<WotrAction>,
      );
  }

  async applyAction(action: WotrAction, frontId: WotrFrontId): Promise<void> {
    const actionApplier = this.actionAppliers.get(action.type);
    if (actionApplier) await actionApplier(action, frontId);
  }

  registerStory<S extends WotrStory>(
    storyType: S['type'],
    storyApplier: WotrStoryApplier<S>,
  ): void {
    this.storyAppliers.set(
      storyType,
      storyApplier as WotrStoryApplier<WotrStory>,
    );
  }

  async applyStory(story: WotrStory, frontId: WotrFrontId): Promise<void> {
    const storyApplier = this.storyAppliers.get(story.type);
    if (!storyApplier) throw new Error(`Unknown story applier ${story.type}`);
    await storyApplier(story, frontId);
  }

  registerActionLoggers<A extends WotrAction>(
    actionLoggers: WotrActionLoggerMap<A>,
  ): void {
    objectUtil.forEachProp<string, WotrActionLogger<WotrAction>>(
      actionLoggers as unknown as Record<string, WotrActionLogger<WotrAction>>,
      (actionType, actionLogger: WotrActionLogger<WotrAction>) =>
        this.actionLoggers.set(actionType, actionLogger),
    );
  }

  getActionLogFragments(
    action: WotrAction,
    front: WotrFrontId,
    fragmentCreator: WotrFragmentCreator,
  ): WotrLogFragment[] {
    const actionLogger = this.actionLoggers.get(action.type);
    if (!actionLogger) throw new Error(`Unknown action log ${action.type}`);
    return actionLogger(action, front, fragmentCreator);
  }

  registerEffectLogger<A extends WotrAction>(
    effectType: A['type'],
    effectLogger: WotrEffectLogger<A>,
  ): void {
    this.effectLoggers.set(
      effectType,
      effectLogger as WotrEffectLogger<WotrAction>,
    );
  }

  getEffectLogFragments(
    effect: WotrAction,
    fragmentCreator: WotrFragmentCreator,
  ): WotrLogFragment[] {
    const effectLogger = this.effectLoggers.get(effect.type);
    if (!effectLogger) throw new Error(`Unknown effect log ${effect.type}`);
    return effectLogger(effect, fragmentCreator);
  }
}

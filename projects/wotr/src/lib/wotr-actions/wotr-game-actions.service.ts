import { Injectable, inject } from "@angular/core";
import { from, of } from "rxjs";
import { WotrCardId } from "../wotr-elements/card/wotr-card.models";
import { WotrCompanionStore } from "../wotr-elements/companion/wotr-companion.store";
import { WotrFrontId } from "../wotr-elements/front/wotr-front.models";
import { WotrFrontStore } from "../wotr-elements/front/wotr-front.store";
import { WotrHuntStore } from "../wotr-elements/hunt/wotr-hunt.store";
import { WotrLogStore } from "../wotr-elements/log/wotr-log.store";
import { WotrActionDie, WotrActionToken } from "../wotr-elements/wotr-dice.models";
import { WotrStoryService } from "../wotr-game/wotr-story.service";
import { WotrRulesService } from "../wotr-rules/wotr-rules.service";
import { WotrAction, WotrStory } from "../wotr-story.models";
import { WotrActionDieActionsService } from "./action-die/wotr-action-die-actions.service";
import { WotrArmyActionsService } from "./army/wotr-army-actions.service";
import { WotrArmyEffectsService } from "./army/wotr-army-effects.service";
import { WotrCardActionsService } from "./card/wotr-card-actions.service";
import { WotrCombatActionsService } from "./combat/wotr-combat-actions.service";
import { WotrCompanionActionsService } from "./companion/wotr-companion-actions.service";
import { WotrCompanionEffectsService } from "./companion/wotr-companion-effects.service";
import { WotrFellowshipActionsService } from "./fellowship/wotr-fellowship-actions.service";
import { WotrFellowshipEffectsService } from "./fellowship/wotr-fellowship-effects.service";
import { WotrHuntActionsService } from "./hunt/wotr-hunt-actions.service";
import { WotrMinionActionsService } from "./minion/wotr-minion-actions.service";
import { WotrPoliticalActionsService } from "./political/wotr-political-actions.service";
import { WotrActionApplier } from "./wotr-action-applier";
import { WotrEffectGetter } from "./wotr-effect-getter";

@Injectable ()
export class WotrGameActionsService {

  private cardActions = inject (WotrCardActionsService);
  private fellowshipActions = inject (WotrFellowshipActionsService);
  private fellowshipEffects = inject (WotrFellowshipEffectsService);
  private huntActions = inject (WotrHuntActionsService);
  private actionDiceActions = inject (WotrActionDieActionsService);
  private companionActions = inject (WotrCompanionActionsService);
  private companionEffects = inject (WotrCompanionEffectsService);
  private minionActions = inject (WotrMinionActionsService);
  private armyActions = inject (WotrArmyActionsService);
  private armyEffects = inject (WotrArmyEffectsService);
  private politicalActions = inject (WotrPoliticalActionsService);
  private combatActions = inject (WotrCombatActionsService);
  private logStore = inject (WotrLogStore);
  private frontStore = inject (WotrFrontStore);
  private huntStore = inject (WotrHuntStore);
  private companionStore = inject (WotrCompanionStore);
  private rules = inject (WotrRulesService);
  private story = inject (WotrStoryService);

  private actionAppliers: Record<WotrAction["type"], WotrActionApplier<WotrAction>> = {
    ...this.cardActions.getActionAppliers (),
    ...this.fellowshipActions.getActionAppliers (),
    ...this.huntActions.getActionAppliers (),
    ...this.actionDiceActions.getActionAppliers (),
    ...this.companionActions.getActionAppliers (),
    ...this.minionActions.getActionAppliers (),
    ...this.armyActions.getActionAppliers (),
    ...this.politicalActions.getActionAppliers (),
    ...this.combatActions.getActionAppliers (),
  } as any;

  private effectGetters: Record<WotrAction["type"], WotrEffectGetter<WotrAction>> = {
    ...this.fellowshipEffects.getEffectGetters (),
    ...this.companionEffects.getEffectGetters (),
    ...this.armyEffects.getEffectGetters ()
  } as any;

  private applyAction (action: WotrAction, frontId: WotrFrontId) {
    this.actionAppliers[action.type] (action, frontId);
  }

  private async actionEffect (action: WotrAction, story: WotrStory, front: WotrFrontId) {
    return this.effectGetters[action.type]?. (action, front, this) || of (void 0);
  }

  applyStory$ (story: WotrStory, frontId: WotrFrontId) {
    return from (this.applyStory (story, frontId));
  }

  async applyStory (story: WotrStory, frontId: WotrFrontId) {
    story.actions.forEach (action => {
      this.logStore.logAction (action, frontId);
      this.applyAction (action, frontId);
    });
    await this.storyEffect (story, frontId);
  }

  async applyCardStory (story: WotrStory, cardId: WotrCardId, frontId: WotrFrontId) {
    story.actions.forEach (action => {
      this.logStore.logCardAction (action, cardId, frontId);
      this.applyAction (action, frontId);
    });
    await this.storyEffect (story, frontId);
  }

  async applyDieStory (die: WotrActionDie, story: WotrStory, frontId: WotrFrontId) {
    story.actions.forEach (action => {
      this.logStore.logDieAction (action, die, frontId);
      this.applyAction (action, frontId);
    });
    this.frontStore.removeActionDie (die, frontId);
    await this.storyEffect (story, frontId);
  }

  async applyDieCardStory (die: WotrActionDie, card: WotrCardId, story: WotrStory, frontId: WotrFrontId) {
    story.actions.forEach (action => {
      this.logStore.logDieCardAction (action, die, card, frontId);
      this.applyAction (action, frontId);
    });
    this.frontStore.removeActionDie (die, frontId);
    this.frontStore.discardCards ([card], frontId);
    await this.storyEffect (story, frontId);
  }

  async applyTokenStory (token: WotrActionToken, story: WotrStory, frontId: WotrFrontId) {
    story.actions.forEach (action => {
      this.logStore.logTokenAction (action, token, frontId);
      this.applyAction (action, frontId);
    });
    this.frontStore.removeActionToken (token, frontId);
    await this.storyEffect (story, frontId);
  }

  private async storyEffect (story: WotrStory, front: WotrFrontId) {
    for (const action of story.actions) {
      await this.actionEffect (action, story, front);
    }
  }

}

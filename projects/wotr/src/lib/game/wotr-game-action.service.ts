import { Injectable, inject } from "@angular/core";
import { WotrActionDieActionsService } from "../action-die/wotr-action-die-actions.service";
import { WotrArmyActionsService } from "../army/wotr-army-actions.service";
import { WotrArmyEffectsService } from "../army/wotr-army-effects.service";
import { WotrCombatActionsService } from "../battle/wotr-combat-actions.service";
import { WotrCardActionsService } from "../card/wotr-card-actions.service";
import { WotrCompanionActionsService } from "../companion/wotr-companion-actions.service";
import { WotrCompanionEffectsService } from "../companion/wotr-companion-effects.service";
import { WotrFellowshipActionsService } from "../fellowship/wotr-fellowship-actions.service";
import { WotrFellowshipEffectsService } from "../fellowship/wotr-fellowship-effects.service";
import { WotrHuntActionsService } from "../hunt/wotr-hunt-actions.service";
import { WotrMinionActionsService } from "../minion/wotr-minion-actions.service";
import { WotrPoliticalActionsService } from "../nation/wotr-political-actions.service";
import { WotrStoryService } from "./wotr-story.service";

@Injectable ()
export class WotrGameActionService {

  private storyService = inject (WotrStoryService);

  private cardActions = inject (WotrCardActionsService);
  private fellowshipActions = inject (WotrFellowshipActionsService);
  private huntActions = inject (WotrHuntActionsService);
  private actionDiceActions = inject (WotrActionDieActionsService);
  private companionActions = inject (WotrCompanionActionsService);
  private minionActions = inject (WotrMinionActionsService);
  private armyActions = inject (WotrArmyActionsService);
  private politicalActions = inject (WotrPoliticalActionsService);
  private combatActions = inject (WotrCombatActionsService);

  private fellowshipEffects = inject (WotrFellowshipEffectsService);
  private companionEffects = inject (WotrCompanionEffectsService);
  private armyEffects = inject (WotrArmyEffectsService);

  registerActions () {
    this.storyService.registerActions ({
      ...this.cardActions.getActionAppliers (),
      ...this.fellowshipActions.getActionAppliers (),
      ...this.huntActions.getActionAppliers (),
      ...this.actionDiceActions.getActionAppliers (),
      ...this.companionActions.getActionAppliers (),
      ...this.minionActions.getActionAppliers (),
      ...this.armyActions.getActionAppliers (),
      ...this.politicalActions.getActionAppliers (),
      ...this.combatActions.getActionAppliers (),
    } as any);
    this.storyService.registerActionEffects ({
      ...this.fellowshipEffects.getActionEffects (),
      ...this.companionEffects.getActionEffects (),
      ...this.armyEffects.getActionEffects ()
    } as any);
  }

}

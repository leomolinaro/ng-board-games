import { Injectable, inject } from "@angular/core";
import { WotrActionDieActionsService } from "../wotr-actions/action-die/wotr-action-die-actions.service";
import { WotrArmyActionsService } from "../wotr-actions/army/wotr-army-actions.service";
import { WotrArmyEffectsService } from "../wotr-actions/army/wotr-army-effects.service";
import { WotrCardActionsService } from "../wotr-actions/card/wotr-card-actions.service";
import { WotrCombatActionsService } from "../wotr-actions/combat/wotr-combat-actions.service";
import { WotrCompanionActionsService } from "../wotr-actions/companion/wotr-companion-actions.service";
import { WotrCompanionEffectsService } from "../wotr-actions/companion/wotr-companion-effects.service";
import { WotrFellowshipActionsService } from "../wotr-actions/fellowship/wotr-fellowship-actions.service";
import { WotrFellowshipEffectsService } from "../wotr-actions/fellowship/wotr-fellowship-effects.service";
import { WotrHuntActionsService } from "../wotr-actions/hunt/wotr-hunt-actions.service";
import { WotrMinionActionsService } from "../wotr-actions/minion/wotr-minion-actions.service";
import { WotrPoliticalActionsService } from "../wotr-actions/political/wotr-political-actions.service";
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

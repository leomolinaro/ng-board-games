import { Injectable, inject } from "@angular/core";
import { WotrFrontId } from "../wotr-elements/wotr-front.models";
import { WotrAction } from "../wotr-story.models";
import { WotrActionApplier } from "./wotr-action-applier";
import { WotrActionDieActionsService } from "./wotr-action-die-actions.service";
import { WotrArmyActionsService } from "./wotr-army-actions.service";
import { WotrCardActionsService } from "./wotr-card-actions.service";
import { WotrCombatActionsService } from "./wotr-combat-actions.service";
import { WotrCompanionActionsService } from "./wotr-companion-actions.service";
import { WotrFellowshipActionsService } from "./wotr-fellowship-actions.service";
import { WotrHuntActionsService } from "./wotr-hunt-actions.service";
import { WotrMinionActionsService } from "./wotr-minion-actions.service";
import { WotrPoliticalActionsService } from "./wotr-political-actions.service";

@Injectable ()
export class WotrGameActionsService {

  private cardActions = inject (WotrCardActionsService);
  private fellowshipActions = inject (WotrFellowshipActionsService);
  private huntActions = inject (WotrHuntActionsService);
  private actionDiceActions = inject (WotrActionDieActionsService);
  private companionActions = inject (WotrCompanionActionsService);
  private minionActions = inject (WotrMinionActionsService);
  private armyActions = inject (WotrArmyActionsService);
  private politicalActions = inject (WotrPoliticalActionsService);
  private combatActions = inject (WotrCombatActionsService);

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

  applyAction (action: WotrAction, frontId: WotrFrontId) {
    this.actionAppliers[action.type] (action, frontId);
  }

}

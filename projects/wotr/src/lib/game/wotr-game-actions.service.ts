import { Injectable, inject } from "@angular/core";
import { WotrActionDieActionsService } from "../action-die/wotr-action-die-actions.service";
import { WotrBattleActionsService } from "../battle/wotr-battle-actions.service";
import { WotrCardActionsService } from "../card/wotr-card-actions.service";
import { WotrCharacterActionsService } from "../companion/wotr-character-actions.service";
import { WotrFellowshipActionsService } from "../fellowship/wotr-fellowship-actions.service";
import { WotrHuntActionsService } from "../hunt/wotr-hunt-actions.service";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrRegionActionsService } from "../region/wotr-region-actions.service";
import { WotrUnitActionsService } from "../unit/wotr-unit-actions.service";
import { WotrStoryService } from "./wotr-story.service";

@Injectable ()
export class WotrGameActionsService {

  private storyService = inject (WotrStoryService);

  private cardActions = inject (WotrCardActionsService);
  private fellowshipActions = inject (WotrFellowshipActionsService);
  private huntActions = inject (WotrHuntActionsService);
  private actionDiceActions = inject (WotrActionDieActionsService);
  private companionActions = inject (WotrCharacterActionsService);
  private armyActions = inject (WotrUnitActionsService);
  private politicalActions = inject (WotrNationService);
  private battleActions = inject (WotrBattleActionsService);
  private regionActions = inject (WotrRegionActionsService);

  registerActions () {
    this.storyService.registerActions ({
      ...this.cardActions.getActionAppliers (),
      ...this.fellowshipActions.getActionAppliers (),
      ...this.huntActions.getActionAppliers (),
      ...this.actionDiceActions.getActionAppliers (),
      ...this.companionActions.getActionAppliers (),
      ...this.armyActions.getActionAppliers (),
      ...this.politicalActions.getActionAppliers (),
      ...this.battleActions.getActionAppliers (),
      ...this.regionActions.getActionAppliers (),
    } as any);
  }

}

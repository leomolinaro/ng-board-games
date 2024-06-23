import { Injectable, inject } from "@angular/core";
import { WotrActionDieService } from "../action-die/wotr-action-die.service";
import { WotrBattleService } from "../battle/wotr-battle.service";
import { WotrCardService } from "../card/wotr-card.service";
import { WotrCharacterService } from "../character/wotr-character.service";
import { WotrActionLogger, WotrFragmentCreator } from "../commons/wotr-action.models";
import { WotrFellowshipService } from "../fellowship/wotr-fellowship.service";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrHuntService } from "../hunt/wotr-hunt.service";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrRegionService } from "../region/wotr-region.service";
import { WotrUnitService } from "../unit/wotr-unit.service";
import { WotrGameAction } from "./wotr-story.models";

@Injectable ()
export class WotrGameLogsService {

  private actionLoggers: Record<string, WotrActionLogger<WotrGameAction>> = {
    ...inject (WotrCardService).getActionLoggers (),
    ...inject (WotrFellowshipService).getActionLoggers (),
    ...inject (WotrHuntService).getActionLoggers (),
    ...inject (WotrActionDieService).getActionLoggers (),
    ...inject (WotrCharacterService).getActionLoggers (),
    ...inject (WotrUnitService).getActionLoggers (),
    ...inject (WotrNationService).getActionLoggers (),
    ...inject (WotrBattleService).getActionLoggers (),
    ...inject (WotrRegionService).getActionLoggers (),
  } as any;

  getActionLogFragments<F> (action: WotrGameAction, front: WotrFrontId, fragmentCreator: WotrFragmentCreator<F>): (F | string)[] {
    return this.actionLoggers[action.type] (action, front, fragmentCreator);
  }

}

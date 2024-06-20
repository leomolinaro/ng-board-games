import { Injectable, inject } from "@angular/core";
import { WotrActionDieLogsService } from "../action-die/wotr-action-die-logs.service";
import { WotrBattleLogsService } from "../battle/wotr-battle-logs.service";
import { WotrCardLogsService } from "../card/wotr-card-logs.service";
import { WotrActionLogger, WotrEffectLogger, WotrFragmentCreator } from "../commons/wotr-action-log";
import { WotrCharacterLogsService } from "../companion/wotr-character-logs.service";
import { WotrFellowshipLogsService } from "../fellowship/wotr-fellowship-logs.service";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrHuntLogsService } from "../hunt/wotr-hunt-logs.service";
import { WotrNationLogsService } from "../nation/wotr-nation-logs.service";
import { WotrRegionLogsService } from "../region/wotr-region-logs.service";
import { WotrUnitLogsService } from "../unit/wotr-units-logs.service";
import { WotrAction } from "./wotr-story.models";

@Injectable ({
  providedIn: "root"
})
export class WotrGameLogsService {

  private actionLoggers: Record<string, WotrActionLogger<WotrAction>> = {
    ...inject (WotrCardLogsService).getActionLoggers (),
    ...inject (WotrFellowshipLogsService).getActionLoggers (),
    ...inject (WotrHuntLogsService).getActionLoggers (),
    ...inject (WotrActionDieLogsService).getActionLoggers (),
    ...inject (WotrCharacterLogsService).getActionLoggers (),
    ...inject (WotrUnitLogsService).getActionLoggers (),
    ...inject (WotrNationLogsService).getActionLoggers (),
    ...inject (WotrBattleLogsService).getActionLoggers (),
    ...inject (WotrRegionLogsService).getActionLoggers (),
  } as any;

  private effectLoggers: Record<string, WotrEffectLogger<WotrAction>> = {
    ...inject (WotrNationLogsService).getEffectLoggers (),
  } as any;

  getActionLogFragments<F> (action: WotrAction, front: WotrFrontId, fragmentCreator: WotrFragmentCreator<F>): (F | string)[] {
    return this.actionLoggers[action.type] (action, front, fragmentCreator);
  }

  getEffectLogFragments<F> (effect: WotrAction, fragmentCreator: WotrFragmentCreator<F>): (F | string)[] {
    return this.effectLoggers[effect.type] (effect, fragmentCreator);
  }

}

import { Injectable, inject } from "@angular/core";
import { WotrActionDieLogsService } from "../action-die/wotr-action-die-logs.service";
import { WotrBattleLogsService } from "../battle/wotr-battle-logs.service";
import { WotrCardLogsService } from "../card/wotr-card-logs.service";
import { WotrActionLogger, WotrFragmentCreator } from "../commons/wotr-action-log";
import { WotrCompanionLogsService } from "../companion/wotr-companion-logs.service";
import { WotrFellowshipLogsService } from "../fellowship/wotr-fellowship-logs.service";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrHuntLogsService } from "../hunt/wotr-hunt-logs.service";
import { WotrMinionLogsService } from "../minion/wotr-minion-logs.service";
import { WotrPoliticalLogsService } from "../nation/wotr-political-logs.service";
import { WotrUnitLogsService } from "../unit/wotr-units-logs.service";
import { WotrAction } from "./wotr-story.models";

@Injectable ({
  providedIn: "root"
})
export class WotrGameActionLogsService {

  private actionLoggers: Record<WotrAction["type"], WotrActionLogger<WotrAction>> = {
    ...inject (WotrCardLogsService).getActionLoggers (),
    ...inject (WotrFellowshipLogsService).getActionLoggers (),
    ...inject (WotrHuntLogsService).getActionLoggers (),
    ...inject (WotrActionDieLogsService).getActionLoggers (),
    ...inject (WotrCompanionLogsService).getActionLoggers (),
    ...inject (WotrMinionLogsService).getActionLoggers (),
    ...inject (WotrUnitLogsService).getActionLoggers (),
    ...inject (WotrPoliticalLogsService).getActionLoggers (),
    ...inject (WotrBattleLogsService).getActionLoggers (),
  } as any;

  getLogFragments<F> (action: WotrAction, front: WotrFrontId, fragmentCreator: WotrFragmentCreator<F>): (F | string)[] {
    return this.actionLoggers[action.type] (action, front, fragmentCreator);
  }

}

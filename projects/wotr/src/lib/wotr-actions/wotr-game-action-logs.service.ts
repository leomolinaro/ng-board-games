import { Injectable, inject } from "@angular/core";
import { WotrFrontId } from "../wotr-elements/wotr-front.models";
import { WotrAction } from "../wotr-story.models";
import { WotrActionDieLogsService } from "./wotr-action-die-logs.service";
import { WotrActionLogger, WotrFragmentCreator } from "./wotr-action-log";
import { WotrArmyLogsService } from "./wotr-army-logs.service";
import { WotrCardLogsService } from "./wotr-card-logs.service";
import { WotrCombatLogsService } from "./wotr-combat-logs.service";
import { WotrCompanionLogsService } from "./wotr-companion-logs.service";
import { WotrFellowshipLogsService } from "./wotr-fellowship-logs.service";
import { WotrHuntLogsService } from "./wotr-hunt-logs.service";
import { WotrMinionLogsService } from "./wotr-minion-logs.service";
import { WotrPoliticalLogsService } from "./wotr-political-logs.service";

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
    ...inject (WotrArmyLogsService).getActionLoggers (),
    ...inject (WotrPoliticalLogsService).getActionLoggers (),
    ...inject (WotrCombatLogsService).getActionLoggers (),
  } as any;

  getLogFragments<F> (action: WotrAction, front: WotrFrontId, fragmentCreator: WotrFragmentCreator<F>): (F | string)[] {
    return this.actionLoggers[action.type] (action, front, fragmentCreator);
  }

}

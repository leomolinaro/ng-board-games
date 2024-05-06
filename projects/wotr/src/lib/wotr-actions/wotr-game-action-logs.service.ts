import { Injectable, inject } from "@angular/core";
import { WotrFrontId } from "../wotr-elements/front/wotr-front.models";
import { WotrAction } from "../wotr-story.models";
import { WotrActionDieLogsService } from "./action-die/wotr-action-die-logs.service";
import { WotrArmyLogsService } from "./army/wotr-army-logs.service";
import { WotrCardLogsService } from "./card/wotr-card-logs.service";
import { WotrCombatLogsService } from "./combat/wotr-combat-logs.service";
import { WotrCompanionLogsService } from "./companion/wotr-companion-logs.service";
import { WotrFellowshipLogsService } from "./fellowship/wotr-fellowship-logs.service";
import { WotrHuntLogsService } from "./hunt/wotr-hunt-logs.service";
import { WotrMinionLogsService } from "./minion/wotr-minion-logs.service";
import { WotrPoliticalLogsService } from "./political/wotr-political-logs.service";
import { WotrActionLogger, WotrFragmentCreator } from "./wotr-action-log";

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

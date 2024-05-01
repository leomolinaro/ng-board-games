import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "./wotr-action-log";
import { WotrPoliticalAction } from "./wotr-political-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrPoliticalLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrPoliticalAction> {
    return {
      "political-activation": (action, front, f) => [f.player (front), f.string (" activates "), f.nation (action.nation)],
      "political-advance": (action, front, f) => [f.player (front),  f.string (" advances "), f.nation (action.nation), f.string (" on the Political Track")],
    };
  }

}

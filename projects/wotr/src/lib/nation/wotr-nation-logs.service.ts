import { Injectable } from "@angular/core";
import { WotrActionLoggerMap, WotrEffectLoggerMap } from "../commons/wotr-action-log";
import { WotrNationAction } from "./wotr-nation-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrPoliticalLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrNationAction> {
    return {
      "political-activation": (action, front, f) => [f.player (front), " activates ", f.nation (action.nation)],
      "political-advance": (action, front, f) => [f.player (front), " advances ", f.nation (action.nation), " on the Political Track"],
    };
  }

  getEffectLoggers (): WotrEffectLoggerMap<WotrNationAction> {
    return {
      "political-activation": (effect, f) => [f.nation (effect.nation), " is activated"],
      "political-advance": (effect, f) => [f.nation (effect.nation), " is advanced on the Political Track"],
    };
  }

}

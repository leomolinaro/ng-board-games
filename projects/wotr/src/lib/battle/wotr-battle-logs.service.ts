import { Injectable } from "@angular/core";
import { isCharacterCard } from "../card/wotr-card.models";
import { WotrActionLoggerMap } from "../commons/wotr-action-log";
import { WotrBattleAction } from "./wotr-battle-actions";

@Injectable ({
  providedIn: "root"
})
export class WotrBattleLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrBattleAction> {
    return {
      "army-attack": (action, front, f) => [f.player (front), " army in ", f.region (action.fromRegion), " attacks ", f.region (action.toRegion)],
      "army-retreat-into-siege": (action, front, f) => [f.player (front), " army in ", f.region (action.region), " retreat into siege"],
      "army-not-retreat-into-siege": (action, front, f) => [f.player (front), " army in ", f.region (action.region), " does not retreat into siege"],
      "army-retreat": (action, front, f) => [f.player (front), " army in ", f.region (action.fromRegion), " retreat in ", f.region (action.toRegion)],
      "army-not-retreat": (action, front, f) => [f.player (front), " army in ", f.region (action.region), " does not retreat"],
      "battle-continue": (action, front, f) => [f.player (front), " continue battle in ", f.region (action.region)],
      "battle-cease": (action, front, f) => [f.player (front), " cease tha battle in ", f.region (action.region)],
      "leader-forfeit": (action, front, f) => [f.player (front), " forfeits TODO leadership"],
      "combat-card-choose": (action, front, f) => [f.player (front), ` choose a ${isCharacterCard (action.card) ? "character" : "strategy"} combat card`],
      "combat-card-choose-not": (action, front, f) => [f.player (front), " does not play any combat card"],
      "combat-roll": (action, front, f) => [f.player (front), " rolls ", action.dice.join (", ")],
      "combat-re-roll": (action, front, f) => [f.player (front), " re-rolls ", action.dice.join (", ")],
    };
  }

}

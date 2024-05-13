import { Injectable } from "@angular/core";
import { isCharacterCard } from "../card/wotr-card.models";
import { WotrActionLoggerMap } from "../commons/wotr-action-log";
import { WotrCombatAction } from "./wotr-combat-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrCombatLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrCombatAction> {
    return {
      "combat-card-choose": (action, front, f) => [f.player (front), ` choose a ${isCharacterCard (action.card) ? "character" : "strategy"} combat card`],
      "combat-card-choose-not": (action, front, f) => [f.player (front), " does not play any combat card"],
      "combat-roll": (action, front, f) => [f.player (front), " rolls ", action.dice.toString ()],
    };
  }

}

import { Injectable } from "@angular/core";
import { WotrHuntRoll } from "../wotr-actions/wotr-hunt-actions";
import { WotrGameState } from "../wotr-elements/wotr-game.store";

@Injectable ({
  providedIn: "root",
})
export class WotrHuntRulesService {

  getNSuccesses (huntRoll: WotrHuntRoll, state: WotrGameState) {
    const threshold = Math.max (6 - state.hunt.nFreePeopleDice, 1);
    const nSuccesses = huntRoll.dice.reduce ((counter, die) => {
      if (die >= threshold) { counter++; }
      return counter;
    });
    return nSuccesses;
  }
  

}

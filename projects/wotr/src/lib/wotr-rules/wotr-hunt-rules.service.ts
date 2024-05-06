import { Injectable } from "@angular/core";
import { WotrHuntRoll } from "../wotr-actions/hunt/wotr-hunt-actions";
import { WotrHuntState } from "../wotr-elements/hunt/wotr-hunt.store";

@Injectable ({
  providedIn: "root",
})
export class WotrHuntRulesService {

  getNSuccesses (huntRoll: WotrHuntRoll, hunt: WotrHuntState) {
    const threshold = Math.max (6 - hunt.nFreePeopleDice, 1);
    const nSuccesses = huntRoll.dice.reduce ((counter, die) => {
      if (die >= threshold) { counter++; }
      return counter;
    }, 0);
    return nSuccesses;
  }
  

}

import { Injectable, inject } from "@angular/core";
import { WotrCompanionStore } from "../wotr-elements/companion/wotr-companion.store";
import { WotrHuntStore } from "../wotr-elements/hunt/wotr-hunt.store";
import { WotrCombatDie } from "../wotr-elements/wotr-dice.models";
import { WotrStoryService } from "./wotr-story.service";

@Injectable ()
export class WotrHuntFlowService {

  private storyService = inject (WotrStoryService);
  private huntStore = inject (WotrHuntStore);
  private companionStore = inject (WotrCompanionStore);

  async resolveHunt () {
    if (!this.huntStore.hasHuntDice ()) { return; }
    const huntRoll = await this.storyService.rollHuntDice ("shadow");
    const nSuccesses = this.getNSuccesses (huntRoll);
    if (!nSuccesses) { return; }
    const huntTileId = await this.storyService.drawHuntTile ("shadow");
    const huntTile = this.huntStore.huntTile (huntTileId);
    let damage = huntTile.eye ? nSuccesses : huntTile.quantity!; // TODO
    while (damage > 0) {
      const absorbedDamage = await this.absorbHuntDamage ();
      damage -= absorbedDamage;
    }
  }

  private getNSuccesses (huntRoll: WotrCombatDie[]) {
    const hunt = this.huntStore.state ();
    const threshold = Math.max (6 - hunt.nFreePeopleDice, 1);
    const nSuccesses = huntRoll.reduce ((counter, die) => {
      if (die >= threshold) { counter++; }
      return counter;
    }, 0);
    return nSuccesses;
  }

  private async absorbHuntDamage () {
    let absorbedDamage = 0;
    const actions = await this.storyService.absorbHuntDamage ("free-peoples");
    for (const action of actions) {
      switch (action.type) {
        case "fellowship-corruption": absorbedDamage += action.quantity; break;
        case "companion-elimination": {
          for (const companionId of action.companions) {
            absorbedDamage += this.companionStore.companion (companionId).level;
          }
          break;
        }
      }
    }
    return absorbedDamage;
  }

}

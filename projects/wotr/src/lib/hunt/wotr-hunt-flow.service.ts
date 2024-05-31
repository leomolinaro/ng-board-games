import { Injectable, inject } from "@angular/core";
import { WotrCombatDie } from "../battle/wotr-combat-die.models";
import { WotrCharacterStore } from "../companion/wotr-character.store";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrHuntStore } from "./wotr-hunt.store";

@Injectable ()
export class WotrHuntFlowService {

  private storyService = inject (WotrStoryService);
  private regionStore = inject (WotrRegionStore);
  private huntStore = inject (WotrHuntStore);
  private characterStore = inject (WotrCharacterStore);
  private logStore = inject (WotrLogStore);

  async resolveHunt () {
    if (!this.huntStore.hasHuntDice ()) { return; }
    this.logStore.logHuntResolution ();
    const huntRoll = await this.storyService.rollHuntDice ("shadow");
    let nSuccesses = this.getNSuccesses (huntRoll);
    const nReRolls = this.getNReRolls (huntRoll, nSuccesses);
    if (nReRolls) {
      const huntReRoll = await this.storyService.reRollHuntDice ("shadow");
      const nReRollSuccesses = this.getNSuccesses (huntReRoll);
      nSuccesses += nReRollSuccesses;
    }
    if (!nSuccesses) { return; }
    const huntTileId = await this.storyService.drawHuntTile ("shadow");
    const huntTile = this.huntStore.huntTile (huntTileId);
    let damage = huntTile.eye ? nSuccesses : huntTile.quantity!; // TODO shelob die
    while (damage > 0) {
      const absorbedDamage = await this.absorbHuntDamage ();
      damage -= absorbedDamage;
    }
    if (huntTile.reveal) {
      await this.storyService.revealFellowship ("free-peoples");
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

  private getNReRolls (huntRoll: WotrCombatDie[], nRollSuccesses: number): number {
    const nFailures = huntRoll.length - nRollSuccesses;
    if (!nFailures) { return 0; }
    // const fellowship = this.fellowshipStore.state ();
    const regionId = this.regionStore.getFellowshipRegion ();
    const region = this.regionStore.region (regionId);
    let nReRolls = 0;
    if (region.settlement === "stronghold" && region.controlledBy === "shadow") {
      nReRolls++;
    }
    if (region.units.nNazgul || region.units.characters?.includes ("the-witch-king")) {
      nReRolls++;
    }
    if (region.units.armyUnits?.some (armyUnit => armyUnit.front === "shadow")) {
      nReRolls++;
    }
    return Math.min (nReRolls, nFailures);
  }

  async absorbHuntDamage () {
    let absorbedDamage = 0;
    const actions = await this.storyService.absorbHuntDamage ("free-peoples");
    for (const action of actions) {
      switch (action.type) {
        case "fellowship-corruption": absorbedDamage += action.quantity; break;
        case "character-elimination": {
          for (const companionId of action.characters) {
            absorbedDamage += this.characterStore.character (companionId).level;
          }
          break;
        }
      }
    }
    return absorbedDamage;
  }

}

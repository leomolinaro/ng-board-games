import { Injectable, inject } from "@angular/core";
import { WotrCombatDie } from "../battle/wotr-combat-die.models";
import { WotrCharacterStore } from "../companion/wotr-character.store";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrHuntTileId } from "./wotr-hunt.models";
import { WotrHuntStore } from "./wotr-hunt.store";

interface WotrHuntTileResolutionOptions {
  nSuccesses?: number;
  ignoreEyeTile?: true;
  ignoreFreePeopleSpecialTile?: true;
}

@Injectable ()
export class WotrHuntFlowService {

  private storyService = inject (WotrStoryService);
  private regionStore = inject (WotrRegionStore);
  private huntStore = inject (WotrHuntStore);
  private characterStore = inject (WotrCharacterStore);
  private logStore = inject (WotrLogStore);
  private fellowshipStore = inject (WotrFellowshipStore);

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
    await this.resolveHuntTile (huntTileId, {
      nSuccesses
    });
  }

  async resolveHuntTile (huntTileId: WotrHuntTileId, options: WotrHuntTileResolutionOptions) {
    const huntTile = this.huntStore.huntTile (huntTileId);
    if (options.ignoreEyeTile && huntTile.eye) { return; }
    if (options.ignoreFreePeopleSpecialTile && huntTile.type === "free-people-special") { return; }
    let damage = huntTile.eye ? options.nSuccesses! : huntTile.quantity!;

    const wasRevealed = this.fellowshipStore.isRevealed ();

    let doReveal = false;
    if (huntTile.reveal && !wasRevealed) {
      if (this.fellowshipStore.guide () !== "gollum" || huntTile.type !== "standard" || huntTile.quantity == null) {
        doReveal = true;
      }
    }

    let isRelealing = doReveal;
    while (damage > 0) {
      const { absorbedDamage, gollumRevealing } = await this.absorbHuntDamage ();
      damage -= absorbedDamage;
      if (gollumRevealing && !wasRevealed) { isRelealing = true; }
    }

    if (isRelealing) {
      const fromRegion = this.regionStore.getFellowshipRegion ();
      if (doReveal) { await this.storyService.revealFellowship ("free-peoples"); }
      const toRegion = this.regionStore.getFellowshipRegion ();
      if (this.revealedThroughShadowStronghold (fromRegion, toRegion)) {
        const newHuntTileId = await this.storyService.drawHuntTile ("shadow");
        this.resolveHuntTile (newHuntTileId, options);
      }
    }
  }

  private revealedThroughShadowStronghold (fromRegionId: WotrRegionId, toRegionId: WotrRegionId) {
    const fromRegion = this.regionStore.region (fromRegionId);
    const toRegion = this.regionStore.region (toRegionId);
    if (fromRegion.controlledBy === "shadow" && fromRegion.settlement === "stronghold") { return true; }
    if (toRegion.controlledBy === "shadow" && toRegion.settlement === "stronghold") { return true; }
    // TODO attraverso
    return false;
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
    const regionId = this.regionStore.getFellowshipRegion ();
    const region = this.regionStore.region (regionId);
    let nReRolls = 0;
    if (region.settlement === "stronghold" && region.controlledBy === "shadow") { nReRolls++; }
    if (this.regionStore.isNazgulInRegion (regionId)) { nReRolls++; }
    if (this.regionStore.isArmyInRegion ("shadow", regionId)) { nReRolls++; }
    return Math.min (nReRolls, nFailures);
  }

  async absorbHuntDamage (): Promise<{ absorbedDamage: number; gollumRevealing?: true }> {
    let absorbedDamage = 0;
    let gollumRevealing = false;
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
        case "fellowship-reveal": {
          if (this.fellowshipStore.guide () === "gollum") {
            absorbedDamage += 1;
            gollumRevealing = true;
          }
        }
      }
    }
    if (gollumRevealing) {
      return { absorbedDamage, gollumRevealing };
    } else {
      return { absorbedDamage };
    }
  }

}

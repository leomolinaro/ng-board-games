import { Injectable, inject } from "@angular/core";
import { WotrCombatDie } from "../battle/wotr-combat-die.models";
import { WotrCardDiscardFromTable } from "../card/wotr-card-actions";
import { cardToLabel } from "../card/wotr-card.models";
import { WotrCharacterElimination, WotrCompanionRandom, WotrCompanionSeparation } from "../character/wotr-character-actions";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrCharacterService } from "../character/wotr-character.service";
import { WotrCharacterStore } from "../character/wotr-character.store";
import { WotrFellowshipCorruption, WotrFellowshipReveal } from "../fellowship/wotr-fellowship-actions";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrFrontId } from "../front/wotr-front.models";
import { filterActions, findAction } from "../game/wotr-story.models";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrHuntReRoll, WotrHuntRoll, WotrHuntTileDraw } from "./wotr-hunt-actions";
import { WotrHuntTile, WotrHuntTileId } from "./wotr-hunt.models";
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
  private characterService = inject (WotrCharacterService);
  private logStore = inject (WotrLogStore);
  private fellowshipStore = inject (WotrFellowshipStore);

  async resolveHunt () {
    if (this.fellowshipStore.isOnMordorTrack ()) {
      await this.resolveHuntOnMordorTrack ();
    } else {
      await this.resolveStandardHunt ();
    }
  }

  private async resolveStandardHunt () {
    if (!this.huntStore.hasHuntDice ()) { return; }
    this.logStore.logHuntResolution ();
    const huntRoll = await this.rollHuntDice ("shadow");
    let nSuccesses = this.getNSuccesses (huntRoll);
    const nReRolls = this.getNReRolls (huntRoll, nSuccesses);
    if (nReRolls) {
      const huntReRoll = await this.reRollHuntDice ("shadow");
      const nReRollSuccesses = this.getNSuccesses (huntReRoll);
      nSuccesses += nReRollSuccesses;
    }
    if (!nSuccesses) { return; }
    const huntTileId = await this.drawHuntTile ("shadow");
    await this.resolveHuntTile (huntTileId, {
      nSuccesses
    });
  }

  private async resolveHuntOnMordorTrack () {
    this.logStore.logHuntResolution ();
    const nSuccesses = this.huntStore.getNTotalDice ();
    const huntTileId = await this.drawHuntTile ("shadow");
    const huntTile = await this.resolveHuntTile (huntTileId, {
      nSuccesses
    });
    if (!huntTile.stop) {
      this.logStore.logMoveInMordor ();
      this.fellowshipStore.moveOnMordorTrack ();
    }
  }

  async resolveHuntTile (huntTileId: WotrHuntTileId, options: WotrHuntTileResolutionOptions): Promise<WotrHuntTile> {
    const huntTile = this.huntStore.huntTile (huntTileId);
    if (options.ignoreEyeTile && huntTile.eye) { return huntTile; }
    if (options.ignoreFreePeopleSpecialTile && huntTile.type === "free-people-special") { return huntTile; }
    let damage = huntTile.eye ? options.nSuccesses! : huntTile.quantity!;

    const wasRevealed = this.fellowshipStore.isRevealed ();

    let doReveal = false;
    if (huntTile.reveal && !wasRevealed) {
      if (this.fellowshipStore.guide () !== "gollum" || huntTile.type !== "standard" || huntTile.quantity == null) {
        doReveal = true;
      }
    }

    let isRevealing = doReveal;
    while (damage > 0) {
      const { absorbedDamage, gollumRevealing } = await this.absorbHuntDamage ();
      damage -= absorbedDamage;
      if (gollumRevealing && !wasRevealed) { isRevealing = true; }
    }

    if (isRevealing) {
      if (this.fellowshipStore.isOnMordorTrack ()) {
        this.logStore.logRevealInMordor ();
        this.fellowshipStore.reveal ();
      } else {
        const fromRegion = this.regionStore.getFellowshipRegion ();
        if (doReveal) { await this.revealFellowship (); }
        const toRegion = this.regionStore.getFellowshipRegion ();
        if (this.revealedThroughShadowStronghold (fromRegion, toRegion)) {
          const newHuntTileId = await this.drawHuntTile ("shadow");
          this.resolveHuntTile (newHuntTileId, options);
        }
      }
    }
    return huntTile;
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
    const actions = await this.huntEffect ("free-peoples");
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
          break;
        }
        case "companion-random": {
          absorbedDamage += await this.checkTakeThemAlive (action.companions);
          break;
        }
        case "card-discard-from-table": {
          // const cardLabel =  as WotrCardLabel;
          switch (cardToLabel (action.card)) {
            case "Axe and Bow": {
              absorbedDamage += 1;
              break;
            }
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

  async huntEffect (front: WotrFrontId): Promise<(WotrFellowshipCorruption | WotrCharacterElimination | WotrCompanionRandom | WotrFellowshipReveal | WotrCardDiscardFromTable)[]> {
    const story = await this.storyService.story (front, p => p.huntEffect! ());
    const actions = filterActions<WotrFellowshipCorruption | WotrCharacterElimination | WotrCompanionRandom | WotrFellowshipReveal | WotrCardDiscardFromTable> (
      story,
      "fellowship-corruption", "character-elimination", "companion-random", "fellowship-reveal", "card-discard-from-table");
    return actions;
  }

  private async checkTakeThemAlive (companions: WotrCharacterId[]): Promise<number> {
    let absorbedDamage = 0;
    for (const companion of companions) {
      if (companion === "peregrin" || companion === "meriadoc") {
        const actions = await this.characterService.activateCharacterAbility (companion, "free-peoples");
        if (actions) {
          absorbedDamage++;
        }
      }
    }
    return absorbedDamage;
  }

  async rollHuntDice (front: WotrFrontId): Promise<WotrCombatDie[]> {
    const story = await this.storyService.story (front, p => p.rollHuntDice! ());
    const huntRoll = findAction<WotrHuntRoll> (story, "hunt-roll");
    return huntRoll.dice;
  }

  async reRollHuntDice (front: WotrFrontId): Promise<WotrCombatDie[]> {
    const story = await this.storyService.story (front, p => p.reRollHuntDice! ());
    const huntReRoll = findAction<WotrHuntReRoll> (story, "hunt-re-roll");
    return huntReRoll.dice;
  }

  async drawHuntTile (front: WotrFrontId): Promise<WotrHuntTileId> {
    const story = await this.storyService.story (front, p => p.drawHuntTile! ());
    const drawHuntTile = findAction<WotrHuntTileDraw> (story, "hunt-tile-draw");
    return drawHuntTile.tile;
  }

  async revealFellowship (): Promise<void> {
    const story = await this.storyService.story ("free-peoples", p => p.revealFellowship! ());
    findAction<WotrFellowshipReveal> (story, "fellowship-reveal");
  }

  async separateCompanions (front: WotrFrontId): Promise<void> {
    const story = await this.storyService.story (front, p => p.separateCompanions! ());
    findAction<WotrCompanionSeparation> (story, "companion-separation");
  }

}

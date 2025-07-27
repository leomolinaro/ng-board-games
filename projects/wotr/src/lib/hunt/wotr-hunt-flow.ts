import { Injectable, inject } from "@angular/core";
import { WotrCombatDie } from "../battle/wotr-combat-die-models";
import { WotrCardDiscardFromTable } from "../card/wotr-card-actions";
import { cardToLabel } from "../card/wotr-card-models";
import { WotrCharacterElimination } from "../character/wotr-character-actions";
import { WotrCharacterHandler } from "../character/wotr-character-handler";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrCharacterStore } from "../character/wotr-character-store";
import {
  WotrCompanionRandom,
  WotrCompanionSeparation,
  WotrFellowshipCorruption,
  WotrFellowshipReveal
} from "../fellowship/wotr-fellowship-actions";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { assertAction, filterActions } from "../game/wotr-story-models";
import { WotrLogStore } from "../log/wotr-log-store";
import { WotrFreePeoplesPlayer } from "../player/wotr-free-peoples-player";
import { WotrPlayer } from "../player/wotr-player";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrHuntReRoll, WotrHuntRoll, WotrHuntTileDraw } from "./wotr-hunt-actions";
import { WotrHuntEffectParams, WotrHuntTile, WotrHuntTileId } from "./wotr-hunt-models";
import { WotrHuntStore } from "./wotr-hunt-store";

interface WotrHuntTileResolutionOptions {
  nSuccesses?: number;
  ignoreEyeTile?: true;
  ignoreFreePeopleSpecialTile?: true;
}

type HuntEffect =
  | WotrFellowshipCorruption
  | WotrCharacterElimination
  | WotrCompanionRandom
  | WotrFellowshipReveal
  | WotrCardDiscardFromTable;

@Injectable({ providedIn: "root" })
export class WotrHuntFlow {
  private regionStore = inject(WotrRegionStore);
  private huntStore = inject(WotrHuntStore);
  private characterStore = inject(WotrCharacterStore);
  private characterHandler = inject(WotrCharacterHandler);
  private logStore = inject(WotrLogStore);
  private fellowshipStore = inject(WotrFellowshipStore);

  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);

  async resolveHunt() {
    if (this.fellowshipStore.isOnMordorTrack()) {
      await this.resolveHuntOnMordorTrack();
    } else {
      await this.resolveStandardHunt();
    }
  }

  private async resolveStandardHunt() {
    if (!this.huntStore.hasHuntDice()) return;
    this.logStore.logHuntResolution();
    const huntRoll = await this.rollHuntDice(this.shadow);
    let nSuccesses = this.getNSuccesses(huntRoll);
    const nReRolls = this.getNReRolls(huntRoll, nSuccesses);
    if (nReRolls) {
      const huntReRoll = await this.reRollHuntDice(nReRolls);
      const nReRollSuccesses = this.getNSuccesses(huntReRoll);
      nSuccesses += nReRollSuccesses;
    }
    if (!nSuccesses) return;
    const huntTileId = await this.drawHuntTile(this.shadow);
    await this.resolveHuntTile(huntTileId, {
      nSuccesses
    });
  }

  private async resolveHuntOnMordorTrack() {
    this.logStore.logHuntResolution();
    const nSuccesses = this.huntStore.nTotalDice();
    const huntTileId = await this.drawHuntTile(this.shadow);
    const huntTile = await this.resolveHuntTile(huntTileId, {
      nSuccesses
    });
    if (!huntTile.stop) {
      this.logStore.logMoveInMordor();
      this.fellowshipStore.moveOnMordorTrack();
    }
  }

  async resolveHuntTile(
    huntTileId: WotrHuntTileId,
    options: WotrHuntTileResolutionOptions
  ): Promise<WotrHuntTile> {
    const huntTile = this.huntStore.huntTile(huntTileId);
    if (options.ignoreEyeTile && huntTile.eye) return huntTile;
    if (options.ignoreFreePeopleSpecialTile && huntTile.type === "free-people-special")
      return huntTile;
    let damage = huntTile.eye ? options.nSuccesses! : huntTile.quantity!;

    const wasRevealed = this.fellowshipStore.isRevealed();

    let doReveal = false;
    if (huntTile.reveal && !wasRevealed) {
      if (
        this.fellowshipStore.guide() !== "gollum" ||
        huntTile.type !== "standard" ||
        huntTile.quantity == null
      ) {
        doReveal = true;
      }
    }

    let isRevealing = doReveal;
    const params: WotrHuntEffectParams = {
      damage: 0
    };
    while (damage > 0) {
      params.damage = damage;
      const { absorbedDamage, gollumRevealing } = await this.absorbHuntDamage(params);
      damage -= absorbedDamage;
      if (gollumRevealing && !wasRevealed) {
        isRevealing = true;
      }
    }

    if (isRevealing) {
      if (this.fellowshipStore.isOnMordorTrack()) {
        this.logStore.logRevealInMordor();
        this.fellowshipStore.reveal();
      } else {
        const fromRegion = this.regionStore.fellowshipRegion();
        const progress = this.fellowshipStore.progress();
        if (doReveal) {
          await this.revealFellowship();
        }
        const toRegion = this.regionStore.fellowshipRegion();
        if (this.revealedThroughShadowStronghold(fromRegion, toRegion, progress)) {
          const newHuntTileId = await this.drawHuntTile(this.shadow);
          this.resolveHuntTile(newHuntTileId, options);
        }
      }
    }
    return huntTile;
  }

  private revealedThroughShadowStronghold(
    fromRegionId: WotrRegionId,
    toRegionId: WotrRegionId,
    maxDistance: number
  ): boolean {
    const paths = this.regionStore.pathsBetweenRegions(fromRegionId, toRegionId, maxDistance);
    const passThoughShadowStronghold = paths.every(path =>
      path.some(regionId => {
        const region = this.regionStore.region(regionId);
        return region.controlledBy === "shadow" && region.settlement === "stronghold";
      })
    );
    return passThoughShadowStronghold;
  }

  private getNSuccesses(huntRoll: WotrCombatDie[]) {
    const hunt = this.huntStore.state();
    const threshold = Math.max(6 - hunt.nFreePeopleDice, 1);
    const nSuccesses = huntRoll.reduce((counter, die) => {
      if (die >= threshold) {
        counter++;
      }
      return counter;
    }, 0);
    return nSuccesses;
  }

  private getNReRolls(huntRoll: WotrCombatDie[], nRollSuccesses: number): number {
    const nFailures = huntRoll.length - nRollSuccesses;
    if (!nFailures) {
      return 0;
    }
    const regionId = this.regionStore.fellowshipRegion();
    const region = this.regionStore.region(regionId);
    let nReRolls = 0;
    if (region.settlement === "stronghold" && region.controlledBy === "shadow") {
      nReRolls++;
    }
    if (this.regionStore.isNazgulInRegion(regionId)) {
      nReRolls++;
    }
    if (this.regionStore.isArmyInRegion("shadow", regionId)) {
      nReRolls++;
    }
    return Math.min(nReRolls, nFailures);
  }

  async absorbHuntDamage(
    params: WotrHuntEffectParams
  ): Promise<{ absorbedDamage: number; gollumRevealing?: true }> {
    let absorbedDamage = 0;
    let gollumRevealing = false;
    const actions = await this.huntEffect(params);
    for (const action of actions) {
      switch (action.type) {
        case "fellowship-corruption":
          absorbedDamage += action.quantity;
          break;
        case "character-elimination": {
          for (const companionId of action.characters) {
            absorbedDamage += this.characterStore.character(companionId).level;
          }
          params.casualtyTaken = true;
          break;
        }
        case "fellowship-reveal": {
          if (this.fellowshipStore.guide() === "gollum") {
            absorbedDamage += 1;
            gollumRevealing = true;
          }
          break;
        }
        case "companion-random": {
          const takeThemAliveAbsorbed = await this.checkTakeThemAlive(action.companions);
          if (takeThemAliveAbsorbed > 0) {
            absorbedDamage += takeThemAliveAbsorbed;
          } else {
            params.randomCompanions = action.companions;
          }
          break;
        }
        case "card-discard-from-table": {
          switch (cardToLabel(action.card)) {
            case "Axe and Bow": {
              absorbedDamage += 1;
              break;
            }
          }
          params.tableCardsUsed = true;
          break;
        }
      }
    }
    if (gollumRevealing) {
      return { absorbedDamage, gollumRevealing };
    } else {
      return { absorbedDamage };
    }
  }

  async huntEffect(params: WotrHuntEffectParams): Promise<HuntEffect[]> {
    const story = await this.freePeoples.huntEffect(params);
    const actions = filterActions<HuntEffect>(
      story,
      "fellowship-corruption",
      "character-elimination",
      "companion-random",
      "fellowship-reveal",
      "card-discard-from-table"
    );
    return actions;
  }

  private async checkTakeThemAlive(companions: WotrCharacterId[]): Promise<number> {
    let absorbedDamage = 0;
    for (const companion of companions) {
      if (companion === "peregrin" || companion === "meriadoc") {
        const actions = await this.characterHandler.activateCharacterAbility(
          companion,
          this.freePeoples
        );
        if (actions) {
          absorbedDamage++;
        }
      }
    }
    return absorbedDamage;
  }

  async rollHuntDice(player: WotrPlayer): Promise<WotrCombatDie[]> {
    const story = await player.rollHuntDice();
    const huntRoll = assertAction<WotrHuntRoll>(story, "hunt-roll");
    return huntRoll.dice;
  }

  async reRollHuntDice(nReRolls: number): Promise<WotrCombatDie[]> {
    const story = await this.shadow.reRollHuntDice(nReRolls);
    const huntReRoll = assertAction<WotrHuntReRoll>(story, "hunt-re-roll");
    return huntReRoll.dice;
  }

  async drawHuntTile(player: WotrPlayer): Promise<WotrHuntTileId> {
    const story = await player.drawHuntTile();
    const drawHuntTile = assertAction<WotrHuntTileDraw>(story, "hunt-tile-draw");
    return drawHuntTile.tile;
  }

  async revealFellowship(): Promise<void> {
    const story = await this.freePeoples.revealFellowship();
    assertAction<WotrFellowshipReveal>(story, "fellowship-reveal");
  }

  async separateCompanions(player: WotrPlayer): Promise<void> {
    const story = await player.separateCompanions();
    assertAction<WotrCompanionSeparation>(story, "companion-separation");
  }
}

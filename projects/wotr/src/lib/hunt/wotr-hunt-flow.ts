import { Injectable, inject } from "@angular/core";
import { WotrCombatDie } from "../battle/wotr-combat-die-models";
import { WotrCardDiscardFromTable } from "../card/wotr-card-actions";
import { cardToLabel } from "../card/wotr-card-models";
import { WotrCharacterElimination } from "../character/wotr-character-actions";
import { WotrCharacterModifiers } from "../character/wotr-character-modifiers";
import { WotrCharacterStore } from "../character/wotr-character-store";
import { findAction } from "../commons/wotr-action-models";
import {
  WotrCompanionRandom,
  WotrCompanionSeparation,
  WotrFellowshipCorruption,
  WotrFellowshipReveal
} from "../fellowship/wotr-fellowship-actions";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { assertAction, filterActions } from "../game/wotr-story-models";
import { WotrLogWriter } from "../log/wotr-log-writer";
import { WotrFreePeoplesPlayer } from "../player/wotr-free-peoples-player";
import { WotrPlayer } from "../player/wotr-player";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import {
  WotrHuntReRoll,
  WotrHuntRoll,
  WotrHuntShelobsLairRoll,
  WotrHuntTileDraw
} from "./wotr-hunt-actions";
import { WotrHuntEffectParams, WotrHuntTile, WotrHuntTileId } from "./wotr-hunt-models";
import { WotrHuntModifiers } from "./wotr-hunt-modifiers";
import { WotrHuntStore } from "./wotr-hunt-store";

interface WotrHuntTileResolutionOptions {
  nSuccesses?: number;
  ignoreEyeTile?: true;
  ignoreFreePeopleSpecialTile?: true;
  onlyRingAbsorbtion?: true;
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
  private logger = inject(WotrLogWriter);
  private fellowshipStore = inject(WotrFellowshipStore);

  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);
  private charactersModifiers = inject(WotrCharacterModifiers);
  private huntModifiers = inject(WotrHuntModifiers);

  async resolveHunt() {
    this.huntStore.setInProgress(true);
    if (this.fellowshipStore.isOnMordorTrack()) {
      await this.resolveHuntOnMordorTrack();
    } else {
      await this.resolveStandardHunt();
    }
    this.huntStore.setInProgress(false);
  }

  private async resolveStandardHunt() {
    if (!this.huntStore.hasHuntDice()) return;
    this.logger.logHuntResolution();
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
    this.logger.logHuntResolution();
    const nSuccesses = this.huntStore.nTotalDice();
    let huntTileId = await this.drawHuntTile(this.shadow);
    huntTileId = await this.huntModifiers.onAfterTileDrawn(huntTileId);
    const huntTile = await this.resolveHuntTile(huntTileId, {
      nSuccesses
    });
    if (!huntTile.stop) {
      this.logger.logMoveInMordor();
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
    let damage = 0;
    if (huntTile.eye) {
      damage = options.nSuccesses!;
    } else if (huntTile.dice) {
      const story = await this.shadow.rollShelobsLairDie();
      if (!("actions" in story)) throw new Error("Expected story with actions");
      const roll = findAction<WotrHuntShelobsLairRoll>(story.actions, "hunt-shelobs-lair-roll");
      if (!roll) throw new Error("Expected hunt shelob's lair roll action");
      damage = roll.die;
    } else {
      damage = huntTile.quantity!;
    }

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
        this.logger.logRevealInMordor();
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
          for (const companionId of action.companions) {
            const eliminating =
              await this.charactersModifiers.onBeforeCharacterElimination(companionId);
            if (eliminating) {
              if (!params.randomCompanions) params.randomCompanions = [];
              params.randomCompanions.push(companionId);
            } else {
              absorbedDamage += this.characterStore.character(companionId).level;
              params.casualtyTaken = true;
            }
          }
          break;
        }
        case "card-discard-from-table": {
          switch (cardToLabel(action.card)) {
            case "Axe and Bow": {
              absorbedDamage += 1;
              break;
            }
            default:
              throw new Error("Unknown card for hunt damage absorption");
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

import { inject, Injectable } from '@angular/core';
import type { WotrCombatDie } from '../battle/wotr-combat-die-models';
import type { WotrCardDiscardFromTable } from '../card/wotr-card-actions';
import { cardToLabel } from '../card/wotr-card-models';
import type { WotrCharacterElimination } from '../character/wotr-character-actions';
import { WotrCharacterModifiers } from '../character/wotr-character-modifiers';
import { findAction } from '../commons/wotr-action-models';
import type {
  WotrCompanionRandom,
  WotrCompanionSeparation,
  WotrFellowshipCorruption,
  WotrFellowshipReveal,
  WotrFellowshipRevealInMordor,
} from '../fellowship/wotr-fellowship-actions';
import type { WotrSeparateCompanionsOptions } from '../fellowship/wotr-fellowship-rules';
import { WotrFellowshipStore } from '../fellowship/wotr-fellowship-store';
import { WotrGameQuery } from '../game/wotr-game-query';
import { assertAction, filterActions } from '../game/wotr-story-models';
import { WotrLogWriter } from '../log/wotr-log-writer';
import { WotrFreePeoplesPlayer } from '../player/wotr-free-peoples-player';
import type { WotrPlayer } from '../player/wotr-player';
import { WotrShadowPlayer } from '../player/wotr-shadow-player';
import type { WotrRegionId } from '../region/wotr-region-models';
import { WotrRegionStore } from '../region/wotr-region-store';
import type {
  WotrHuntReRoll,
  WotrHuntRoll,
  WotrHuntShelobsLairRoll,
  WotrHuntTileDraw,
} from './wotr-hunt-actions';
import { WotrHuntHandler } from './wotr-hunt-handler';
import type { WotrHuntEffectParams, WotrHuntTileId } from './wotr-hunt-models';
import {
  WotrHuntModifiers,
  WotrHuntRollModifiers,
} from './wotr-hunt-modifiers';
import { WotrHuntStore } from './wotr-hunt-store';

export interface WotrHuntTileResolutionOptions {
  nSuccesses?: number;
  ignoreEyeTile?: true;
  ignoreRevealIcon?: true;
  ignoreFreePeopleSpecialTile?: true;
  onlyRingAbsorbtion?: true;
  mustEliminateRandomCompanion?: true;
}

type HuntEffect =
  | WotrFellowshipCorruption
  | WotrCharacterElimination
  | WotrCompanionRandom
  | WotrCompanionSeparation // hobbit guide ability
  | WotrFellowshipReveal
  | WotrFellowshipRevealInMordor
  | WotrCardDiscardFromTable;

// https://boardgamegeek.com/thread/1781537/article/25924689#25924689

@Injectable()
export class WotrHuntFlow {
  private regionStore = inject(WotrRegionStore);
  private huntStore = inject(WotrHuntStore);
  private logger = inject(WotrLogWriter);
  private fellowshipStore = inject(WotrFellowshipStore);
  private q = inject(WotrGameQuery);

  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);
  private charactersModifiers = inject(WotrCharacterModifiers);
  private huntModifiers = inject(WotrHuntModifiers);
  private huntHandler = inject(WotrHuntHandler);

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
    const modifiers = new WotrHuntRollModifiers();
    await this.huntModifiers.onBeforeHuntRoll(modifiers);
    const huntRoll = await this.rollHuntDice();
    let nSuccesses = this.getNSuccesses(huntRoll, modifiers.rollModifiers);
    const nReRolls = this.getNReRolls(huntRoll, nSuccesses);
    if (nReRolls) {
      const huntReRoll = await this.reRollHuntDice(nReRolls);
      const nReRollSuccesses = this.getNSuccesses(
        huntReRoll,
        modifiers.reRollModifiers,
      );
      nSuccesses += nReRollSuccesses;
    }
    if (!nSuccesses) return;
    const isPrevented = await this.huntModifiers.isHuntDrawPrevented();
    if (isPrevented) return;
    let huntTileId = await this.drawHuntTile(this.shadow);
    huntTileId = await this.huntModifiers.onAfterTileDrawn(huntTileId);
    await this.resolveHuntTile(huntTileId, {
      nSuccesses,
    });
  }

  private async resolveHuntOnMordorTrack() {
    this.logger.logHuntResolution();
    const isPrevented = await this.huntModifiers.isHuntDrawPrevented();
    if (isPrevented) return;
    const nSuccesses = this.huntStore.nTotalDice();
    let huntTileId = await this.drawHuntTile(this.shadow);
    huntTileId = await this.huntModifiers.onAfterTileDrawn(huntTileId);
    await this.resolveHuntTile(huntTileId, {
      nSuccesses,
    });
    const huntTile = this.huntStore.huntTile(huntTileId);
    if (!huntTile.stop) {
      this.logger.logMoveInMordor();
      this.fellowshipStore.moveOnMordorTrack();
    }
  }

  async resolveHuntTile(
    huntTileId: WotrHuntTileId,
    options: WotrHuntTileResolutionOptions,
  ): Promise<void> {
    const huntTile = this.huntStore.huntTile(huntTileId);
    if (options.ignoreEyeTile && huntTile.eye) return;
    if (
      options.ignoreFreePeopleSpecialTile &&
      huntTile.type === 'free-people-special'
    )
      return;
    let damage: number;
    if (huntTile.eye) {
      damage = options.nSuccesses!;
    } else if (huntTile.dice) {
      const roll = await this.rollShelobsLairDie();
      damage = roll.die;
    } else {
      damage = huntTile.quantity!;
    }

    const wasRevealed = this.fellowshipStore.isRevealed();

    const shouldReveal =
      (huntTile.reveal &&
        !wasRevealed &&
        !options.ignoreRevealIcon &&
        (this.fellowshipStore.guide() !== 'gollum' ||
          huntTile.type !== 'standard' ||
          huntTile.quantity == null)) ??
      false;

    let isRevealing = shouldReveal;
    const params: WotrHuntEffectParams = {
      damage: 0,
      isRevealing,
    };
    if (options.onlyRingAbsorbtion) params.onlyRingAbsorbtion = true;
    if (options.mustEliminateRandomCompanion)
      params.mustEliminateRandomCompanion = true;
    while (damage > 0) {
      params.damage = damage;
      const { absorbedDamage, gollumRevealing } =
        await this.absorbHuntDamage(params);
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
        if (shouldReveal) await this.revealFellowship();
        const toRegion = this.regionStore.fellowshipRegion();
        if (
          this.movingThroughShadowStronghold(fromRegion, toRegion, progress)
        ) {
          const isPrevented = await this.huntModifiers.isHuntDrawPrevented();
          if (!isPrevented) {
            const newHuntTileId = await this.drawHuntTile(this.shadow);
            await this.resolveHuntTile(newHuntTileId, options);
          }
        }
      }
    }
  }

  async rollShelobsLairDie(): Promise<WotrHuntShelobsLairRoll> {
    const story = await this.shadow.rollShelobsLairDie();
    if (!('actions' in story)) throw new Error('Expected story with actions');
    const roll = findAction<WotrHuntShelobsLairRoll>(
      story.actions,
      'hunt-shelobs-lair-roll',
    );
    if (!roll) throw new Error("Expected hunt shelob's lair roll action");
    return roll;
  }

  private movingThroughShadowStronghold(
    fromRegionId: WotrRegionId,
    toRegionId: WotrRegionId,
    maxDistance: number,
  ): boolean {
    return this.regionStore.movingThroughRegion(
      fromRegionId,
      toRegionId,
      maxDistance,
      (regionId) => {
        const region = this.regionStore.region(regionId);
        return (
          region.controlledBy === 'shadow' && region.settlement === 'stronghold'
        );
      },
    );
  }

  private getNSuccesses(huntRoll: WotrCombatDie[], modifiers: number[]) {
    const hunt = this.huntStore.state();
    let rollModifiers = 0;
    for (const modifier of modifiers) {
      rollModifiers += modifier;
    }
    const threshold = Math.max(6 - hunt.nFreePeopleDice - rollModifiers, 1);
    let nSuccesses = 0;
    for (const die of huntRoll) {
      if (die >= threshold) nSuccesses++;
    }
    return nSuccesses;
  }

  private getNReRolls(
    huntRoll: WotrCombatDie[],
    nRollSuccesses: number,
  ): number {
    const nFailures = huntRoll.length - nRollSuccesses;
    if (!nFailures) return 0;
    const regionId = this.regionStore.fellowshipRegion();
    const region = this.regionStore.region(regionId);
    let nReRolls = 0;
    if (
      region.settlement === 'stronghold' &&
      region.controlledBy === 'shadow'
    ) {
      nReRolls++;
    }
    if (this.regionStore.isNazgulInRegion(regionId)) {
      nReRolls++;
    }
    if (this.regionStore.isArmyInRegion('shadow', regionId)) {
      nReRolls++;
    }
    return Math.min(nReRolls, nFailures);
  }

  async absorbHuntDamage(
    params: WotrHuntEffectParams,
  ): Promise<{ absorbedDamage: number; gollumRevealing?: true }> {
    let absorbedDamage = 0;
    let isGollumRevealing = false;
    const actions = await this.huntEffect(params);
    for (const action of actions) {
      switch (action.type) {
        case 'fellowship-corruption':
          absorbedDamage += action.quantity;
          break;
        case 'character-elimination': {
          // P.S.: very risky, this is set only from ui player;
          // otherwise, the else would be executed; the casualtyTaken set should not
          // be a problem from not ui player
          if (
            params.guideSpecialAbilityAbsorption?.companionId ===
            action.characters[0]
          ) {
            absorbedDamage += params.guideSpecialAbilityAbsorption.amount;
          } else {
            for (const companionId of action.characters) {
              absorbedDamage += this.q.character(companionId).level;
            }
            params.casualtyTaken = true;
          }
          break;
        }
        case 'companion-separation': {
          // P.S.: do not check guideSpecialAbilityAbsorption since
          // it is set only from ui player
          // Meriadoc and Peregrin separate for 1 damage absorption
          absorbedDamage += 1;
          break;
        }
        case 'fellowship-reveal':
        case 'fellowship-reveal-in-mordor': {
          if (this.fellowshipStore.guide() === 'gollum') {
            absorbedDamage += 1;
            isGollumRevealing = true;
          }
          break;
        }
        case 'companion-random': {
          for (const companionId of action.companions) {
            const isEliminating =
              await this.charactersModifiers.onBeforeCharacterElimination({
                characterId: companionId,
                fromTheFellowship: true,
              });
            if (isEliminating) {
              params.randomCompanions ??= [];
              params.randomCompanions.push(companionId);
            } else {
              absorbedDamage += this.q.character(companionId).level;
              params.casualtyTaken = true;
            }
          }
          break;
        }
        case 'card-discard-from-table': {
          switch (cardToLabel(action.card)) {
            case 'Axe and Bow':
            case 'Horn of Gondor': {
              absorbedDamage += this.huntHandler.cardHuntDamageReduction(
                action.card,
              );
              break;
            }
            default:
              throw new Error('Unknown card for hunt damage absorption');
          }
          params.tableCardsUsed = true;
          break;
        }
      }
    }
    return isGollumRevealing
      ? { absorbedDamage, gollumRevealing: isGollumRevealing }
      : { absorbedDamage };
  }

  async huntEffect(params: WotrHuntEffectParams): Promise<HuntEffect[]> {
    const story = await this.freePeoples.huntEffect(params);
    const actions = filterActions<HuntEffect>(
      story,
      'fellowship-corruption',
      'character-elimination',
      'companion-separation',
      'companion-random',
      'fellowship-reveal',
      'fellowship-reveal-in-mordor',
      'card-discard-from-table',
    );
    return actions;
  }

  async rollHuntDice(): Promise<WotrCombatDie[]> {
    const story = await this.shadow.rollHuntDice();
    const huntRoll = assertAction<WotrHuntRoll>(story, 'hunt-roll');
    return huntRoll.dice;
  }

  async reRollHuntDice(nReRolls: number): Promise<WotrCombatDie[]> {
    const story = await this.shadow.reRollHuntDice(nReRolls);
    const huntReRoll = assertAction<WotrHuntReRoll>(story, 'hunt-re-roll');
    return huntReRoll.dice;
  }

  async drawHuntTile(player: WotrPlayer): Promise<WotrHuntTileId> {
    const story = await player.drawHuntTile();
    const drawHuntTile = assertAction<WotrHuntTileDraw>(
      story,
      'hunt-tile-draw',
    );
    return drawHuntTile.tiles[0];
  }

  async revealFellowship(): Promise<void> {
    const story = await this.freePeoples.revealFellowship();
    assertAction<WotrFellowshipReveal>(story, 'fellowship-reveal');
  }

  async separateCompanions(
    player: WotrPlayer,
    options: WotrSeparateCompanionsOptions,
  ): Promise<void> {
    const story = await player.separateCompanions(options);
    assertAction<WotrCompanionSeparation>(story, 'companion-separation');
  }
}

import { inject, Injectable } from '@angular/core';
import { randomUtil } from '../../../../../../commons/utils/src';
import type { WotrAbility, WotrUiAbility } from '../../../ability/wotr-ability';
import type { WotrActionDie } from '../../../action-die/wotr-action-die-models';
import type {
  WotrActionDieChoiceModifier,
  WotrAfterActionDieCardResolution,
} from '../../../action-die/wotr-action-die-modifiers';
import { WotrActionDieModifiers } from '../../../action-die/wotr-action-die-modifiers';
import type { WotrCombatRoll } from '../../../battle/wotr-battle-actions';
import type {
  WotrCombatFront,
  WotrCombatRound,
} from '../../../battle/wotr-battle-models';
import type { WotrTableCombatCardGetter } from '../../../battle/wotr-battle-modifiers';
import { WotrBattleModifiers } from '../../../battle/wotr-battle-modifiers';
import type { WotrAfterCharacterElimination } from '../../../character/wotr-character-modifiers';
import { WotrCharacterModifiers } from '../../../character/wotr-character-modifiers';
import type { WotrAction } from '../../../commons/wotr-action-models';
import { findAction } from '../../../commons/wotr-action-models';
import type { WotrCompanionRandom } from '../../../fellowship/wotr-fellowship-actions';
import {
  chooseRandomCompanion,
  corruptFellowship,
  pushFellowship,
} from '../../../fellowship/wotr-fellowship-actions';
import { WotrFellowshipHandler } from '../../../fellowship/wotr-fellowship-handler';
import type { WotrFellowshipMove } from '../../../fellowship/wotr-fellowship-models';
import type { WotrAfterFellowshipDeclaration } from '../../../fellowship/wotr-fellowship-modifiers';
import { WotrFellowshipModifiers } from '../../../fellowship/wotr-fellowship-modifiers';
import { useElvenRing } from '../../../front/wotr-front-actions';
import { WotrGameQuery } from '../../../game/wotr-game-query';
import type { WotrUiChoice } from '../../../game/wotr-game-ui';
import type { WotrGameUiContext } from '../../../game/wotr-game-ui-context';
import type { WotrStory } from '../../../game/wotr-story-models';
import { assertAction } from '../../../game/wotr-story-models';
import type { WotrHuntTileDraw } from '../../../hunt/wotr-hunt-actions';
import { addHuntTile, lidlessEye } from '../../../hunt/wotr-hunt-actions';
import type { WotrHuntTileResolutionOptions } from '../../../hunt/wotr-hunt-flow';
import { WotrHuntFlow } from '../../../hunt/wotr-hunt-flow';
import { WotrHuntHandler } from '../../../hunt/wotr-hunt-handler';
import type {
  WotrAfterFellowshipReveal,
  WotrBeforeHuntRoll,
} from '../../../hunt/wotr-hunt-modifiers';
import { WotrHuntModifiers } from '../../../hunt/wotr-hunt-modifiers';
import { WotrHuntStore } from '../../../hunt/wotr-hunt-store';
import { WotrLogWriter } from '../../../log/wotr-log-writer';
import type {
  WotrAfterNationActivation,
  WotrCanActivateNationModifier,
} from '../../../nation/wotr-nation-modifiers';
import { WotrNationModifiers } from '../../../nation/wotr-nation-modifiers';
import { WotrFreePeoplesPlayer } from '../../../player/wotr-free-peoples-player';
import { WotrShadowPlayer } from '../../../player/wotr-shadow-player';
import type { WotrRegionChoose } from '../../../region/wotr-region-actions';
import { targetRegion } from '../../../region/wotr-region-actions';
import type { WotrRegionId } from '../../../region/wotr-region-models';
import type { WotrRegionQuery } from '../../../region/wotr-region-query';
import { WotrRegionStore } from '../../../region/wotr-region-store';
import { WotrUnitRules } from '../../../unit/wotr-unit-rules';
import { WotrUnitUtils } from '../../../unit/wotr-unit-utils';
import type {
  WotrCardDiscardFromTable,
  WotrCardPlayOnTable,
} from '../../wotr-card-actions';
import {
  discardCardFromTableById,
  discardRandomCardById,
  playCardOnTable,
  playCardOnTableId,
} from '../../wotr-card-actions';
import { WotrCardHandler } from '../../wotr-card-handler';
import type {
  WotrCardId,
  WotrShadowCharacterCardId,
} from '../../wotr-card-models';
import { isShadowCharacterCard } from '../../wotr-card-models';
import type { WotrEventCard } from '../wotr-cards';
import { activateTableCard } from '../wotr-cards';

@Injectable()
export class WotrShadowCharacterCards {
  private q = inject(WotrGameQuery);
  private huntFlow = inject(WotrHuntFlow);
  private huntStore = inject(WotrHuntStore);
  private cardHandler = inject(WotrCardHandler);
  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);
  private fellowshipHandler = inject(WotrFellowshipHandler);
  private unitRules = inject(WotrUnitRules);
  private huntHandler = inject(WotrHuntHandler);
  private huntModifiers = inject(WotrHuntModifiers);
  private fellowshipModifiers = inject(WotrFellowshipModifiers);
  private battleModifiers = inject(WotrBattleModifiers);
  private logger = inject(WotrLogWriter);
  private actionDieModifiers = inject(WotrActionDieModifiers);
  private nationModifiers = inject(WotrNationModifiers);
  private characterModifiers = inject(WotrCharacterModifiers);
  private unitUtils = inject(WotrUnitUtils);
  private regionStore = inject(WotrRegionStore);

  createCard(cardId: WotrShadowCharacterCardId): WotrEventCard {
    switch (cardId) {
      // Shelob's Lair
      // The "Shelob's Lair" special Hunt tile [die icon, stop] is now in play.
      // Add the tile to the Hunt Pool when the Fellowship is on the Mordor Track.
      case 'scha01':
        return {
          play: () => [addHuntTile('rds')],
        };
      // The Ring is Mine!
      // The "The Ring is Mine!" special Hunt tile [eye, reveal, stop] is now in play.
      // Add the tile to the Hunt Pool when the Fellowship is on the Mordor Track.
      case 'scha02':
        return {
          play: () => [addHuntTile('rers')],
        };
      // On, On They Went
      // The "On, On They Went" special Hunt tile [3, stop] is now in play.
      // Add the tile to the Hunt Pool when the Fellowship is on the Mordor Track.
      case 'scha03':
        return {
          play: () => [addHuntTile('r3s')],
        };
      // Give it to Uss!
      // The "Give it to Uss!" special Hunt tile [1, reveal, stop] is now in play.
      // Add the tile to the Hunt Pool when the Fellowship is on the Mordor Track.
      case 'scha04':
        return {
          play: () => [addHuntTile('r1rs')],
        };
      // Orc Patrol
      // Play if the Fellowship is not in a region containing a Free Peoples Settlement.
      // Draw a Hunt tile.
      // If the tile shows an Eye or is a Fellowship Special tile, discard it without effect.
      // Otherwise, follow the rules for a successful Hunt.
      case 'scha05':
        return {
          canBePlayed: () => !this.q.fellowship.isInFreePeoplesSettlement(),
          play: async (ui) => {
            if (this.huntModifiers.couldHuntDrawBePrevented()) return [];
            return [await ui.huntUi.drawHuntTile(1, 'scha05')];
          },
          effect: async (params) => {
            let story: WotrStory = params.story;
            if (this.huntModifiers.couldHuntDrawBePrevented()) {
              const isPrevented =
                await this.huntModifiers.isHuntDrawPrevented();
              if (isPrevented) return;
              story = await this.shadow.drawHuntTile();
            }
            const action = assertAction<WotrHuntTileDraw>(
              story,
              'hunt-tile-draw',
            );
            await this.huntFlow.resolveHuntTile(action.tiles[0], {
              ignoreEyeTile: true,
              ignoreFreePeopleSpecialTile: true,
            });
          },
        };
      // Isildur's Bane
      // Play if the Fellowship is not in a region containing a Free Peoples Settlement.
      // Draw a Hunt tile.
      // If the tile shows an Eye or is a Fellowship special tile, discard it without effect.
      // Otherwise, follow the rules for a successful Hunt, except that Hunt Damage may not be reduced in any way before using the Ring.
      case 'scha06':
        return {
          canBePlayed: () => !this.q.fellowship.isInFreePeoplesSettlement(),
          play: async (ui) => {
            if (this.huntModifiers.couldHuntDrawBePrevented()) return [];
            return [await ui.huntUi.drawHuntTile(1, 'scha06')];
          },
          effect: async (params) => {
            let story: WotrStory = params.story;
            if (this.huntModifiers.couldHuntDrawBePrevented()) {
              const isPrevented =
                await this.huntModifiers.isHuntDrawPrevented();
              if (isPrevented) return;
              story = await this.shadow.drawHuntTile();
            }
            const action = assertAction<WotrHuntTileDraw>(
              story,
              'hunt-tile-draw',
            );
            await this.huntFlow.resolveHuntTile(action.tiles[0], {
              ignoreEyeTile: true,
              ignoreFreePeopleSpecialTile: true,
              onlyRingAbsorbtion: true,
            });
          },
        };
      // Foul Thing from the Deep
      // Play if the Fellowship is not in a region containing a Free Peoples Settlement. Draw a Hunt tile.
      // If the tile shows an Eye or is a Fellowship special tile, discard it without effect.
      // Otherwise, follow the rules for a successful Hunt, except that the Free Peoples player must reduce Hunt Damage (if any) by eliminating a random Companion
      // (unless there are no Companions in the Fellowship) before using the Ring.
      case 'scha07':
        return {
          canBePlayed: () => !this.q.fellowship.isInFreePeoplesSettlement(),
          play: async (ui) => {
            if (this.huntModifiers.couldHuntDrawBePrevented()) return [];
            const action = await ui.huntUi.drawHuntTile(1, 'scha07');
            return [action];
          },
          effect: async (params) => {
            let story: WotrStory = params.story;
            if (this.huntModifiers.couldHuntDrawBePrevented()) {
              const isPrevented =
                await this.huntModifiers.isHuntDrawPrevented();
              if (isPrevented) return;
              story = await this.shadow.drawHuntTile();
            }
            const action = assertAction<WotrHuntTileDraw>(
              story,
              'hunt-tile-draw',
            );
            await this.huntFlow.resolveHuntTile(action.tiles[0], {
              ignoreEyeTile: true,
              ignoreFreePeopleSpecialTile: true,
              mustEliminateRandomCompanion: true,
            });
          },
        };
      // Candles of Corpses
      // Play if the Fellowship is not in a region containing a Free Peoples Settlement.
      // Roll three dice and add one Corruption point on each result of 4+.
      // If Gollum is the Guide, add one Corruption point on each result of '6' instead
      case 'scha08':
        return {
          canBePlayed: () => !this.q.fellowship.isInFreePeoplesSettlement(),
          play: async (ui) => [await ui.battleUi.rollCombatDice(3)],
          effect: (params) => {
            const action = assertAction<WotrCombatRoll>(
              params.story,
              'combat-roll',
            );
            const nCorruption = action.dice.filter(
              this.q.fellowship.guideIs('gollum')
                ? (die) => die === 6
                : (die) => die >= 4,
            ).length;
            if (nCorruption) {
              this.fellowshipHandler.corruptEffect(nCorruption);
            }
          },
        };
      // Nazgûl Search
      // Play if the Fellowship is on step 1 or higher on the Fellowship Track.
      // Move any or all of the Nazgûl.
      // Then, if at least one Nazgûl is in the region with the Fellowship, the Fellowship is revealed
      case 'scha09':
        return {
          canBePlayed: () => this.q.fellowship.progress() >= 1,
          play: async (ui) => ui.characterUi.moveAnyOrAllNazgul(),
          effect: async () => {
            const regionId = this.q.fellowship.regionId();
            if (this.q.region(regionId).hasNazgul()) {
              await this.huntFlow.revealFellowship();
            }
          },
        };
      // Cruel Weather
      // Play if the Fellowship is on step 1 or higher on the Fellowship Track.
      // Move the Fellowship to an adjacent region.
      case 'scha10':
        return {
          canBePlayed: () => this.q.fellowship.progress() >= 1,
          play: async (ui) => {
            const fellowshipRegionId = this.q.fellowship.regionId();
            const adjacentRegionIds = this.q
              .region(fellowshipRegionId)
              .region()
              .neighbors.filter((n) => !n.impassable)
              .map((n) => n.id);
            const regionId = await ui.askRegion(
              'Move the Fellowship to an adjacent region',
              adjacentRegionIds,
            );
            return [pushFellowship(regionId)];
          },
        };
      // The Nazgûl Strike!
      // Play if the Fellowship is on step 1 or higher on the Fellowship Track.
      // Move any or all of the Nazgûl.
      // Then, if at least one Nazgûl is in the region with the Fellowship, you may either discard one Free Peoples Character Event card from the table or roll for the Hunt (as
      // if the Free Peoples player had moved the Fellowship).
      case 'scha11':
        return {
          canBePlayed: () => this.q.fellowship.progress() >= 1,
          play: async (ui) => {
            const actions: WotrAction[] = [];
            const moveNazgulAction = await ui.characterUi.moveAnyOrAllNazgul();
            actions.push(...moveNazgulAction);

            const regionId = this.q.fellowship.regionId();
            if (this.q.region(regionId).hasNazgul()) {
              const option = await ui.askOption<'D' | 'H'>('Choose an effect', [
                {
                  value: 'D',
                  label:
                    'Discard a Free Peoples Character Event card from the table',
                  disabled: !this.q.freePeoples.hasCardsOnTable(),
                },
                {
                  value: 'H',
                  label: 'Roll for the Hunt',
                },
              ]);
              if (option === 'D') {
                const card = await ui.askTableCard('Choose a card to discard', {
                  frontId: 'free-peoples',
                  nCards: 1,
                  message: 'Discard',
                  cards: this.q.freePeoples.characterTableCards(),
                });
                actions.push(discardCardFromTableById(card));
              }
            }
            return actions;
          },
          effect: async (params) => {
            const regionId = this.q.fellowship.regionId();
            if (this.q.region(regionId).hasNazgul()) {
              const otherAction = findAction<WotrCardDiscardFromTable>(
                params.story.actions,
                'card-discard-from-table',
              );
              if (!otherAction) await this.huntFlow.resolveHunt();
            }
          },
        };
      // Morgul Wound
      // Play if the Fellowship is revealed.
      // If the Fellowship's current Corruption is three or less, add two Corruption points, otherwise add one Corruption point.
      case 'scha12':
        return {
          canBePlayed: () => this.q.fellowship.isRevealed(),
          play: () => {
            const nCorruption = this.q.fellowship.corruption() <= 3 ? 2 : 1;
            return [corruptFellowship(nCorruption)];
          },
        };
      // Lure of the Ring
      // Play if the Fellowship is revealed.
      // Randomly select one Companion in the Fellowship by drawing a Companion counter.
      // The Free Peoples player must choose either to add Corruption equal to the Companion's Level, or to eliminate him.
      // If Gollum is the Guide, add one Corruption point instead.
      case 'scha13':
        return {
          canBePlayed: () => this.q.fellowship.isRevealed(),
          play: () => {
            if (this.q.fellowship.guideIs('gollum')) {
              return [corruptFellowship(1)];
            } else {
              const companions = this.q.fellowship.companions();
              const randomCompanion = randomUtil.getRandomElement(companions);
              return [chooseRandomCompanion(randomCompanion)];
            }
          },
          effect: async (params) => {
            if (!this.q.fellowship.guideIs('gollum')) {
              const action = findAction<WotrCompanionRandom>(
                params.story.actions,
                'companion-random',
              );
              await this.freePeoples.lureOfTheRingEffect(action!.companions[0]);
            }
          },
        };
      // The Breaking of the Fellowship
      // Play if the Fellowship is revealed. Draw a Hunt tile.
      // If the tile shows an Eye or is a Fellowship Special tile, discard it without effect.
      // Otherwise, the Free Peoples player must separate a number of Companions equal to the number on the tile (if possible), placing them in the same region as the
      // Fellowship.
      // Ignore any "Reveal" or "Stop" icons on the tile.
      // If Gollum is the Guide, add one Corruption point instead
      case 'scha14':
        return {
          canBePlayed: () => this.q.fellowship.isRevealed(),
          play: async (ui) => {
            if (this.huntModifiers.couldHuntDrawBePrevented()) return [];
            return [await ui.huntUi.drawHuntTile(1, 'scha14')];
          },
          effect: async (params) => {
            let story: WotrStory = params.story;
            if (this.huntModifiers.couldHuntDrawBePrevented()) {
              const isPrevented =
                await this.huntModifiers.isHuntDrawPrevented();
              if (isPrevented) return;
              story = await this.shadow.drawHuntTile();
            }
            const action = assertAction<WotrHuntTileDraw>(
              story,
              'hunt-tile-draw',
            );
            const huntTile = this.huntStore.huntTile(action.tiles[0]);
            if (huntTile.eye || huntTile.type === 'free-people-special') {
              return;
            }
            let damage = huntTile.quantity;
            if (damage == null) {
              if (!huntTile.dice)
                throw new Error(`Unexpected hunt tile: ${huntTile.id}`);
              damage = (await this.huntFlow.rollShelobsLairDie()).die;
            }
            if (damage) {
              await this.huntFlow.separateCompanions(this.freePeoples, {
                nCompanions: damage,
                cardId: 'scha14',
              });
            }
          },
        };
      // Worn with Sorrow and Toil
      // Play on the table.
      // When "Worn with Sorrow and Toil" is in play, if a Companion in the Fellowship is taken as a casualty you may also discard one of the Free Peoples player's Character
      // Event cards from his hand (choosing it randomly) or from the table.
      // You must discard this card from the table immediately if the Fellowship is declared in an unconquered Free Peoples City or Stronghold.
      case 'scha15':
        return {
          canBePlayed: () => true,
          play: () => [playCardOnTableId('scha15')],
          onTableAbilities: () => {
            const casualtyAbility: WotrUiAbility<WotrAfterCharacterElimination> =
              {
                modifier: this.characterModifiers.afterCharacterElimination,
                handler: async (params) => {
                  if (params.fromTheFellowship) {
                    await activateTableCard(
                      casualtyAbility,
                      'scha15',
                      this.shadow,
                    );
                  }
                },
                play: async (ui) => {
                  const fpHasTableCards =
                    this.q.freePeoples.hasCharacterTableCards();
                  const fpHasHandCards =
                    this.q.freePeoples.hasCharacterHandCards();
                  let doDiscardTableCard = false;
                  let doDiscardHandCard = false;
                  if (fpHasTableCards) {
                    if (fpHasHandCards) {
                      doDiscardTableCard = await ui.askOption<boolean>(
                        'Choose the card to discard',
                        [
                          {
                            value: true,
                            label: 'A table card',
                          },
                          {
                            value: false,
                            label: 'A random card from hand',
                          },
                        ],
                      );
                    } else {
                      doDiscardTableCard = true;
                    }
                  } else {
                    if (fpHasHandCards) {
                      doDiscardHandCard = true;
                    }
                  }
                  if (doDiscardTableCard) {
                    const card = await ui.askTableCard(
                      'Choose a table card to discard',
                      {
                        frontId: 'free-peoples',
                        nCards: 1,
                        message: 'Discard',
                        cards: this.q.freePeoples.characterTableCards(),
                      },
                    );
                    return [discardCardFromTableById(card)];
                  } else if (doDiscardHandCard) {
                    await ui.askContinue(
                      'Discard a Free Peoples random card from hand',
                    );
                    const cards = this.q.freePeoples.characterHandCards();
                    const randomCard = randomUtil.getRandomElement(cards);
                    return [discardRandomCardById(randomCard)];
                  } else {
                    await ui.askContinue('No cards to discard');
                    return [];
                  }
                },
              };
            const discardAbility: WotrAbility<WotrAfterFellowshipDeclaration> =
              {
                modifier: this.fellowshipModifiers.afterDeclaration,
                handler: (params) => {
                  const region = this.q.region(params.toRegionId);
                  if (!region.isFreePeoplesRegion()) return;
                  if (!region.isCity() && !region.isStronghold()) return;
                  this.cardHandler.discardCardFromTableEffect('scha15');
                },
              };
            return [casualtyAbility, discardAbility];
          },
        };
      // Flocks of Crebain
      // Play on the table.
      // Before you make a Hunt roll, you may discard "Flocks of Crebain" to add 1 to all dice on that Hunt roll (including re-rolls).
      // You must discard this card from the table immediately if the Fellowship is declared in an unconquered Free Peoples City or Stronghold.
      case 'scha16':
        return {
          play: () => [playCardOnTable('Flocks of Crebain')],
          onTableAbilities: () => {
            const huntAbility: WotrUiAbility<WotrBeforeHuntRoll> = {
              modifier: this.huntModifiers.beforeHuntRoll,
              handler: async (modifiers) => {
                const actions = await activateTableCard(
                  huntAbility,
                  'scha16',
                  this.shadow,
                );
                if (!actions) return;
                modifiers.rollModifiers.push(1);
                modifiers.reRollModifiers.push(1);
              },
              play: () => [discardCardFromTableById('scha16')],
            };
            const discardAbility: WotrAbility<WotrAfterFellowshipDeclaration> =
              {
                modifier: this.fellowshipModifiers.afterDeclaration,
                handler: (params) => {
                  const region = this.q.region(params.toRegionId);
                  if (!region.isFreePeoplesRegion()) return;
                  if (!region.isCity() && !region.isStronghold()) return;
                  if (!region.isUnconquered()) return;
                  this.cardHandler.discardCardFromTableEffect('scha16');
                },
              };
            return [huntAbility, discardAbility];
          },
        };
      // Balrog of Moria
      // Play on the table.
      // You may discard "Balrog of Moria" to draw an additional Hunt tile if the Fellowship moves into,
      // out of, or through Moria while being declared or revealed. If the tile
      // shows an Eye, discard it without effect, otherwise follow the rules for a successful Hunt.
      // Ignore any "Reveal" icon on the drawn tile if the Fellowship has been declared in a Free Peoples City or Stronghold.
      // Or, you may discard "Balrog of Moria" to use its Combat card effect as if you were playing the card from your hand.
      case 'scha17':
        return {
          play: () => [playCardOnTable('Balrog of Moria')],
          onTableAbilities: () => {
            const moveHandler: (
              params: WotrFellowshipMove,
            ) => Promise<void> = async (params) => {
              if (
                !this.movingThroughMoria(
                  params.fromRegionId,
                  params.toRegionId,
                  params.distance,
                )
              )
                return;
              const actions = await activateTableCard(
                afterDeclarationAbility,
                'scha17',
                this.shadow,
              );
              if (!actions) return;
              const drawAction = findAction<WotrHuntTileDraw>(
                actions,
                'hunt-tile-draw',
              );
              if (!drawAction)
                throw new Error('Unexpected state: no hunt tile draw action');
              const tile = drawAction.tiles[0];
              const toRegion = this.q.region(params.toRegionId);
              const huntOptions: WotrHuntTileResolutionOptions = {
                ignoreEyeTile: true,
              };
              if (
                toRegion.isFreePeoplesRegion() &&
                (toRegion.isCity() || toRegion.isStronghold())
              )
                huntOptions.ignoreRevealIcon = true;
              await this.huntFlow.resolveHuntTile(tile, huntOptions);
            };
            const movePlay: (
              ui: WotrGameUiContext,
            ) => Promise<WotrAction[]> = async (ui) => {
              const huntTileDrawn = await ui.huntUi.drawHuntTile(1, 'scha17');
              return [discardCardFromTableById('scha17'), huntTileDrawn];
            };
            const afterDeclarationAbility: WotrUiAbility<WotrAfterFellowshipDeclaration> =
              {
                modifier: this.fellowshipModifiers.afterDeclaration,
                handler: moveHandler,
                play: movePlay,
              };
            const afterRevealAbility: WotrUiAbility<WotrAfterFellowshipReveal> =
              {
                modifier: this.huntModifiers.afterFellowshipReveal,
                handler: moveHandler,
                play: movePlay,
              };
            const combatAbility: WotrAbility<WotrTableCombatCardGetter> = {
              modifier: this.battleModifiers.tableCombatCardGetter,
              handler: () => ['scha17'],
            };
            return [afterDeclarationAbility, afterRevealAbility, combatAbility];
          },
        };
      // The Lidless Eye
      // Change up to three unused Shadow Action dice results into "Eye" results.
      // Place these dice in the Hunt Box immediately.
      case 'scha18':
        return {
          play: async (ui) => {
            const changedDice: WotrActionDie[] = [];
            let count = 0;
            while (this.q.shadow.actionDice().length > 0 && count < 3) {
              const die = await ui.askActionDieOrStop(
                'Choose an Action die to change into an Eye',
                'Continue',
                {
                  frontId: 'shadow',
                  specialDice: ['ruler'],
                },
              );
              if (die === 'stop') break;
              changedDice.push(die);
              this.huntHandler.lidlessEyeChange([die]);
              count++;
            }
            return [lidlessEye(...changedDice)];
          },
        };
      // Dreadful Spells
      // Play if a Shadow Army contianing Nazgûl is adjacent to, or is in the same region as, a Free Peoples Army.
      // Roll a number of dice equal to the number of Nazgûl (up to a maximum of 5) and score one hit for every result of 5+.
      case 'scha19':
        return {
          canBePlayed: () =>
            this.q.regions().some((r) => this.isDreadfulSpellsSourceRegion(r)),
          play: async (ui) => {
            const sourceRegions = this.q
              .regions()
              .filter((r) => this.isDreadfulSpellsSourceRegion(r));
            const sourceRegionId = await ui.askRegion(
              'Choose a region',
              sourceRegions.map((r) => r.id()),
            );
            const sourceRegion = this.q.region(sourceRegionId);
            const targetRegionIds: WotrRegionId[] = [];
            if (sourceRegion.hasArmy('free-peoples'))
              targetRegionIds.push(sourceRegion.id());
            sourceRegion.adjacentRegions().forEach((adjRegion) => {
              if (adjRegion.hasArmy('free-peoples'))
                targetRegionIds.push(adjRegion.id());
            });
            const targetRegionId = await ui.askRegion(
              'Choose a Free Peoples army to attack',
              targetRegionIds,
            );
            const shadowArmy = this.q.region(sourceRegionId).army('shadow')!;
            const nNazgul = this.unitUtils.nazgulCount(shadowArmy);
            const roll = await ui.battleUi.rollCombatDice(Math.min(nNazgul, 5));
            return [targetRegion(targetRegionId), roll];
          },
          effect: async (params) => {
            const regionChoose = assertAction<WotrRegionChoose>(
              params.story,
              'region-choose',
            );
            const combatRoll = assertAction<WotrCombatRoll>(
              params.story,
              'combat-roll',
            );
            const nHits = combatRoll.dice.filter((die) => die >= 5).length;
            if (!nHits) return;
            const freePeoplesArmy = this.q
              .region(regionChoose.region)
              .army('free-peoples')!;
            const hitPoints = this.unitUtils.nHits(freePeoplesArmy);
            if (nHits >= hitPoints) {
              await this.freePeoples.eliminateArmy(
                regionChoose.region,
                params.cardId,
              );
            } else {
              await this.freePeoples.chooseCasualties(
                nHits,
                regionChoose.region,
                params.cardId,
              );
            }
          },
        };
      // Grond, Hammer of the Underworld
      // Play if the Witch-king is in play and is with a Shadow Army besieging a Stronghold.
      // Attack that Stronghold. The siege lasts for three Combat rounds instead of one. During the first round, the Free Peoples player cannot use a Combat card unless a
      // Companion is in the battle.
      case 'scha20':
        return {
          canBePlayed: () => {
            const witchKing = this.q.character('the-witch-king');
            if (!witchKing.isInPlay()) return false;
            const regionId = witchKing.region()!.id;
            const region = this.q.region(regionId);
            return region.isBesiegedBy('shadow');
          },
          play: async (ui) => {
            const regionId = this.q.character('the-witch-king').region()!.id;
            return ui.unitUi.attackStronghold(regionId, 'shadow');
          },
          onBattleAbilities: () => {
            return [
              {
                modifier: this.battleModifiers.nSiegeRoundsModifier,
                handler: () => 3,
              },
              {
                modifier: this.battleModifiers.canUseCombatCardModifier,
                handler: (
                  combatFront: WotrCombatFront,
                  combatRound: WotrCombatRound,
                ) => {
                  if (combatFront.frontId !== 'free-peoples') return true;
                  if (combatRound.round !== 1) return true;
                  const freeArmy = combatRound.defender.army();
                  if (this.unitUtils.hasCompanions(freeArmy)) return true;
                  return false;
                },
              },
            ];
          },
        };
      // The Palantír of Orthanc
      // Play on the table if Saruman is in play.
      // When "The Palantír of Orthanc" is in play, after you use an Event Action die result to play an Event card, immediately draw another card from either one of your decks.
      // The Free Peoples player can force "The Palantír of Orthanc" to be discarded by either using a Will of the West Action die result, or using any Action die result and one
      // Elven Ring. You must discard this card if Saruman is eliminated.
      // https://boardgamegeek.com/thread/1139889/article/15203738#15203738
      case 'scha21':
        return {
          canBePlayed: () => this.q.saruman.isInPlay(),
          play: () => [playCardOnTableId('scha21')],
          onTableAbilities: () => {
            let playedCard: WotrCardId | null = null;
            const drawAbility: WotrUiAbility<WotrAfterActionDieCardResolution> =
              {
                modifier: this.actionDieModifiers.afterActionDieCardResolution,
                handler: async (story, frontId) => {
                  if (frontId !== 'shadow') return;
                  if (
                    story.die === 'event' ||
                    story.die === 'will-of-the-west'
                  ) {
                    const isBeingPlayed =
                      findAction<WotrCardPlayOnTable>(
                        story.actions,
                        'card-play-on-table',
                      )?.card === 'scha21' || false;
                    if (isBeingPlayed) return;
                    playedCard = story.card;
                    await activateTableCard(drawAbility, 'scha21', this.shadow);
                  }
                },
                play: async (ui) => {
                  if (!playedCard) throw new Error('Unexpected state');
                  const action = isShadowCharacterCard(playedCard)
                    ? await ui.cardDrawUi.drawCards(1, 'character', 'shadow')
                    : await ui.cardDrawUi.drawCards(1, 'strategy', 'shadow');
                  return [action];
                },
              };
            const discardAbility: WotrAbility<WotrActionDieChoiceModifier> = {
              modifier: this.actionDieModifiers.actionDieChoices,
              handler: ({ dieResult, frontId }) => {
                if (frontId !== 'free-peoples') return [];
                const choice: WotrUiChoice = {
                  label: () => 'Discard The Palantír of Orthanc',
                  isAvailable: () => {
                    if (dieResult === 'will-of-the-west') return true;
                    return this.q.freePeoples.hasElvenRings();
                  },
                  actions: async (_params, ui) => {
                    const actions: WotrAction[] = [
                      discardCardFromTableById('scha21'),
                    ];
                    if (dieResult !== 'will-of-the-west') {
                      const elvenRing = await ui.askElvenRing(
                        'Choose an Elven Ring to use',
                        {
                          rings: this.q.freePeoples.elvenRings(),
                          frontId: 'free-peoples',
                        },
                      );
                      actions.push(useElvenRing(elvenRing));
                    }
                    return actions;
                  },
                };
                return [choice];
              },
            };
            return [drawAbility, discardAbility];
          },
        };
      // Wormtongue
      // Play on the table if Saruman is in play.
      // When "Wormtongue" is in play, Rohan cannot be activated except by an appropriate Companion, or by the Fellowship being declared in Edoras or Helm's Deep, or
      // by an attack on Edoras or Helm's Deep.
      // You must discard this card from the table as soon as Rohan is activated, or if Saruman is eliminated.
      // https://boardgamegeek.com/thread/1776050/wormtongue-event-card-faq
      case 'scha22':
        return {
          canBePlayed: () => this.q.saruman.isInPlay(),
          play: () => [playCardOnTableId('scha22')],
          onTableAbilities: () => {
            const cannotActivate: WotrAbility<WotrCanActivateNationModifier> = {
              modifier: this.nationModifiers.canActivateNationModifier,
              handler: (nationId, source) => {
                if (nationId !== 'rohan') return true;
                if (
                  source === 'companion-ability' ||
                  source === 'fellowship-declaration'
                )
                  return true;
                if (
                  typeof source === 'object' &&
                  source.type === 'army-attack'
                ) {
                  if (
                    source.toRegion === 'edoras' ||
                    source.toRegion === 'helms-deep'
                  ) {
                    return true;
                  }
                }
                return false;
              },
            };
            const discardForActivation: WotrAbility<WotrAfterNationActivation> =
              {
                modifier: this.nationModifiers.afterNationActivation,
                handler: (nationId) => {
                  if (nationId === 'rohan') {
                    this.cardHandler.discardCardFromTableEffect('scha22');
                  }
                },
              };
            const discardForSarumanElimination: WotrAbility<WotrAfterCharacterElimination> =
              {
                modifier: this.characterModifiers.afterCharacterElimination,
                handler: (params) => {
                  if (params.characterId === 'saruman') {
                    this.cardHandler.discardCardFromTableEffect('scha22');
                  }
                },
              };
            return [
              cannotActivate,
              discardForActivation,
              discardForSarumanElimination,
            ];
          },
        };
      // The Ringwraiths Are Abroad
      // Move any or all of the Nazgûl.
      // Then, you may either move two Armies each containing a Nazgûl, or attack with one Army containing a Nazgûl.
      case 'scha23':
        return {
          play: async (ui) => {
            const actions: WotrAction[] = [];
            actions.push(...(await ui.characterUi.moveAnyOrAllNazgul()));
            const option = await ui.askOption<'move' | 'attack'>(
              'Choose an action',
              [
                { value: 'move', label: 'Move two armies' },
                { value: 'attack', label: 'Attack with one army' },
              ],
            );
            if (option === 'move') {
              actions.push(
                ...(await ui.unitUi.moveArmies('shadow', 2, ['anyNazgul'])),
              );
            } else {
              actions.push(
                ...(await ui.unitUi.attack('shadow', ['anyNazgul'])),
              );
            }
            return actions;
          },
        };
      // The Black Captain Commands
      // Play if the Witch-king is in play.
      // You may either recruit two Nazgûl in the region containing the Witch-king, or move any or all of the Nazgûl.
      // Then, you may move or attack with an Army containing the Witch-king.
      case 'scha24':
        return {
          canBePlayed: () => this.q.theWitchKing.isInPlay(),
          play: async (ui) => {
            const choice1 = await ui.askOption<'recruit' | 'move'>('Choose', [
              { value: 'recruit', label: 'Recruit two Nazgûl' },
              { value: 'move', label: 'Move any or all Nazgûl' },
            ]);
            const actions: WotrAction[] = [];
            const regionId = this.q.theWitchKing.region()!.id;
            if (choice1 === 'recruit') {
              actions.push(
                ...(await ui.unitUi.recruitUnitsInSameRegionByCard(
                  regionId,
                  'sauron',
                  0,
                  0,
                  2,
                )),
              );
            } else if (choice1 === 'move') {
              actions.push(...(await ui.characterUi.moveAnyOrAllNazgul()));
            }
            const wkRegionId = this.q.theWitchKing.region()!.id;
            const wkRegion = this.q.region(wkRegionId);
            if (!wkRegion.hasArmy('shadow')) return actions;
            const canMove = this.unitRules.canMoveArmyFromRegion(
              wkRegion.region(),
              'shadow',
            );
            const canAttack = this.unitRules.canArmyAttack(
              wkRegion.army('shadow')!,
              wkRegion.region(),
            );
            if (!canMove && !canAttack) return actions;
            const choice2 = await ui.askOption<'move' | 'attack'>('Choose', [
              {
                value: 'move',
                label: 'Move with the Witch-king',
                disabled: !canMove,
              },
              {
                value: 'attack',
                label: 'Attack with the Witch-king',
                disabled: !canAttack,
              },
            ]);
            if (choice2 === 'move') {
              actions.push(
                ...(
                  await ui.unitUi.moveArmy('shadow', ['the-witch-king'], [])
                )[0],
              );
            } else if (choice2 === 'attack') {
              actions.push(
                ...(await ui.unitUi.attackWithCharacter('the-witch-king')),
              );
            }
            return actions;
          },
        };
      // KOME
      // Your Welcome Is Doubtful
      // Play on the table.
      // While this card is in play, the Free Peoples player cannot
      // remove Corruption from a Sovereign, and can only awaken a
      // Sovereign if his Nation is "At War".
      // The Free Peoples player can force "Your Welcome Is Doubtful" to be discarded
      // by using a Will of the West Action die result, or a Character Action die result
      // if a non-Corrupted Sovereign and a Companion are together in the same region.
      case 'scha25km': // TODO KOME
        return {
          canBePlayed: () => false,
          play: () => [],
        };
      // The West has Failed
      // Initiate a corruption attempt on a Sovereign in a region adjacent to,
      // or in the same region as, a Nazgul, without removing an Eye die from the Hunt Box.
      // This corruption attempt is possible event if the Free Peoples player
      // has no unused Action dice left.
      case 'scha26km': // TODO KOME
        return {
          canBePlayed: () => false,
          play: () => [],
        };
    }
  }

  private isDreadfulSpellsSourceRegion(r: WotrRegionQuery): boolean {
    const shadowArmy = r.army('shadow');
    if (!shadowArmy) return false;
    if (!this.unitUtils.hasNazgul(shadowArmy)) return false;
    if (r.hasArmy('free-peoples')) return true;
    return r.adjacentRegions().some((n) => n.hasArmy('free-peoples'));
  }

  private movingThroughMoria(
    fromRegionId: WotrRegionId,
    toRegionId: WotrRegionId,
    maxDistance: number,
  ): boolean {
    return this.regionStore.movingThroughRegion(
      fromRegionId,
      toRegionId,
      maxDistance,
      (regionId) => regionId === 'moria',
    );
  }
}

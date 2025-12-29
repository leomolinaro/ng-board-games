import { inject, Injectable } from "@angular/core";
import { randomUtil } from "../../../../../commons/utils/src";
import { WotrAbility, WotrUiAbility } from "../../ability/wotr-ability";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import {
  WotrActionDieChoiceModifier,
  WotrActionDieModifiers,
  WotrAfterActionDieCardResolution
} from "../../action-die/wotr-action-die-modifiers";
import { WotrCombatRoll } from "../../battle/wotr-battle-actions";
import { WotrBattleUi } from "../../battle/wotr-battle-ui";
import { WotrCombatDie } from "../../battle/wotr-combat-die-models";
import { WotrCharacterUi } from "../../character/wotr-character-ui";
import { findAction, WotrAction } from "../../commons/wotr-action-models";
import {
  chooseRandomCompanion,
  corruptFellowship,
  pushFellowship,
  WotrCompanionRandom
} from "../../fellowship/wotr-fellowship-actions";
import { WotrFellowshipHandler } from "../../fellowship/wotr-fellowship-handler";
import {
  WotrAfterFellowshipDeclaration,
  WotrFellowshipModifiers
} from "../../fellowship/wotr-fellowship-modifiers";
import { useElvenRing } from "../../front/wotr-front-actions";
import { WotrGameQuery } from "../../game/wotr-game-query";
import { WotrGameUi, WotrUiChoice } from "../../game/wotr-game-ui";
import { assertAction } from "../../game/wotr-story-models";
import { addHuntTile, lidlessEye, WotrHuntTileDraw } from "../../hunt/wotr-hunt-actions";
import { WotrHuntFlow } from "../../hunt/wotr-hunt-flow";
import { WotrHuntHandler } from "../../hunt/wotr-hunt-handler";
import { WotrBeforeHuntRoll, WotrHuntModifiers } from "../../hunt/wotr-hunt-modifiers";
import { WotrHuntStore } from "../../hunt/wotr-hunt-store";
import { WotrHuntUi } from "../../hunt/wotr-hunt-ui";
import { WotrLogWriter } from "../../log/wotr-log-writer";
import { WotrFreePeoplesPlayer } from "../../player/wotr-free-peoples-player";
import { WotrPlayer } from "../../player/wotr-player";
import { WotrShadowPlayer } from "../../player/wotr-shadow-player";
import { WotrRegionChoose } from "../../region/wotr-region-actions";
import { WotrUnitRules } from "../../unit/wotr-unit-rules";
import { WotrUnitUi } from "../../unit/wotr-unit-ui";
import {
  discardCardFromTableById,
  playCardOnTable,
  playCardOnTableId,
  WotrCardDiscardFromTable
} from "../wotr-card-actions";
import { WotrCardDrawUi } from "../wotr-card-draw-ui";
import { WotrCardHandler } from "../wotr-card-handler";
import {
  isFreePeopleCharacterCard,
  isShadowCharacterCard,
  WotrCardId,
  WotrShadowCharacterCardId
} from "../wotr-card-models";
import { activateTableCard, WotrEventCard } from "./wotr-cards";

@Injectable({ providedIn: "root" })
export class WotrShadowCharacterCards {
  private q = inject(WotrGameQuery);
  private ui = inject(WotrGameUi);
  private huntUi = inject(WotrHuntUi);
  private huntFlow = inject(WotrHuntFlow);
  private characterUi = inject(WotrCharacterUi);
  private huntStore = inject(WotrHuntStore);
  private cardHandler = inject(WotrCardHandler);
  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);
  private fellowshipHandler = inject(WotrFellowshipHandler);
  private unitUi = inject(WotrUnitUi);
  private unitRules = inject(WotrUnitRules);
  private huntHandler = inject(WotrHuntHandler);
  private huntModifiers = inject(WotrHuntModifiers);
  private fellowshipModifiers = inject(WotrFellowshipModifiers);
  private battleUi = inject(WotrBattleUi);
  private logger = inject(WotrLogWriter);
  private actionDieModifiers = inject(WotrActionDieModifiers);
  private cardUi = inject(WotrCardDrawUi);

  createCard(cardId: WotrShadowCharacterCardId): WotrEventCard {
    switch (cardId) {
      // Shelob's Lair
      // The "Shelob's Lair" special Hunt tile [die icon, stop] is now in play.
      // Add the tile to the Hunt Pool when the Fellowship is on the Mordor Track.
      case "scha01":
        return {
          play: async () => [addHuntTile("rds")]
        };
      // The Ring is Mine!
      // The "The Ring is Mine!" special Hunt tile [eye, reveal, stop] is now in play.
      // Add the tile to the Hunt Pool when the Fellowship is on the Mordor Track.
      case "scha02":
        return {
          play: async () => [addHuntTile("rers")]
        };
      // On, On They Went
      // The "On, On They Went" special Hunt tile [3, stop] is now in play.
      // Add the tile to the Hunt Pool when the Fellowship is on the Mordor Track.
      case "scha03":
        return {
          play: async () => [addHuntTile("r3s")]
        };
      // Give it to Uss!
      // The "Give it to Uss!" special Hunt tile [1, reveal, stop] is now in play.
      // Add the tile to the Hunt Pool when the Fellowship is on the Mordor Track.
      case "scha04":
        return {
          play: async () => [addHuntTile("r1rs")]
        };
      // Orc Patrol
      // Play if the Fellowship is not in a region containing a Free Peoples Settlement.
      // Draw a Hunt tile.
      // If the tile shows an Eye or is a Fellowship Special tile, discard it without effect. Otherwise, follow the rules for a successful Hunt.
      case "scha05":
        return {
          canBePlayed: () => !this.q.fellowship.isInFreePeoplesSettlement(),
          play: async () => [await this.huntUi.drawHuntTile()],
          effect: async params => {
            const action = assertAction<WotrHuntTileDraw>(params.story, "hunt-tile-draw");
            await this.huntFlow.resolveHuntTile(action.tile, {
              ignoreEyeTile: true,
              ignoreFreePeopleSpecialTile: true
            });
          }
        };
      // Isildur's Bane
      // Play if the Fellowship is not in a region containing a Free Peoples Settlement.
      // Draw a Hunt tile.
      // If the tile shows an Eye or is a Fellowship special tile, discard it without effect.
      // Otherwise, follow the rules for a successful Hunt, except that Hunt Damage may not be reduced in any way before using the Ring.
      case "scha06":
        return {
          canBePlayed: () => !this.q.fellowship.isInFreePeoplesSettlement(),
          play: async () => [await this.huntUi.drawHuntTile()],
          effect: async params => {
            const action = assertAction<WotrHuntTileDraw>(params.story, "hunt-tile-draw");
            await this.huntFlow.resolveHuntTile(action.tile, {
              ignoreEyeTile: true,
              ignoreFreePeopleSpecialTile: true,
              onlyRingAbsorbtion: true
            });
          }
        };
      // TODO Foul Thing from the Deep
      // Play if the Fellowship is not in a region containing a Free Peoples Settlement. Draw a Hunt tile.
      // If the tile shows an Eye or is a Fellowship special tile, discard it without effect.
      // Otherwise, follow the rules for a successful Hunt, except that the Free Peoples player must reduce Hunt Damage (if any) by eliminating a random Companion
      // (unless there are no Companions in the Fellowship) before using the Ring.
      case "scha07":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // Candles of Corpses
      // Play if the Fellowship is not in a region containing a Free Peoples Settlement.
      // Roll three dice and add one Corruption point on each result of 4+.
      // If Gollum is the Guide, add one Corruption point on each result of '6' instead
      case "scha08":
        return {
          canBePlayed: () => !this.q.fellowship.isInFreePeoplesSettlement(),
          play: async () => [await this.battleUi.rollCombatDice(3, "shadow")],
          effect: async params => {
            const action = assertAction<WotrCombatRoll>(params.story, "combat-roll");
            const nCorruption = action.dice.filter(
              this.q.fellowship.guideIs("gollum") ? die => die === 6 : die => die >= 4
            ).length;
            if (nCorruption) {
              this.fellowshipHandler.corrupt(nCorruption);
              this.logger.logEffect(corruptFellowship(nCorruption));
            }
          }
        };
      // Nazgûl Search
      // Play if the Fellowship is on step 1 or higher on the Fellowship Track.
      // Move any or all of the Nazgûl.
      // Then, if at least one Nazgûl is in the region with the Fellowship, the Fellowship is revealed
      case "scha09":
        return {
          canBePlayed: () => this.q.fellowship.progress() >= 1,
          play: async () => this.characterUi.moveAnyOrAllNazgul(),
          effect: async params => {
            const regionId = this.q.fellowship.regionId();
            if (this.q.region(regionId).hasNazgul()) {
              await this.huntFlow.revealFellowship();
            }
          }
        };
      // Cruel Weather
      // Play if the Fellowship is on step 1 or higher on the Fellowship Track.
      // Move the Fellowship to an adjacent region.
      case "scha10":
        return {
          canBePlayed: () => this.q.fellowship.progress() >= 1,
          play: async () => {
            const fellowshipRegionId = this.q.fellowship.regionId();
            const adjacentRegionIds = this.q
              .region(fellowshipRegionId)
              .region()
              .neighbors.filter(n => !n.impassable)
              .map(n => n.id);
            const regionId = await this.ui.askRegion(
              "Move the Fellowship to an adjacent region",
              adjacentRegionIds
            );
            return [pushFellowship(regionId)];
          }
        };
      // The Nazgûl Strike!
      // Play if the Fellowship is on step 1 or higher on the Fellowship Track.
      // Move any or all of the Nazgûl.
      // Then, if at least one Nazgûl is in the region with the Fellowship, you may either discard one Free Peoples Character Event card from the table or roll for the Hunt (as
      // if the Free Peoples player had moved the Fellowship).
      case "scha11":
        return {
          canBePlayed: () => this.q.fellowship.progress() >= 1,
          play: async () => {
            const actions: WotrAction[] = [];
            const moveNazgulAction = await this.characterUi.moveAnyOrAllNazgul();
            actions.push(...moveNazgulAction);

            const regionId = this.q.fellowship.regionId();
            if (this.q.region(regionId).hasNazgul()) {
              const option = await this.ui.askOption<"D" | "H">("Choose an effect", [
                {
                  value: "D",
                  label: "Discard a Free Peoples Character Event card from the table",
                  disabled: !this.q.freePeoples.hasCardsOnTable()
                },
                {
                  value: "H",
                  label: "Roll for the Hunt"
                }
              ]);
              if (option === "D") {
                const card = await this.ui.askTableCard("Choose a card to discard", {
                  frontId: "free-peoples",
                  nCards: 1,
                  message: "Discard",
                  cards: this.q.freePeoples.handCards().filter(c => isFreePeopleCharacterCard(c))
                });
                actions.push(discardCardFromTableById(card));
              }
            }
            return actions;
          },
          effect: async params => {
            const regionId = this.q.fellowship.regionId();
            if (this.q.region(regionId).hasNazgul()) {
              const otherAction = findAction<WotrCardDiscardFromTable>(
                params.story.actions,
                "card-discard-from-table"
              );
              if (!otherAction) await this.huntFlow.resolveHunt();
            }
          }
        };
      // Morgul Wound
      // Play if the Fellowship is revealed.
      // If the Fellowship's current Corruption is three or less, add two Corruption points, otherwise add one Corruption point.
      case "scha12":
        return {
          canBePlayed: () => this.q.fellowship.isRevealed(),
          play: async () => {
            const nCorruption = this.q.fellowship.corruption() <= 3 ? 2 : 1;
            return [corruptFellowship(nCorruption)];
          }
        };
      // Lure of the Ring
      // Play if the Fellowship is revealed.
      // Randomly select one Companion in the Fellowship by drawing a Companion counter.
      // The Free Peoples player must choose either to add Corruption equal to the Companion's Level, or to eliminate him.
      // If Gollum is the Guide, add one Corruption point instead.
      case "scha13":
        return {
          canBePlayed: () => this.q.fellowship.isRevealed(),
          play: async () => {
            if (this.q.fellowship.guideIs("gollum")) {
              return [corruptFellowship(1)];
            } else {
              const companions = this.q.fellowship.companions();
              const randomCompanion = randomUtil.getRandomElement(companions);
              return [chooseRandomCompanion(randomCompanion)];
            }
          },
          effect: async params => {
            if (!this.q.fellowship.guideIs("gollum")) {
              const action = findAction<WotrCompanionRandom>(
                params.story.actions,
                "companion-random"
              );
              await this.freePeoples.lureOfTheRingEffect(action!.companions[0]);
            }
          }
        };
      // TODO The Breaking of the Fellowship
      // Play if the Fellowship is revealed. Draw a Hunt tile.
      // If the tile shows an Eye or is a Fellowship Special tile, discard it without effect.
      // Otherwise, the Free Peoples player must separate a number of Companions equal to the number on the tile (if possible), placing them in the same region as the
      // Fellowship.
      // Ignore any "Reveal" or "Stop" icons on the tile.
      // If Gollum is the Guide, add one Corruption point instead
      case "scha14":
        return {
          canBePlayed: () => false,
          play: async () => [],
          effect: async params => {
            const action = assertAction<WotrHuntTileDraw>(params.story, "hunt-tile-draw");
            const huntTile = this.huntStore.huntTile(action.tile);
            if (huntTile.eye || huntTile.type === "free-people-special") {
              return;
            }
            const damage = huntTile.quantity!; // TODO shelob die
            if (damage) {
              await this.huntFlow.separateCompanions(this.freePeoples);
            }
          }
        };
      // TODO Worn with Sorrow and Toil
      // Play on the table.
      // When "Worn with Sorrow and Toil" is in play, if a Companion in the Fellowship is taken as a casualty you may also discard one of the Free Peoples player's Character
      // Event cards from his hand (choosing it randomly) or from the table.
      // You must discard this card from the table immediately if the Fellowship is declared in an unconquered Free Peoples City or Stronghold.
      case "scha15":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // Flocks of Crebain
      // Play on the table.
      // Before you make a Hunt roll, you may discard "Flocks of Crebain" to add 1 to all dice on that Hunt roll (including re-rolls).
      // You must discard this card from the table immediately if the Fellowship is declared in an unconquered Free Peoples City or Stronghold.
      case "scha16":
        return {
          play: async () => [playCardOnTable("Flocks of Crebain")],
          onTableAbilities: () => {
            const huntAbility: WotrUiAbility<WotrBeforeHuntRoll> = {
              modifier: this.huntModifiers.beforeHuntRoll,
              handler: async modifiers => {
                const actions = await activateTableCard(huntAbility, "scha16", this.shadow);
                if (!actions) return;
                modifiers.rollModifiers.push(1);
                modifiers.reRollModifiers.push(1);
              },
              play: async () => [discardCardFromTableById("scha16")]
            };
            const discardAbility: WotrAbility<WotrAfterFellowshipDeclaration> = {
              modifier: this.fellowshipModifiers.afterDeclaration,
              handler: async regionId => {
                const region = this.q.region(regionId);
                if (!region.isFreePeoplesRegion()) return;
                if (!region.isCity() && !region.isStronghold()) return;
                if (!region.isUnconquered()) return;
                this.cardHandler.discardCardFromTableEffect("scha16");
              }
            };
            return [huntAbility, discardAbility];
          }
        };
      // TODO Balrog of Moria
      // Play on the table.
      // You may discard "Balrog of Moria" to draw an additional Hunt tile if the Fellowship moves into, out of, or through Moria while being declared or revealed. If the tile
      // shows an Eye, discard it without effect, otherwise follow the rules for a successful Hunt.
      // Ignore any "Reveal" icon on the drawn tile if the Fellowship has been declared in a Free Peoples City or Stronghold.
      // Or, you may discard "Balrog of Moria" to use its Combat card effect as if you were playing the card from your hand.
      case "scha17":
        return {
          play: async () => [playCardOnTable("Balrog of Moria")],
          onTableAbilities: () => {
            const abilities: WotrAbility[] = [];
            console.error("Balrog of Moria on-table abilities not implemented yet");
            return abilities;
          }
        };
      // The Lidless Eye
      // Change up to three unused Shadow Action dice results into "Eye" results.
      // Place these dice in the Hunt Box immediately.
      case "scha18":
        return {
          play: async () => {
            const changedDice: WotrActionDie[] = [];
            let count = 0;
            while (this.q.shadow.actionDice().length > 0 && count < 3) {
              const die = await this.ui.askActionDieOrStop(
                "Choose an Action die to change into an Eye",
                "Continue",
                "shadow"
              );
              if (die === "stop") break;
              changedDice.push(die);
              this.huntHandler.lidlessEyeChange([die]);
              count++;
            }
            return [lidlessEye(...changedDice)];
          }
        };
      // TODO Dreadful Spells
      // Play if a Shadow Army contianing Nazgûl is adjacent to, or is in the same region as, a Free Peoples Army.
      // Roll a number of dice equal to the number of Nazgûl (up to a maximum of 5) and score one hit for every result of 5+.
      case "scha19":
        return {
          canBePlayed: () => false,
          play: async () => [],
          effect: async params => {
            const action = assertAction<WotrRegionChoose>(params.story, "region-choose");
            await this.rollCombatDice(1, this.shadow); // TODO nDice
            await this.freePeoples.chooseCasualties(1, action.region, null); // TODO hitPoints
          }
        };
      // Grond, Hammer of the Underworld
      // Play if the Witch-king is in play and is with a Shadow Army besieging a Stronghold.
      // Attack that Stronghold. The siege lasts for three Combat rounds instead of one. During the first round, the Free Peoples player cannot use a Combat card unless a
      // Companion is in the battle.
      case "scha20":
        return {
          canBePlayed: () => {
            const witchKing = this.q.character("the-witch-king");
            if (!witchKing.isInPlay()) return false;
            const regionId = witchKing.region()!.id;
            const region = this.q.region(regionId);
            return region.isBesiegedBy("shadow");
          },
          play: async () => {
            const regionId = this.q.character("the-witch-king").region()!.id;
            return this.unitUi.attackStronghold(regionId, "shadow");
          }
        };
      // The Palantír of Orthanc
      // Play on the table if Saruman is in play.
      // When "The Palantír of Orthanc" is in play, after you use an Event Action die result to play an Event card, immediately draw another card from either one of your decks.
      // The Free Peoples player can force "The Palantír of Orthanc" to be discarded by either using a Will of the West Action die result, or using any Action die result and one
      // Elven Ring. You must discard this card if Saruman is eliminated.
      case "scha21":
        return {
          canBePlayed: () => this.q.saruman.isInPlay(),
          play: async () => [playCardOnTableId("scha21")],
          onTableAbilities: () => {
            let playedCard: WotrCardId | null = null;
            const drawAbility: WotrUiAbility<WotrAfterActionDieCardResolution> = {
              modifier: this.actionDieModifiers.afterActionDieCardResolution,
              handler: async (story, frontId) => {
                if (story.die === "event" || story.die === "will-of-the-west") {
                  playedCard = story.card;
                  await activateTableCard(drawAbility, "scha21", this.shadow);
                }
              },
              play: async () => {
                if (!playedCard) throw new Error("Unexpected state");
                const action = isShadowCharacterCard(playedCard)
                  ? await this.cardUi.drawCards(1, "character", "shadow")
                  : await this.cardUi.drawCards(1, "strategy", "shadow");
                return [action];
              }
            };
            const discardAbility: WotrAbility<WotrActionDieChoiceModifier> = {
              modifier: this.actionDieModifiers.actionDieChoices,
              handler: die => {
                const choice: WotrUiChoice = {
                  label: () => "Discard The Palantír of Orthanc",
                  isAvailable: () => {
                    if (die === "will-of-the-west") return true;
                    return this.q.freePeoples.hasElvenRings();
                  },
                  actions: async () => {
                    const actions: WotrAction[] = [discardCardFromTableById("scha21")];
                    if (die !== "will-of-the-west") {
                      const elvenRing = await this.ui.askElvenRing("Choose an Elven Ring to use", {
                        rings: this.q.freePeoples.elvenRings(),
                        frontId: "free-peoples"
                      });
                      actions.push(useElvenRing(elvenRing));
                    }
                    return actions;
                  }
                };
                return [choice];
              }
            };
            return [drawAbility, discardAbility];
          }
        };
      // TODO Wormtongue
      // Play on the table if Saruman is in play.
      // When "Wormtongue" is in play, Rohan cannot be activated except by an appropriate Companion, or by the Fellowship being declared in Edoras or Helm's Deep, or
      // by an attack on Edoras or Helm's Deep.
      // You must discard this card from the table as soon as Rohan is activated, or if Saruman is eliminated.
      case "scha22":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO The Ringwraiths Are Abroad
      // Move any or all of the Nazgûl.
      // Then, you may either move two Armies each containing a Nazgûl, or attack with one Army containing a Nazgûl.
      case "scha23":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // The Black Captain Commands
      // Play if the Witch-king is in play.
      // You may either recruit two Nazgûl in the region containing the Witch-king, or move any or all of the Nazgûl.
      // Then, you may move or attack with an Army containing the Witch-king.
      case "scha24":
        return {
          canBePlayed: () => this.q.theWitchKing.isInPlay(),
          play: async () => {
            const choice1 = await this.ui.askOption<"recruit" | "move">("Choose", [
              { value: "recruit", label: "Recruit two Nazgûl" },
              { value: "move", label: "Move any or all Nazgûl" }
            ]);
            const actions: WotrAction[] = [];
            const regionId = this.q.theWitchKing.region()!.id;
            if (choice1 === "recruit") {
              actions.push(
                ...(await this.unitUi.recruitUnitsInSameRegionByCard(regionId, "sauron", 0, 0, 2))
              );
            } else if (choice1 === "move") {
              actions.push(...(await this.characterUi.moveAnyOrAllNazgul()));
            }
            const region = this.q.region(regionId);
            if (!region.hasArmy("shadow")) return actions;
            const canMove = this.unitRules.canMoveArmyFromRegion(region.region(), "shadow");
            const canAttack = this.unitRules.canArmyAttack(region.army("shadow")!, region.region());
            if (!canMove && !canAttack) return actions;
            const choice2 = await this.ui.askOption<"move" | "attack">("Choose", [
              { value: "move", label: "Move with the Witch-king", disabled: !canMove },
              { value: "attack", label: "Attack with the Witch-king", disabled: !canAttack }
            ]);
            if (choice2 === "move") {
              actions.push(...(await this.unitUi.moveArmyWithCharacter("the-witch-king")));
            } else if (choice2 === "attack") {
              actions.push(...(await this.unitUi.attackWithCharacter("the-witch-king")));
            }
            return actions;
          }
        };
    }
  }

  private async rollCombatDice(nDice: number, player: WotrPlayer): Promise<WotrCombatDie[]> {
    const story = await player.rollCombatDice(nDice);
    const action = assertAction<WotrCombatRoll>(story, "combat-roll");
    return action.dice;
  }
}

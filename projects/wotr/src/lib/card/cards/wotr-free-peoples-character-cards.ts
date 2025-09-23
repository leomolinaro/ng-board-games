import { inject, Injectable } from "@angular/core";
import { rollCombatDice, WotrCombatRoll } from "../../battle/wotr-battle-actions";
import { WotrBattleUi } from "../../battle/wotr-battle-ui";
import { eliminateCharacter } from "../../character/wotr-character-actions";
import { WotrCharacterQuery } from "../../character/wotr-character-query";
import { findAction, WotrAction } from "../../commons/wotr-action-models";
import {
  healFellowship,
  hideFellowship,
  moveFelloswhip
} from "../../fellowship/wotr-fellowship-actions";
import { WotrFellowshipHandler } from "../../fellowship/wotr-fellowship-handler";
import { WotrGameQuery } from "../../game/wotr-game-query";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { assertAction } from "../../game/wotr-story-models";
import { addHuntTile } from "../../hunt/wotr-hunt-actions";
import { WotrFreePeoplesPlayer } from "../../player/wotr-free-peoples-player";
import { WotrShadowPlayer } from "../../player/wotr-shadow-player";
import { recruitEliteUnit, recruitRegularUnit } from "../../unit/wotr-unit-actions";
import { WotrUnitHandler } from "../../unit/wotr-unit-handler";
import { WotrReinforcementUnit } from "../../unit/wotr-unit-models";
import { playCardOnTable } from "../wotr-card-actions";
import { WotrCardDrawUi } from "../wotr-card-draw-ui";
import { WotrFreePeopleCharacterCardId } from "../wotr-card-models";
import { WotrCardPlayUi } from "../wotr-card-play-ui";
import { WotrEventCard } from "./wotr-cards";

@Injectable({ providedIn: "root" })
export class WotrFreePeoplesCharacterCards {
  private gameUi = inject(WotrGameUi);
  private cardDrawUi = inject(WotrCardDrawUi);
  cardPlayUi!: WotrCardPlayUi;
  private battleUi = inject(WotrBattleUi);
  private q = inject(WotrGameQuery);
  private fellowshipHandler = inject(WotrFellowshipHandler);
  private unitHandler = inject(WotrUnitHandler);
  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);

  createCard(cardId: WotrFreePeopleCharacterCardId): WotrEventCard {
    switch (cardId) {
      // Elven Cloaks
      // The "Elven Cloaks" special Hunt tile [0] is now in play.
      // Add the tile to the Hunt Pool when the Fellowship is on the Mordor Track.
      case "fpcha01":
        return {
          play: async () => [addHuntTile("b0")]
        };
      // Eleven Rope
      // The "Elven Rope" special Hunt tile [0] is now in play.
      // Add the tile to the Hunt Pool when the Fellowship is on the Mordor Track
      case "fpcha02":
        return {
          play: async () => [addHuntTile("b0")]
        };
      // Phial of Galadriel
      // The "Phial of Galadriel" special Hunt tile [-2] is now in play.
      // Add the tile to the Hunt Pool when the Fellowship is on the Mordor Track
      case "fpcha03":
        return {
          play: async () => [addHuntTile("b-2")]
        };
      // Sméagol Helps Nice Master
      // The "Sméagol Helps Nice Master" special Hunt tile [-1] is now in play.
      // Add the tile to the Hunt Pool when the Fellowship is on the Mordor Track
      case "fpcha04":
        return {
          play: async () => [addHuntTile("b-1")]
        };
      // Mithril Coat and String
      // Play on the table.
      // After the Shadow player draws a Hunt tile, you may discard "Mithril Coat and Sting" to draw a second tile. Apply the effects of the second tile instead of the first one,
      // then return the first tile to the Hunt Pool.
      case "fpcha05":
        return {
          play: async () => [playCardOnTable("Mithril Coat and Sting")]
        };
      // Axe and Bow
      // Play on the table if Gimli or Legolas are in the Fellowship.
      // After the Shadow player draws a Hunt tile, you may discard "Axe and Bow" to reduce the Hunt damage by one (to a minimum of zero). Any remaining Hunt damage
      // must be confronted normally.
      // You must immediately discard this card from the table if both Gimli and Legolas leave the Fellowship.
      case "fpcha06":
        return {
          canBePlayed: () => this.q.gimli.isInFellowship() || this.q.legolas.isInFellowship(),
          play: async () => [playCardOnTable("Axe and Bow")]
        };
      // Horn of Gondor
      // Play on the table if Boromir is in the Fellowship.
      // After the Shadow player draws a Hunt tile, you may discard "Horn of Gondor" to reduce the Hunt damage by one (to a minimum of zero). Any remaining Hunt
      // damage must be confronted normally.
      // You must immediately discard this card from the table if Boromir leaves the Fellowship.
      case "fpcha07":
        return {
          canBePlayed: () => this.q.boromir.isInFellowship(),
          play: async () => [playCardOnTable("Horn of Gondor")]
        };
      // Wizard's Staff
      // Play on the table if Gandalf the Grey is in the Fellowship.
      // You may discard "Wizard's Staff' to prevent the Shadow player from drawing a Hunt tile.
      // You must discard this card from the table immediately if Gandalf the Grey leaves the Fellowship.
      case "fpcha08":
        return {
          canBePlayed: () => this.q.gandalfTheGrey.isInFellowship(),
          play: async () => [playCardOnTable("Wizard's Staff")]
        };
      // Athelas
      // Roll three dice and heal one Corruption point for each die result of 5+.
      // If Strider is the Guide, heal one Corruption point for each die result of 3+ instead.
      case "fpcha09":
        return {
          play: async () => {
            await this.gameUi.askContinue("Roll three dice");
            const dice = this.battleUi.rollDice(3);
            return [rollCombatDice(...dice)];
          },
          effect: async params => {
            const action = assertAction<WotrCombatRoll>(params.story, "combat-roll");
            const threshold = this.q.strider.isGuide() ? 3 : 5;
            const nHealed = action.dice.filter(d => d >= threshold).length;
            const actualHealed = Math.min(nHealed, this.q.fellowship.corruption());
            if (actualHealed) {
              this.fellowshipHandler.healEffect(actualHealed);
            }
          }
        };
      // There is Another Way
      // Heal one Corruption point.
      // Then, if Gollum is the Guide, you may also hide or move the Fellowship (following the normal movement rules).
      case "fpcha10":
        return {
          play: async () => {
            const actions: WotrAction[] = [];
            if (this.q.fellowship.corruption() > 0) {
              await this.gameUi.askContinue("Heal the Fellowship");
              actions.push(healFellowship(1));
            }
            if (this.q.gollum.isGuide()) {
              if (this.q.fellowship.isHidden()) {
                const move = await this.gameUi.askConfirm(
                  "Do you want to move the Fellowship?",
                  "Move",
                  "Stay"
                );
                if (move) actions.push(moveFelloswhip());
              } else {
                const hide = await this.gameUi.askConfirm(
                  "Do you want to hide the Fellowship?",
                  "Hide",
                  "Keep revealed"
                );
                if (hide) actions.push(hideFellowship());
              }
            }
            return actions;
          }
        };
      // TODO I Will Go Alone
      // Play if at least one Companion is in the Fellowship.
      // Separate one Companion or one group of Companions from the Fellowship. You may move the Companions one extra region. Then, heal one Corruption point.
      case "fpcha11":
        return {
          canBePlayed: () => this.q.fellowship.hasCompanions(),
          play: async () => []
        };
      // Bilbo's Song
      // Heal one Corruption point.
      // If Gollum is the Guide, heal two Corruption points instead.
      case "fpcha12":
        return {
          play: async () => {
            let quantity = 1;
            if (this.q.gollum.isGuide()) {
              quantity = 2;
            }
            quantity = Math.min(quantity, this.q.fellowship.corruption());
            return [healFellowship(quantity)];
          }
        };
      // TODO Mirror of Galadriel
      // Change any one unused Free Peoples Character Action die result into a Will of the West die result.
      // If the Fellowship is in Lórien, and Lórien is unconquered, also heal one Corruption point.
      case "fpcha13":
        return {
          play: async () => []
        };
      // TODO Challenge of the King
      // Play if Strider/Aragorn is with a Free Peoples Army in a Gondor or Rohan region.
      // Draw three Hunt tiles. If all three drawn tiles show Eyes, put them back in the Hunt Pool and eliminate Strider/Aragorn.
      // Otherwise, discard permanently the drawn tiles bearing an Eye for the remainder of the game.
      // All drawn tiles not bearing an Eye are put back in the Hunt Pool without effect.
      case "fpcha14":
        return {
          canBePlayed: () => {
            const cond = (character: WotrCharacterQuery) =>
              (character.isInNation("gondor") || character.isInNation("rohan")) &&
              character.isWithFreePeoplesArmy();
            return cond(this.q.aragorn) || cond(this.q.strider);
          },
          play: async () => []
        };
      // TODO Gwaihir the Windlord
      // Separate from the Fellowship, or move, one Companion or one group of Companions as if their Level were 4.
      // This movement of these Companions is allowed to end in a Stronghold under siege.
      case "fpcha15":
        return {
          play: async () => []
        };
      // TODO We Prove the Swifter
      // Separate from the Fellowship, or move, one Companion or one group of Companions. You may move them two extra regions.
      // The movement of these Companions is allowed to end in a Stronghold under siege.
      case "fpcha16":
        return {
          play: async () => []
        };
      // TODO There and Back Again
      // Separate from the Fellowship one Companion or group of Companions. You may move them one extra region.
      // Then, if Gimli or Legolas are in Dale, Erebor or the Woodland Realm, activate the Dwarven and the North Nations and advance the Dwarven, the Elven and the
      // North Nations one step each on the Political Track.
      case "fpcha17":
        return {
          play: async () => []
        };
      // TODO The Eagles are Coming!
      // Play if a Free Peoples Army containing a Companion is adjacent to, or is in the same region as, a Shadow Army containing Nazgûl.
      // Roll a die for each Nazgûl present (up to a maximum of five dice) and eliminate a Nazgûl for each roll of 5+.
      // AII surviving Nazgûl must immediately be moved to any one unconquered Sauron Stronghold.
      // The Witch-king is not considered a Nazgûl for the purposes of this card.
      case "fpcha18":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // The Ents Awake: Treebeard
      // Play if Gandalf the White is in play and a Companion is in Fangorn.
      // Roll three dice; for each result of 4+, score one hit against a Shadow Army in Orthanc. If the Army is destroyed, so are any Nazgûl and Minions along with it.
      // If Saruman is in Orthanc without a Shadow Army, eliminate him.
      // If Gandalf the White is in Fangorn or a Rohan region, you may immediately play another Character Event card from your hand without using an Action die.
      case "fpcha19":
        return this.theEntsAwake();
      // The Ents Awake: Huorns Play if Gandalf the White is in play and a Companion is in Fangorn.
      // Roll three dice; for each result of 4+, score one hit against a Shadow Army in Orthanc. If the Army is destroyed, so are any Nazgûl and Minions along with it.
      // If Saruman is in Orthanc without a Shadow Army, eliminate him.
      // If Gandalf the White is in Fangorn or a Rohan region, you may immediately play another Character Event card from your hand without using an Action die.
      case "fpcha20":
        return this.theEntsAwake();
      // The Ents Awake: Entmoot Play if Gandalf the White is in play and a Companion is in Fangorn.
      // Roll three dice; for each result of 4+, score one hit against a Shadow Army in Orthanc. If the Army is destroyed, so are any Nazgûl and Minions along with it.
      // If Saruman is in Orthanc without a Shadow Army, eliminate him.
      // If Gandalf the White is in Fangorn or a Rohan region, you may immediately play another Character Event card from your hand without using an Action die.
      case "fpcha21":
        return this.theEntsAwake();
      // TODO Dead Men of Dunharrow
      // Play if Strider/Aragorn is in a Rohan region (including a Stronghold under siege).
      // Move Strider/Aragom (and any number of Companions in the same region) to Erech, Lamedon ar Pelargir.
      // If there is a Shadow Army in that region, roll a die. That Army takes a number of hits equal to the die result and must then retreat. If the Army cannot retreat, it is
      // destroyed. If the Army is destroyed, so are any Nazgûl and Minions along with it.
      // You may then recruit up to three Gondor Regular units in that region, taking control if necessary.
      case "fpcha22":
        return {
          canBePlayed: () =>
            this.q.strider.isInNation("rohan") || this.q.aragorn.isInNation("rohan"),
          play: async () => []
        };
      // House of the Stewards
      // Play if Boromir is in a Gondor region.
      // Recruit one Gondor unit (Regular or Elite) in the region with Boromir.
      // Then, draw two Strategy Event cards.
      case "fpcha23":
        return {
          canBePlayed: () => this.q.boromir.isInNation("gondor"),
          play: async () => {
            const boromirRegion = this.q.boromir.region()!;
            const reinforcementUnits: WotrReinforcementUnit[] = [];
            const actions: WotrAction[] = [];
            if (this.q.gondor.hasRegularReinforcements()) {
              reinforcementUnits.push({ nation: "gondor", type: "regular" });
            }
            if (this.q.gondor.hasEliteReinforcements()) {
              reinforcementUnits.push({ nation: "gondor", type: "elite" });
            }
            const units = await this.gameUi.askReinforcementUnit("Choose a unit to recruit", {
              canPass: false,
              frontId: "free-peoples",
              units: reinforcementUnits
            });
            if (units.type === "regular") {
              actions.push(recruitRegularUnit(boromirRegion.id, "gondor"));
            } else {
              actions.push(recruitEliteUnit(boromirRegion.id, "gondor"));
            }

            const leftCards = this.q.freePeoples.nCardsInStrategyDeck();
            const cardToDraw = Math.min(2, leftCards);
            if (cardToDraw) {
              actions.push(await this.cardDrawUi.drawCards(cardToDraw, "strategy", "free-peoples"));
            }

            return actions;
          }
        };
      // TODO The Grey Company
      // Play if Strider/Aragorn is with a Free Peoples Army.
      // Eliminate one Regular unit to recruit one Elite unit of the same Nation, in the Army with Strider/Aragorn.
      // Then, draw two Strategy Event cards.
      case "fpcha24":
        return {
          canBePlayed: () =>
            this.q.strider.isWithFreePeoplesArmy() || this.q.aragorn.isWithFreePeoplesArmy(),
          play: async () => []
        };
    }
  }

  private theEntsAwake(): WotrEventCard {
    return {
      canBePlayed: () =>
        this.q.gandalfTheWhite.isInPlay() && this.q.companions.some(c => c.isIn("fangorn")),
      play: async () => {
        const shadowArmy = this.q.region("orthanc").army("shadow");
        if (shadowArmy) {
          await this.gameUi.askContinue("Roll three dice");
          const dice = this.battleUi.rollDice(3);
          return [rollCombatDice(...dice)];
        } else {
          if (this.q.saruman.isIn("orthanc")) {
            return [eliminateCharacter("saruman")];
          }
        }
        return [];
      },
      effect: async params => {
        const action = findAction<WotrCombatRoll>(params.story.actions, "combat-roll");
        if (action) {
          const nHits = action.dice.filter(d => d >= 4).length;
          if (nHits) {
            await this.unitHandler.chooseCasualties(nHits, "orthanc", params.cardId, this.shadow);
          }
        }
        if (this.q.gandalfTheWhite.isIn("fangorn") || this.q.gandalfTheWhite.isInNation("rohan")) {
          const playableCards = this.cardPlayUi.playableCards(["character"], "free-peoples");
          if (playableCards.length) {
            await this.freePeoples.playCharacterCardFromHand();
          }
        }
      }
    };
  }
}

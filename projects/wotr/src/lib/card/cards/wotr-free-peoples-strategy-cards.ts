import { inject, Injectable } from "@angular/core";
import { WotrCharacterUi } from "../../character/wotr-character-ui";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameQuery } from "../../game/wotr-game-query";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { activateNation, advanceNation } from "../../nation/wotr-nation-actions";
import { WotrNationHandler } from "../../nation/wotr-nation-handler";
import { WotrNationUi } from "../../nation/wotr-nation-ui";
import { WotrUnitUi } from "../../unit/wotr-unit-ui";
import { WotrCardDrawUi } from "../wotr-card-draw-ui";
import { WotrFreePeopleStrategyCardId } from "../wotr-card-models";
import { WotrEventCard } from "./wotr-cards";
import { playCardOnTable } from "../wotr-card-actions";

@Injectable({ providedIn: "root" })
export class WotrFreePeoplesStrategyCards {
  private gameUi = inject(WotrGameUi);
  private cardDrawUi = inject(WotrCardDrawUi);
  private characterUi = inject(WotrCharacterUi);
  private q = inject(WotrGameQuery);
  private nationHandler = inject(WotrNationHandler);
  private unitUi = inject(WotrUnitUi);
  private nationUi = inject(WotrNationUi);

  createCard(cardId: WotrFreePeopleStrategyCardId): WotrEventCard {
    switch (cardId) {
      // TODO The Last Battle
      // Play on the table if Aragorn is with a Free Peoples Army in a region outside of a Free Peoples Nation.
      // While this card is in play, Action dice used to move the Fellowship are not added to the Hunt Box.
      // You must discard this card from the table as soon as the Fellowship is declared or revealed.
      case "fpstr01":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO A Power too Great
      // Play on the table.
      // Advance the Elven Nation one step on the Political Track.
      // While this card is in play, the Shadow player cannot move an Army into or attack (either in a field battle or in a siege) Lórien, Rivendell or The Grey Havens.
      // The Shadow player can force "A Power too Great" to be discarded by using any one Action die result and discarding one Army Event card and one Character Event card
      // from his hand.
      case "fpstr02":
        return {
          play: async () => [playCardOnTable("A Power too Great")]
        };
      // TODO The Power of Tom Bombadil
      // Play on the table.
      // Advance the North Nation one step on the Political Track.
      // While this card is in play, the Shadow player cannot move an Army into or attack The Old Forest, The Shire or Buckland.
      // The Shadow player can force 'The Power of Tom Bombadil" to be discarded by using any one Action die result and discarding one Army Event card and one Character
      // Event card from his hand.
      case "fpstr03":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // Book of Mazarbul
      // Move any or all Companions who are not in the Fellowship.
      // Then, if a Companion is in Erebor or Ered Luin, activate the Dwarven Nation and move it directly to the "At War" step.
      case "fpstr04":
        return {
          play: async () => this.characterUi.moveCompanions(),
          effect: async params => {
            if (
              this.q.region("erebor").hasCompanions() ||
              this.q.region("ered-luin").hasCompanions()
            ) {
              if (!this.q.dwarves.isActive()) this.nationHandler.activateNation("dwarves");
              if (!this.q.dwarves.isAtWar()) this.nationHandler.advanceAtWar("dwarves");
            }
          }
        };
      // TODO The Spirit of Mordor
      // Choose a Shadow Army anywhere on the board that is composed of Army units from at least two different Shadow Nations.
      // Roll five dice and score one hit against this Army for each result of 5+.
      case "fpstr05":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Faramir's Rangers
      // Choose a Shadow Army in Osgiliath or South Ithilien or North Ithilien.
      // Roll three dice and score one hit against this Army for each result of 5+.
      // Then, if there is a Free Peoples Army in Osgiliath, recruit one Gondor unit (Regular or Elite) and one Gondor Leader there.
      case "fpstr06":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // Fear! Fire! Foes!
      // Move any or all Companions who are not in the Fellowship.
      // Then, if a Companion is in The Shire or Bree, activate the North Nation and move it directly to the "At War" step.
      case "fpstr07":
        return {
          play: async () => this.characterUi.moveCompanions(),
          effect: async params => {
            if (
              this.q.region("the-shire").hasCompanions() ||
              this.q.region("bree").hasCompanions()
            ) {
              if (!this.q.north.isActive()) this.nationHandler.activateNation("north");
              if (!this.q.north.isAtWar()) this.nationHandler.advanceAtWar("north");
            }
          }
        };
      // Wisdom of Elrond
      // Activate one Free Peoples Nation of your choice and advance that Nation one step on the Political Track.
      case "fpstr08":
        return {
          play: async () => {
            const nations = this.q.freePeoplesNations.filter(n => !n.isAtWar()).map(n => n.id());
            if (!nations.length) return [];
            const nationId = await this.gameUi.askNation(
              "Choose a nation to activate and advance",
              nations
            );
            const actions: WotrAction[] = [];
            if (!this.q.nation(nationId).isActive()) actions.push(activateNation(nationId));
            actions.push(advanceNation(nationId));
            return actions;
          }
        };
      // The Red Arrow
      // Play if the Gondor Nation is active.
      // Advance the Rohan Nation one step on the Political Track.
      // Then, recruit one Rohan unit (Regular or Elite) and one Rohan Leader in Edoras.
      case "fpstr09":
        return {
          canBePlayed: () => this.q.gondor.isActive(),
          play: async () => {
            const actions: WotrAction[] = [];
            const advanceAction = await this.nationUi.advanceNation("rohan");
            if (advanceAction) actions.push(advanceAction);
            actions.push(...(await this.unitUi.recruitRegularsOrElitesByCard("edoras", "rohan")));
            actions.push(...(await this.unitUi.recruitLeaderByCard("edoras", "rohan")));
            return actions;
          }
        };
      // TODO Help Unlooked For
      // Attack a Shadow Army besieging a Stronghold with a Free Peoples Army in an adjacent region.
      // For this entire battle, the Shadow player rolls one die less during the Combat roll for each Free Peoples unit in the besieged Stronghold (to a minimum of one).
      case "fpstr10":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Paths of the Woses
      // Play if the Rohan Nation is "At War."
      // Move a Free Peoples Army from any one Rohan region (including a Stronghold under siege) directly to Minas Tirith.
      // If the Shadow player controls or is besieging Minas Tirith, move the Army to a region adjacent to Minas Tirith instead. The destination region must be free for the
      // purposes of army movement.
      case "fpstr11":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Through a Day and a Night
      // Play on a Free Peoples Army containing a Companion.
      // Move the Army containing the Companion(s) up to two regions. The regions must be free for the purposes of Army movement, and no Free Peoples units may be
      // picked up or dropped off along the way (other than, possibly, splitting the Army initially).
      case "fpstr12":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Cirdan's Ships
      // Play if the Elves are "At War."
      // Recruit two Elven units (Regular or Elite) in a coastal region containing a Free Peoples Army.
      case "fpstr13":
        return {
          canBePlayed: () => this.q.elves.isAtWar(),
          play: async () => []
        };
      // Guards of the Citadel
      // Recruit one Gondor unit (Regular or Elite) and one Gondor Leader in Minas Tirith.
      case "fpstr14":
        return {
          play: async () => {
            const actions: WotrAction[] = [];
            actions.push(
              ...(await this.unitUi.recruitRegularsOrElitesByCard("minas-tirith", "gondor"))
            );
            actions.push(...(await this.unitUi.recruitLeaderByCard("minas-tirith", "gondor")));
            return actions;
          }
        };
      // Celeborn's Galadhrim
      // Recruit one Elven unit (Regular or Elite) in Lórien.
      // Then, draw one Strategy Event card.
      case "fpstr15":
        return {
          play: async () => {
            const actions: WotrAction[] = [];
            actions.push(...(await this.unitUi.recruitRegularsOrElitesByCard("lorien", "elves")));
            const drawA = await this.cardDrawUi.drawStrategyEventCardByCard("free-peoples");
            if (drawA) actions.push(drawA);
            return actions;
          }
        };
      // TODO Riders of Théoden
      // Recruit one Rohan unit (Regular or Elite) and one Rohan Leader either in Edoras or in a Rohan region containing a Companion.
      case "fpstr16":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // Grimbeorn the Old, Son of Beorn
      // Recruit one North unit (Regular or Elite) and one North Leader in Carrock.
      case "fpstr17":
        return {
          play: async () => {
            const actions: WotrAction[] = [];
            actions.push(...(await this.unitUi.recruitRegularsOrElitesByCard("carrock", "north")));
            actions.push(...(await this.unitUi.recruitLeaderByCard("carrock", "north")));
            return actions;
          }
        };
      // Imrahil of Dol Amroth
      // Recruit one Gondor unit (Regular or Elite) and one Gondor Leader in Dol Amroth.
      case "fpstr18":
        return {
          play: async () => {
            const actions: WotrAction[] = [];
            actions.push(
              ...(await this.unitUi.recruitRegularsOrElitesByCard("dol-amroth", "gondor"))
            );
            actions.push(...(await this.unitUi.recruitLeaderByCard("dol-amroth", "gondor")));
            return actions;
          }
        };
      // King Brand's Men
      // Recruit two North Regular units in Dale.
      // Then, draw one Strategy Event card.
      case "fpstr19":
        return {
          play: async () => {
            const actions: WotrAction[] = [];
            const recruitUnitAction1 = await this.unitUi.recruitRegularByCard("dale", "north");
            if (recruitUnitAction1) actions.push(recruitUnitAction1);
            const recruitUnitAction2 = await this.unitUi.recruitRegularByCard("dale", "north");
            if (recruitUnitAction2) actions.push(recruitUnitAction2);
            const drawAction = await this.cardDrawUi.drawStrategyEventCardByCard("free-peoples");
            if (drawAction) actions.push(drawAction);
            return actions;
          }
        };
      // Swords of Eriador
      // Recruit one North unit (Regular or Elite) in The Shire and one Dwarven unit (Regular or Elite) in Ered Luin.
      // Then, draw one Strategy Event card.
      case "fpstr20":
        return {
          play: async () => {
            const actions: WotrAction[] = [];
            actions.push(
              ...(await this.unitUi.recruitRegularsOrElitesByCard("the-shire", "north"))
            );
            actions.push(
              ...(await this.unitUi.recruitRegularsOrElitesByCard("ered-luin", "dwarves"))
            );
            const drawAction = await this.cardDrawUi.drawStrategyEventCardByCard("free-peoples");
            if (drawAction) actions.push(drawAction);
            return actions;
          }
        };
      // Kindred of Glorfindel
      // Recruit one Elven unit (Regular or Elite) in Rivendell.
      // Then, draw one Strategy Event card.
      case "fpstr21":
        return {
          play: async () => {
            const actions: WotrAction[] = [];
            actions.push(
              ...(await this.unitUi.recruitRegularsOrElitesByCard("rivendell", "elves"))
            );
            const drawAction = await this.cardDrawUi.drawStrategyEventCardByCard("free-peoples");
            if (drawAction) actions.push(drawAction);
            return actions;
          }
        };
      // Dain Ironfoot's Guard
      // Recruit one Dwarven unit (Regular or Elite) and one Dwarven Leader in Erebor
      case "fpstr22":
        return {
          play: async () => {
            const actions: WotrAction[] = [];
            actions.push(...(await this.unitUi.recruitRegularsOrElitesByCard("erebor", "dwarves")));
            actions.push(...(await this.unitUi.recruitLeaderByCard("erebor", "dwarves")));
            return actions;
          }
        };
      // Éomer, Son of Éomund
      // Recruit one Rohan unit (Regular or Elite) and one Rohan Leader in a free Rohan region containing a Settlement.
      case "fpstr23":
        return {
          play: async () => {
            const availableRegions = this.q.rohan
              .settlementRegions()
              .filter(r => this.q.rohan.canRecruit(r.id))
              .map(r => r.id);
            if (!availableRegions.length) {
              await this.gameUi.askContinue("No free Rohan region with a settlement");
              return [];
            }
            const regionId = await this.gameUi.askRegion(
              "Choose a region to recruit units",
              availableRegions
            );
            const actions: WotrAction[] = [];
            actions.push(...(await this.unitUi.recruitRegularsOrElitesByCard(regionId, "rohan")));
            actions.push(...(await this.unitUi.recruitLeaderByCard(regionId, "rohan")));
            return actions;
          }
        };
      // Thranduil's Archers
      // Recruit one Elven unit (Regular or Elite) in Woodland Realm.
      // Then, draw one Strategy Event card.
      case "fpstr24":
        return {
          play: async () => {
            const actions: WotrAction[] = [];
            actions.push(
              ...(await this.unitUi.recruitRegularsOrElitesByCard("woodland-realm", "elves"))
            );
            const drawAction = await this.cardDrawUi.drawStrategyEventCardByCard("free-peoples");
            if (drawAction) actions.push(drawAction);
            return actions;
          }
        };
    }
  }
}

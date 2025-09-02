import { inject, Injectable } from "@angular/core";
import { WotrCharacterRules } from "../../character/wotr-character-rules";
import { WotrCharacterStore } from "../../character/wotr-character-store";
import { WotrFellowshipStore } from "../../fellowship/wotr-fellowship-store";
import { WotrFrontStore } from "../../front/wotr-front-store";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrNationStore } from "../../nation/wotr-nation-store";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { WotrCardDrawUi } from "../wotr-card-draw-ui";
import { WotrShadowStrategyCardId } from "../wotr-card-models";
import { WotrEventCard } from "./wotr-cards";

@Injectable({ providedIn: "root" })
export class WotrShadowStrategyCards {
  private characterStore = inject(WotrCharacterStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);
  private gameUi = inject(WotrGameUi);
  private cardDrawUi = inject(WotrCardDrawUi);
  private frontStore = inject(WotrFrontStore);
  private characterRules = inject(WotrCharacterRules);

  createCard(cardId: WotrShadowStrategyCardId): WotrEventCard {
    switch (cardId) {
      // TODO Return to Valinor
      // Play if you control at least one Elven Stronghold.
      // For each region with an Elven Stronghold which is not under siege, roll a number of dice equal to the number of Elven Army units in that region (up to a maximum
      // of 5) and score one hit against that army for each result of '6.'
      case "sstr01":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO The Fighting Uruk-hai
      // Play if Saruman is in play, and if an Army containing an Isengard unit is besieging a Stronghold.
      // Attack that Stronghold. The siege lasts for three Combat rounds instead of one. During the first round, the Free Peoples player cannot use a Combat card unless a
      // Companion is in the battle.
      case "sstr02":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Denethor's Folly
      // Play on the table if Minas Tirith is under siege by a Shadow Army.
      // When you play this card, immediately eliminate one Free Peoples Leader in Minas Tirith.
      // When "Denethor's Folly" is in play, the Free Peoples player cannot use Combat cards for battles fought in Minas Tirith.
      // The free Peoples player can force "Denethor's Folly" to be discarded using a Will of the West Action die result, or any Action die result if Gandalf or Aragorn is in Minas Tirith.
      case "sstr03":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO The Day Without Dawn
      // Play if all Shadow Nations are "At War."
      // Discard all unused Free Peoples Action dice that show a Will of the West result.
      case "sstr04":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Threats and Promises
      // Play on the table.
      // When "Threats and Promises" is in play, the Free Peoples player cannot advance a passive Nation on the Political Track using a Muster action die result.
      // You must discard this card from the table as soon as a Free Peoples Nation advances on the Political Track either due to an attack or due to a Companion's special ability
      case "sstr05":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Stormcrow
      // Play if either the Fellowship or a Companion is inside the borders of a Free Peoples Nation not "At War."
      // Move that Nation's Political Counter back one step on the Political Track.
      // Then, the Free Peoples player must eliminate one Leader or Army unit of that Nation (Regular or Elite).
      case "sstr06":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Shadows Gather
      // Move one Shadow Army up to three regions: the movement must end in a region already occupied by another Shadow Army (that must not be under siege). The
      // traversed regions must be free for the purposes of Army movement, and no Shadow units may be picked up or dropped off along the way (other than, possibly,
      // splitting the Army initially)
      case "sstr07":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO The Shadow Lengthens
      // Move two Shadow Armies up to two regions: each movement must end in a region already occupied by another Shadow Army (that must not be under siege). The
      // traversed regions must be free for the purposes of Army movement, and no Shadow units may be picked up or dropped off along the way (other than, possibly,
      // splitting the Army initially).
      case "sstr08":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO The Shadow is Moving
      // Play if all Shadow Nations are "At War."
      // Move up to four different Shadow Armies one region each
      case "sstr09":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Corsairs of Umbar
      // Play if the Southrons & Easterlings are "At War."
      // Move one Shadow Army from Umbar to a Gondar coastal region (check the stacking limit immediately if it is merging with another Army).
      // If there is a Free Peoples Army in the region, a battle starts. The attacking Shadow Army cannot cease the attack, unless the Free Peoples Army was already under
      // siege.
      case "sstr10":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Rage Of The Dunlendings
      // Play if Isengard is "At War."
      // Recruit two Isengard Regular units in a free region adjacent to North or South Dunland.
      // You may also move to this region up to four Isengard units (Regular or Elite) from North Dunland and/or South Dunland.
      case "sstr11":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Return of the Witch-king
      // Play if the Witch-king is in play.
      // Move the Witch-king to Angmar, then recruit two Sauron Regular units and one Sauron Elite unit there.
      case "sstr12":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Half-orcs and Goblin-men
      // Play if Isengard is "At War."
      // Recruit one Isengard unit (Regular or Elite) in a region where a Shadow Army is present.
      case "sstr13":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Olog-hai
      // Play if Sauron is "At War."
      // Recruit one Sauron unit (Regular or Elite) in a region where a Shadow Army is present.
      case "sstr14":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Hill-trolls
      // Play if Sauron is "At War."
      // Replace two Sauron Regular units anywhere on the game board with two Sauron Elite units.
      case "sstr15":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO A New Power is Rising
      // Play if Saruman is in play.
      // Recruit two Isengard Regular units in each of North and South Dunland and two Isengard units (Regular or Elite) in Orthanc.
      case "sstr16":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Many Kings to the Service of Mordor
      // Recruit two Southron & Easterling Regular units in each of three different Southron & Easterlings Settlements.
      case "sstr17":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO The King is Revealed
      // Play if Aragorn is in play.
      // Recruit five Sauron Regular units and a Nazgûl in Minas Morgul.
      case "sstr18":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Shadows on the Misty Mountains
      // Recruit two Sauron units (Regular or Elite) and one Nazgûl either in Mount Gram or Moria.
      case "sstr19":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Orcs Multiplying Again
      // Recruit three Sauron Regular units in Dol Guldur and three Sauron Regular units in Mount Gundabad.
      case "sstr20":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Horde From the East
      // Play if the Southron & Easterling are "At War."
      // Recruit five Southron & Easterling Regular units in a free region inside the Southron and Easterling Nation. This region must be adjacent to the eastern edge of the map.
      case "sstr21":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Monsters Roused
      // Recruit one Sauron Regular unit in each of Angmar, Ettenmoors and Weather Hills, and one Sauron Elite unit in Trollshaws.
      case "sstr22":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Musterings of Long-planned War
      // Play if all Shadow Nations are "At War."
      // Recruit five Southron & Easterling Regular units in Gorgoroth and five Sauron Regular units in Nurn.
      case "sstr23":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // TODO Pits of Mordor
      // Play if Sauron is "At War."
      // Recruit two Sauron Regular units in each of three different Sauron Strongholds.
      case "sstr24":
        return {
          canBePlayed: () => false,
          play: async () => []
          // canBePlayed: () => {
          //   if (!this.nationStore.isAtWar("sauron")) return false;
          //   if (!this.nationStore.hasRegularReinforcements("sauron")) return false;
          //   if (this.regionStore.strongholdRegions("sauron").length < 3) return false;
          //   return true;
          // },
          // play: async () => {
          // }
        };
    }
  }
}

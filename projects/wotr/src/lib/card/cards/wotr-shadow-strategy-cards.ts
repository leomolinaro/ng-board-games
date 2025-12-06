import { inject, Injectable } from "@angular/core";
import { moveCharacters } from "../../character/wotr-character-actions";
import { WotrCharacterHandler } from "../../character/wotr-character-handler";
import { findAction, WotrAction } from "../../commons/wotr-action-models";
import { WotrGameQuery } from "../../game/wotr-game-query";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { recedeNation, WotrPoliticalRecede } from "../../nation/wotr-nation-actions";
import { WotrNationId } from "../../nation/wotr-nation-models";
import { WotrFreePeoplesPlayer } from "../../player/wotr-free-peoples-player";
import { WotrRegionQuery } from "../../region/wotr-region-query";
import { upgradeRegularUnit } from "../../unit/wotr-unit-actions";
import { WotrUnitUi } from "../../unit/wotr-unit-ui";
import { WotrShadowStrategyCardId } from "../wotr-card-models";
import { WotrEventCard } from "./wotr-cards";

@Injectable({ providedIn: "root" })
export class WotrShadowStrategyCards {
  private q = inject(WotrGameQuery);
  private gameUi = inject(WotrGameUi);
  private unitUi = inject(WotrUnitUi);
  private characterHandler = inject(WotrCharacterHandler);
  private freePeoples = inject(WotrFreePeoplesPlayer);

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
      // Stormcrow
      // Play if either the Fellowship or a Companion is inside the borders of a Free Peoples Nation not "At War."
      // Move that Nation's Political Counter back one step on the Political Track.
      // Then, the Free Peoples player must eliminate one Leader or Army unit of that Nation (Regular or Elite).
      case "sstr06":
        return {
          canBePlayed: () => this.q.regions().some(region => this.isStormcrowRegion(region)),
          play: async () => {
            const regions = this.q.regions().filter(region => this.isStormcrowRegion(region));
            const nations = new Set<WotrNationId>();
            regions.forEach(region => nations.add(region.region().nationId!));
            const nationId = await this.gameUi.askNation(
              "Select a Free Peoples Nation to move back on the Political Track",
              [...nations]
            );
            return [recedeNation(nationId, 1)];
          },
          effect: async params => {
            const action = findAction<WotrPoliticalRecede>(
              params.story.actions,
              "political-recede"
            )!;
            const nationId = action.nation;
            await this.freePeoples.eliminateUnits(
              {
                units: [
                  { unitType: "leader", nationId },
                  { unitType: "army", nationId }
                ]
              },
              params.cardId
            );
          }
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
      // Return of the Witch-king
      // Play if the Witch-king is in play.
      // Move the Witch-king to Angmar, then recruit two Sauron Regular units and one Sauron Elite unit there.
      case "sstr12":
        return {
          canBePlayed: () => this.q.theWitchKing.isInPlay(),
          play: async () => {
            const actions: WotrAction[] = [];
            const witchKingRegion = this.q.theWitchKing.region()!;
            actions.push(moveCharacters(witchKingRegion.id, "angmar", "the-witch-king"));
            this.characterHandler.moveCharacters(["the-witch-king"], witchKingRegion.id, "angmar");
            actions.push(
              ...(await this.unitUi.recruitUnitsInSameRegionByCard("angmar", "sauron", 2, 1, 0))
            );
            return actions;
          }
        };
      // Half-orcs and Goblin-men
      // Play if Isengard is "At War."
      // Recruit one Isengard unit (Regular or Elite) in a region where a Shadow Army is present.
      case "sstr13":
        return {
          canBePlayed: () => this.q.isengard.isAtWar(),
          play: async () => {
            const regions = this.q
              .regions()
              .filter(r => r.hasArmy("shadow"))
              .map(r => r.regionId);
            const region = await this.gameUi.askRegion(
              "Select a region to recruit an Isengard unit",
              regions
            );
            return this.unitUi.recruitRegularsOrElitesByCard(region, "isengard", 1);
          }
        };
      // Olog-hai
      // Play if Sauron is "At War."
      // Recruit one Sauron unit (Regular or Elite) in a region where a Shadow Army is present.
      case "sstr14":
        return {
          canBePlayed: () => this.q.sauron.isAtWar(),
          play: async () => {
            const regions = this.q
              .regions()
              .filter(r => r.hasArmy("shadow"))
              .map(r => r.regionId);
            const region = await this.gameUi.askRegion(
              "Select a region to recruit a Sauron unit",
              regions
            );
            const unit = await this.gameUi.askReinforcementUnit("Select a Sauron unit to recruit", {
              canPass: false,
              frontId: "shadow",
              units: [
                { nation: "sauron", type: "regular" },
                { nation: "sauron", type: "elite" }
              ]
            });
            return this.unitUi.recruitUnit(unit, region, "shadow");
          }
        };
      // Hill-trolls
      // Play if Sauron is "At War."
      // Replace two Sauron Regular units anywhere on the game board with two Sauron Elite units.
      case "sstr15":
        return {
          canBePlayed: () => this.q.sauron.isAtWar(),
          play: async () => {
            const actions: WotrAction[] = [];
            for (let i = 0; i < 2; i++) {
              if (!this.q.nation("sauron").nEliteReinforcements()) return actions;
              const regions = this.q.regions().filter(r => r.hasRegularUnitsOfNation("sauron"));
              if (!regions.length) return actions;
              const region = await this.gameUi.askRegion(
                "Select a region to upgrade a Sauron regular unit",
                regions.map(r => r.regionId)
              );
              actions.push(upgradeRegularUnit(region, "sauron", 1));
            }
            return actions;
          }
        };
      // A New Power is Rising
      // Play if Saruman is in play.
      // Recruit two Isengard Regular units in each of North and South Dunland and two Isengard units (Regular or Elite) in Orthanc.
      case "sstr16":
        return {
          canBePlayed: () => this.q.saruman.isInPlay(),
          play: async () => {
            const actions: WotrAction[] = [];
            const regularRecruitments = await this.unitUi.recruitUnitsInDifferentRegions(
              2,
              "isengard",
              "regulars",
              2,
              this.q
                .regions("north-dunland", "south-dunland")
                .filter(r => r.isFreeForRecruitment("shadow"))
                .map(r => r.regionId)
            );
            actions.push(...regularRecruitments);
            const eliteRecruitments = await this.unitUi.recruitRegularsOrElitesByCard(
              "orthanc",
              "isengard",
              2
            );
            actions.push(...eliteRecruitments);
            return actions;
          }
        };
      // Many Kings to the Service of Mordor
      // Recruit two Southron & Easterling Regular units in each of three different Southron & Easterlings Settlements.
      case "sstr17":
        return {
          play: async () =>
            this.unitUi.recruitUnitsInDifferentRegions(
              2,
              "southrons",
              "regulars",
              3,
              this.q.southrons
                .settlements()
                .filter(r => r.controlledBy === "shadow")
                .map(r => r.id)
            )
        };
      // The King is Revealed
      // Play if Aragorn is in play.
      // Recruit five Sauron Regular units and a Nazgûl in Minas Morgul.
      case "sstr18":
        return {
          canBePlayed: () => this.q.aragorn.isInPlay(),
          play: async () => {
            const actions: WotrAction[] = [];
            actions.push(
              ...(await this.unitUi.recruitUnitsInSameRegionByCard(
                "minas-morgul",
                "sauron",
                5,
                0,
                1
              ))
            );
            return actions;
          }
        };
      // TODO Shadows on the Misty Mountains
      // Recruit two Sauron units (Regular or Elite) and one Nazgûl either in Mount Gram or Moria.
      case "sstr19":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      // Orcs Multiplying Again
      // Recruit three Sauron Regular units in Dol Guldur and three Sauron Regular units in Mount Gundabad.
      case "sstr20":
        return {
          play: async () =>
            this.unitUi.recruitUnitsInDifferentRegions(
              3,
              "sauron",
              "regulars",
              2,
              this.q
                .regions("dol-guldur", "mount-gundabad")
                .filter(r => r.isFreeForRecruitment("shadow"))
                .map(r => r.regionId)
            )
        };
      // Horde From the East
      // Play if the Southron & Easterling are "At War."
      // Recruit five Southron & Easterling Regular units in a free region inside the Southron and Easterling Nation. This region must be adjacent to the eastern edge of the map.
      case "sstr21":
        return {
          canBePlayed: () => this.q.southrons.isAtWar(),
          play: async () =>
            this.unitUi.recruitUnitsInDifferentRegions(
              5,
              "southrons",
              "regulars",
              1,
              this.q
                .regions("east-rhun", "south-rhun", "khand", "far-harad")
                .filter(r => r.isFreeForRecruitment("shadow"))
                .map(r => r.regionId)
            )
        };
      // Monsters Roused
      // Recruit one Sauron Regular unit in each of Angmar, Ettenmoors and Weather Hills, and one Sauron Elite unit in Trollshaws.
      case "sstr22":
        return {
          play: async () => {
            const actions: WotrAction[] = [];
            actions.push(
              ...(await this.unitUi.recruitUnitsInDifferentRegions(
                1,
                "sauron",
                "regulars",
                3,
                this.q
                  .regions("angmar", "ettenmoors", "weather-hills")
                  .filter(r => r.isFreeForRecruitment("shadow"))
                  .map(r => r.regionId)
              ))
            );
            actions.push(
              ...(await this.unitUi.recruitUnitsInDifferentRegions(
                1,
                "sauron",
                "elites",
                1,
                this.q
                  .regions("troll-shaws")
                  .filter(r => r.isFreeForRecruitment("shadow"))
                  .map(r => r.regionId)
              ))
            );
            return actions;
          }
        };
      // Musterings of Long-planned War
      // Play if all Shadow Nations are "At War."
      // Recruit five Southron & Easterling Regular units in Gorgoroth and five Sauron Regular units in Nurn.
      case "sstr23":
        return {
          canBePlayed: () => this.q.shadowNations.every(nation => nation.isAtWar()),
          play: async () =>
            this.unitUi.recruitUnitsInDifferentRegions(
              5,
              "southrons",
              "regulars",
              2,
              this.q
                .regions("gorgoroth", "nurn")
                .filter(r => r.isFreeForRecruitment("shadow"))
                .map(r => r.regionId)
            )
        };
      // Pits of Mordor
      // Play if Sauron is "At War."
      // Recruit two Sauron Regular units in each of three different Sauron Strongholds.
      case "sstr24":
        return {
          canBePlayed: () => this.q.sauron.isAtWar(),
          play: async () =>
            this.unitUi.recruitUnitsInDifferentRegions(
              2,
              "sauron",
              "regulars",
              3,
              this.q.sauron
                .strongholds()
                .filter(r => r.controlledBy === "shadow")
                .map(r => r.id)
            )
        };
    }
  }

  private isStormcrowRegion(region: WotrRegionQuery): boolean {
    const nationId = region.region().nationId;
    if (!nationId) return false;
    const nation = this.q.nation(nationId).nation();
    if (nation.front !== "free-peoples") return false;
    if (nation.politicalStep === "atWar") return false;
    return region.hasFellowship() || region.hasCompanions();
  }
}

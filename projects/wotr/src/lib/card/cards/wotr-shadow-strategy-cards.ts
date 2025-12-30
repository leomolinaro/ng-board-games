import { inject, Injectable } from "@angular/core";
import { immutableUtil } from "../../../../../commons/utils/src";
import { WotrAbility } from "../../ability/wotr-ability";
import { discardDice } from "../../action-die/wotr-action-die-actions";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import {
  WotrActionDieChoiceModifier,
  WotrActionDieModifiers
} from "../../action-die/wotr-action-die-modifiers";
import { attack, WotrCombatRoll } from "../../battle/wotr-battle-actions";
import { WotrCombatFront, WotrCombatRound } from "../../battle/wotr-battle-models";
import {
  WotrBattleModifiers,
  WotrCanUseCombatCardModifier
} from "../../battle/wotr-battle-modifiers";
import { moveCharacters } from "../../character/wotr-character-actions";
import { WotrCharacterHandler } from "../../character/wotr-character-handler";
import { findAction, WotrAction } from "../../commons/wotr-action-models";
import { WotrFrontId } from "../../front/wotr-front-models";
import { WotrGameQuery } from "../../game/wotr-game-query";
import { WotrGameUi, WotrUiChoice } from "../../game/wotr-game-ui";
import { recedeNation, WotrPoliticalRecede } from "../../nation/wotr-nation-actions";
import { WotrNationId } from "../../nation/wotr-nation-models";
import {
  WotrAfterNationAdvance,
  WotrCanAdvanceNationModifier,
  WotrNationModifiers
} from "../../nation/wotr-nation-modifiers";
import { WotrNationAdvanceSource } from "../../nation/wotr-nation-rules";
import { WotrFreePeoplesPlayer } from "../../player/wotr-free-peoples-player";
import { WotrShadowPlayer } from "../../player/wotr-shadow-player";
import { targetRegion, WotrRegionChoose } from "../../region/wotr-region-actions";
import { WotrRegionId } from "../../region/wotr-region-models";
import { WotrRegionQuery } from "../../region/wotr-region-query";
import {
  eliminateLeader,
  upgradeRegularUnit,
  WotrArmyMovement
} from "../../unit/wotr-unit-actions";
import { WotrUnitRules } from "../../unit/wotr-unit-rules";
import { WotrUnitUi } from "../../unit/wotr-unit-ui";
import { WotrUnitUtils } from "../../unit/wotr-unit-utils";
import { discardCardFromTableById, playCardOnTableId } from "../wotr-card-actions";
import { WotrCardHandler } from "../wotr-card-handler";
import { WotrShadowStrategyCardId } from "../wotr-card-models";
import { WotrEventCard } from "./wotr-cards";

@Injectable({ providedIn: "root" })
export class WotrShadowStrategyCards {
  private q = inject(WotrGameQuery);
  private ui = inject(WotrGameUi);
  private unitUi = inject(WotrUnitUi);
  private characterHandler = inject(WotrCharacterHandler);
  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);
  private unitRules = inject(WotrUnitRules);
  private unitUtils = inject(WotrUnitUtils);
  private nationModifiers = inject(WotrNationModifiers);
  private cardHandler = inject(WotrCardHandler);
  private actionDieModifiers = inject(WotrActionDieModifiers);
  private battleModifiers = inject(WotrBattleModifiers);

  private returnToValinorRegions(): WotrRegionId[] {
    return this.q
      .strongholdRegions()
      .filter(
        r =>
          r.isNation("elves") &&
          !r.isUnderSiege("free-peoples") &&
          !r.isUnderSiege("shadow") &&
          r.hasArmyUnitsOfNation("elves")
      )
      .map(r => r.id());
  }

  createCard(cardId: WotrShadowStrategyCardId): WotrEventCard {
    switch (cardId) {
      // Return to Valinor
      // Play if you control at least one Elven Stronghold.
      // For each region with an Elven Stronghold which is not under siege, roll a number of dice equal to the number of Elven Army units in that region (up to a maximum
      // of 5) and score one hit against that army for each result of '6.'
      case "sstr01":
        return {
          canBePlayed: () =>
            this.q
              .strongholdRegions()
              .filter(r => r.isNation("elves"))
              .some(r => r.isControlledBy("shadow")),
          play: async () => {
            const regions = this.returnToValinorRegions();
            if (!regions.length) {
              await this.ui.askContinue("No valid Elven strongholds available");
              return [];
            }
            const region = await this.ui.askRegion("Select an Elven stronghold", regions);
            return [targetRegion(region)];
          },
          effect: async params => {
            let regions = [...this.returnToValinorRegions()];
            let regionChooseStory = params.story;
            while (regions.length) {
              const regionChoose = findAction<WotrRegionChoose>(
                regionChooseStory.actions,
                "region-choose"
              )!;
              const regionId = regionChoose.region;
              const army = this.q.region(regionId).army("free-peoples")!;
              const nElvenArmyUnits = this.unitUtils.nArmyUnits(army);
              const rollStory = await this.shadow.rollCombatDice(Math.min(nElvenArmyUnits, 5));
              if (!("actions" in rollStory)) throw new Error("Unexpected story");
              const roll = findAction<WotrCombatRoll>(rollStory.actions, "combat-roll")!;
              const nHits = roll.dice.filter(die => die === 6).length;
              const armyHitPoints = this.unitUtils.nHits(army);
              if (nHits >= armyHitPoints) {
                await this.freePeoples.eliminateArmy(regionId, params.cardId);
              } else {
                await this.freePeoples.chooseCasualties(nHits, regionId, params.cardId);
              }
              regions = immutableUtil.listRemoveFirst(r => r === regionChoose.region, regions);
              if (regions.length) {
                const story = await this.shadow.chooseRegion(regions, params.cardId);
                if (!("actions" in story)) throw new Error("Unexpected story");
                regionChooseStory = story;
              }
            }
          }
        };
      // The Fighting Uruk-hai
      // Play if Saruman is in play, and if an Army containing an Isengard unit is besieging a Stronghold.
      // Attack that Stronghold. The siege lasts for three Combat rounds instead of one.
      // During the first round, the Free Peoples player cannot use a Combat card unless a
      // Companion is in the battle.
      case "sstr02":
        return {
          canBePlayed: () =>
            this.q.saruman.isInPlay() &&
            this.q
              .strongholdRegions()
              .some(
                region =>
                  region.isUnderSiege("free-peoples") && region.hasArmyUnitsOfNation("isengard")
              ),
          play: async () => {
            const strongholdRegions = this.q
              .strongholdRegions()
              .filter(
                region =>
                  region.isUnderSiege("free-peoples") && region.hasArmyUnitsOfNation("isengard")
              );
            const regionId = await this.ui.askRegion(
              "Select a stronghold to attack",
              strongholdRegions.map(region => region.id())
            );
            return this.unitUi.attackStronghold(regionId, "shadow");
          }
        };
      // Denethor's Folly
      // Play on the table if Minas Tirith is under siege by a Shadow Army.
      // When you play this card, immediately eliminate one Free Peoples Leader in Minas Tirith.
      // When "Denethor's Folly" is in play, the Free Peoples player cannot use Combat cards for battles fought in Minas Tirith.
      // The free Peoples player can force "Denethor's Folly" to be discarded using a Will of the West Action die result, or any Action die result if Gandalf or Aragorn is in Minas Tirith.
      case "sstr03":
        return {
          canBePlayed: () => this.q.region("minas-tirith").isUnderSiege("free-peoples"),
          play: async () => {
            const actions: WotrAction[] = [playCardOnTableId("sstr03")];
            const fpArmy = this.q.region("minas-tirith").army("free-peoples")!;
            if (this.unitUtils.hasLeaders(fpArmy)) {
              const units = await this.ui.askRegionUnits("Choose a leader to eliminate", {
                type: "eliminateUnit",
                regionIds: ["minas-tirith"],
                unitType: "leader",
                nationId: null
              });
              if (units.leaders?.length) {
                actions.push(eliminateLeader("minas-tirith", units.leaders[0].nation));
              }
            }
            return actions;
          },
          onTableAbilities: () => {
            const combatAbility: WotrAbility<WotrCanUseCombatCardModifier> = {
              modifier: this.battleModifiers.canUseCombatCardModifier,
              handler: (combatFront: WotrCombatFront, combatRound: WotrCombatRound) =>
                combatFront.frontId !== "free-peoples" &&
                combatRound.action.toRegion !== "minas-tirith"
            };
            const discardAbility: WotrAbility<WotrActionDieChoiceModifier> = {
              modifier: this.actionDieModifiers.actionDieChoices,
              handler: (die: WotrActionDie, frontId: WotrFrontId) => {
                if (frontId !== "free-peoples") return [];
                const region = this.q.region("minas-tirith");
                const choices: WotrUiChoice[] = [];
                if (
                  die === "will-of-the-west" ||
                  region.hasCharacter("aragorn") ||
                  region.hasCharacter("gandalf-the-white") ||
                  region.hasCharacter("gandalf-the-grey")
                ) {
                  choices.push({
                    label: () => "Discard Denethor's Folly",
                    actions: async () => [discardCardFromTableById("sstr03")]
                  });
                }
                return choices;
              }
            };
            return [combatAbility, discardAbility];
          }
        };
      // The Day Without Dawn
      // Play if all Shadow Nations are "At War."
      // Discard all unused Free Peoples Action dice that show a Will of the West result.
      case "sstr04":
        return {
          canBePlayed: () => this.q.shadowNations.every(nation => nation.isAtWar()),
          play: async () => {
            const willDice = this.q.freePeoples
              .actionDice()
              .filter(die => die === "will-of-the-west");
            return [discardDice("free-peoples", ...willDice)];
          }
        };
      // Threats and Promises
      // Play on the table.
      // When "Threats and Promises" is in play, the Free Peoples player cannot advance a passive Nation on the Political Track using a Muster action die result.
      // You must discard this card from the table as soon as a Free Peoples Nation advances on the Political Track either due to an attack or due to a Companion's special ability
      case "sstr05":
        return {
          play: async () => [playCardOnTableId("sstr05")],
          onTableAbilities: () => {
            const cannotAdvanceAbility: WotrAbility<WotrCanAdvanceNationModifier> = {
              modifier: this.nationModifiers.canAdvanceNationModifier,
              handler: (nationId: WotrNationId, source: WotrNationAdvanceSource) => {
                const nation = this.q.nation(nationId);
                if (nation.frontId() !== "free-peoples") return true;
                if (source !== "muster-die-result") return true;
                if (nation.isActive()) return true;
                return false;
              }
            };
            const discardAbility: WotrAbility<WotrAfterNationAdvance> = {
              modifier: this.nationModifiers.afterNationAdvance,
              handler: async (nationId: WotrNationId, source: WotrNationAdvanceSource) => {
                const nation = this.q.nation(nationId);
                if (nation.frontId() !== "free-peoples") return;
                if (source === "auto-advance" || source === "character-ability") {
                  this.cardHandler.discardCardFromTableEffect("sstr05");
                }
              }
            };
            return [cannotAdvanceAbility, discardAbility];
          }
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
            const nationId = await this.ui.askNation(
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
      // Shadows Gather
      // Move one Shadow Army up to three regions: the movement must end in a region already occupied by another Shadow Army (that must not be under siege). The
      // traversed regions must be free for the purposes of Army movement, and no Shadow units may be picked up or dropped off along the way (other than, possibly,
      // splitting the Army initially)
      case "sstr07":
        return {
          play: async () => {
            const regionIds = this.unitRules.armyMovementStartingRegions("shadow", []);
            const units = await this.ui.askRegionUnits("Select a Shadow army to move", {
              type: "moveArmy",
              regionIds: regionIds,
              required: true,
              requiredUnits: [],
              retroguard: null,
              doneMovements: []
            });
            const fromRegion = units.regionId;
            const targetRegions = this.q
              .region(fromRegion)
              .reachableRegions(3, region => region.isFreeForArmyMovement("shadow"))
              .filter(r => r.hasArmyNotUnderSiege("shadow"));
            if (!targetRegions.length) {
              await this.ui.askContinue("No valid target regions available for movement");
              return [];
            }
            const toRegionId = await this.ui.askRegion(
              "Select a region to move the army to",
              targetRegions.map(region => region.id())
            );
            return this.unitUi.moveThisArmyTo(units, "shadow", toRegionId);
          }
        };
      // The Shadow Lengthens
      // Move two Shadow Armies up to two regions: each movement must end in a region already occupied by another Shadow Army (that must not be under siege). The
      // traversed regions must be free for the purposes of Army movement, and no Shadow units may be picked up or dropped off along the way (other than, possibly,
      // splitting the Army initially).
      case "sstr08":
        return {
          play: async () => {
            const actions: WotrAction[] = [];
            const doneMovements: WotrArmyMovement[] = [];
            let continueMoving = true;
            while (continueMoving) {
              const regionIds = this.unitRules.armyMovementStartingRegions("shadow", []);
              const units = await this.ui.askRegionUnits("Select a Shadow army to move", {
                type: "moveArmy",
                regionIds: regionIds,
                required: true,
                requiredUnits: [],
                retroguard: null,
                doneMovements
              });
              const fromRegion = units.regionId;
              const targetRegions = this.q
                .region(fromRegion)
                .reachableRegions(2, region => region.isFreeForArmyMovement("shadow"))
                .filter(r => r.hasArmyNotUnderSiege("shadow"));
              if (!targetRegions.length) {
                await this.ui.askContinue("No valid target regions available for movement");
                return actions;
              }
              const toRegionId = await this.ui.askRegion(
                "Select a region to move the army to",
                targetRegions.map(region => region.id())
              );
              const movActions = await this.unitUi.moveThisArmyTo(units, "shadow", toRegionId);
              actions.push(...movActions);
              continueMoving = false;
              const movement = findAction<WotrArmyMovement>(movActions, "army-movement")!;
              doneMovements.push(movement);
              if (doneMovements.length < 2) {
                continueMoving = await this.ui.askConfirm(
                  "Continue moving armies?",
                  "Move another",
                  "Stop moving"
                );
              }
            }
            return actions;
          }
        };
      // The Shadow is Moving
      // Play if all Shadow Nations are "At War."
      // Move up to four different Shadow Armies one region each
      case "sstr09":
        return {
          canBePlayed: () => this.q.shadowNations.every(nation => nation.isAtWar()),
          play: async () => {
            const actions: WotrAction[] = [];
            const doneMovements: WotrArmyMovement[] = [];
            let continueMoving = true;
            while (continueMoving) {
              const regionIds = this.unitRules.armyMovementStartingRegions("shadow", []);
              const units = await this.ui.askRegionUnits("Select a Shadow army to move", {
                type: "moveArmy",
                regionIds: regionIds,
                required: true,
                requiredUnits: [],
                retroguard: null,
                doneMovements
              });
              const fromRegion = units.regionId;
              const targetRegions = this.q
                .region(fromRegion)
                .reachableRegions(1, region => region.isFreeForArmyMovement("shadow"))
                .filter(r => r.hasArmyNotUnderSiege("shadow"));
              if (!targetRegions.length) {
                await this.ui.askContinue("No valid target regions available for movement");
                return actions;
              }
              const toRegionId = await this.ui.askRegion(
                "Select a region to move the army to",
                targetRegions.map(region => region.id())
              );
              const movActions = await this.unitUi.moveThisArmyTo(units, "shadow", toRegionId);
              actions.push(...movActions);
              continueMoving = false;
              const movement = findAction<WotrArmyMovement>(movActions, "army-movement")!;
              doneMovements.push(movement);
              if (doneMovements.length < 4) {
                continueMoving = await this.ui.askConfirm(
                  "Continue moving armies?",
                  "Move another",
                  "Stop moving"
                );
              }
            }
            return actions;
          }
        };
      // Corsairs of Umbar
      // Play if the Southrons & Easterlings are "At War."
      // Move one Shadow Army from Umbar to a Gondar coastal region (check the stacking limit immediately if it is merging with another Army).
      // If there is a Free Peoples Army in the region, a battle starts. The attacking Shadow Army cannot cease the attack, unless the Free Peoples Army was already under
      // siege.
      case "sstr10":
        return {
          canBePlayed: () => this.q.southrons.isAtWar(),
          play: async () => {
            const units = await this.ui.askRegionUnits("Select a Shadow army to move", {
              type: "moveArmy",
              regionIds: ["umbar"],
              required: true,
              requiredUnits: [],
              retroguard: null,
              doneMovements: []
            });
            if (!units) return [];
            const targetRegions = this.q
              .regions()
              .filter(r => r.isCoastal() && r.isNation("gondor"));
            const toRegionId = await this.ui.askRegion(
              "Select a region to move the army to",
              targetRegions.map(region => region.id())
            );
            const actions: WotrAction[] = [];
            const toRegion = this.q.region(toRegionId);
            if (toRegion.hasArmyNotUnderSiege("free-peoples")) {
              const fromRegion = this.q.region("umbar");
              const retroguard = this.unitUtils.splitUnits(fromRegion.army("shadow")!, units);
              return [attack("umbar", toRegionId, retroguard)];
            } else {
              actions.push(...(await this.unitUi.moveThisArmyTo(units, "shadow", toRegionId)));
            }
            return actions;
          }
        };
      // Rage Of The Dunlendings
      // Play if Isengard is "At War."
      // Recruit two Isengard Regular units in a free region adjacent to North or South Dunland.
      // You may also move to this region up to four Isengard units (Regular or Elite) from North Dunland and/or South Dunland.
      case "sstr11":
        return {
          canBePlayed: () => this.q.isengard.isAtWar(),
          play: async () => {
            const dunlandRegions: WotrRegionId[] = ["north-dunland", "south-dunland"];
            const regions = this.q
              .regions()
              .filter(
                r =>
                  dunlandRegions.some(dunland => r.isAdjacentTo(dunland)) &&
                  r.isFreeForRecruitmentByCard("shadow")
              )
              .map(r => r.id());
            const region = await this.ui.askRegion(
              "Select a region to recruit Isengard units",
              regions
            );
            const actions: WotrAction[] = [];
            actions.push(
              ...(await this.unitUi.recruitUnitsInSameRegionByCard(region, "isengard", 2, 0, 0))
            );
            actions.push(
              ...(await this.unitUi.rageOfTheDunledingsMoveUnits(region, dunlandRegions))
            );
            return actions;
          }
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
              .map(r => r.id());
            const region = await this.ui.askRegion(
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
              .map(r => r.id());
            const region = await this.ui.askRegion(
              "Select a region to recruit a Sauron unit",
              regions
            );
            const unit = await this.ui.askReinforcementUnit("Select a Sauron unit to recruit", {
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
              const region = await this.ui.askRegion(
                "Select a region to upgrade a Sauron regular unit",
                regions.map(r => r.id())
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
                .map(r => r.id())
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
          play: async () =>
            this.unitUi.recruitUnitsInSameRegionByCard("minas-morgul", "sauron", 5, 0, 1)
        };
      // Shadows on the Misty Mountains
      // Recruit two Sauron units (Regular or Elite) and one Nazgûl either in Mount Gram or Moria.
      case "sstr19":
        return {
          play: async () => {
            let regionIds: WotrRegionId[] = ["mount-gram", "moria"];
            regionIds = regionIds.filter(r =>
              this.q.region(r).isFreeForRecruitmentByCard("shadow")
            );
            if (!regionIds.length) {
              await this.ui.askContinue("No valid regions available for recruitment.");
              return [];
            }
            let regionId = regionIds[0];
            if (regionIds.length > 1) {
              regionId = await this.ui.askRegion(
                "Select a region to recruit Sauron units",
                regionIds
              );
            }
            const actions: WotrAction[] = [];
            actions.push(
              ...(await this.unitUi.recruitRegularsOrElitesByCard(regionId, "sauron", 2))
            );
            actions.push(
              ...(await this.unitUi.recruitUnitsInSameRegionByCard(regionId, "sauron", 0, 0, 1))
            );
            return actions;
          }
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
                .map(r => r.id())
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
                .map(r => r.id())
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
                  .map(r => r.id())
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
                  .map(r => r.id())
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
                .map(r => r.id())
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

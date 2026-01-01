import { inject, Injectable } from "@angular/core";
import { unexpectedStory } from "@leobg/commons";
import { WotrCard, WotrCardCombatLabel, WotrCardId } from "../card/wotr-card-models";
import {
  chooseCharacter,
  eliminateCharacter,
  WotrCharacterChoose,
  WotrCharacterElimination
} from "../character/wotr-character-actions";
import { findAction, findActions, WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrGameUi } from "../game/wotr-game-ui";
import { assertAction } from "../game/wotr-story-models";
import { WotrFreePeoplesPlayer } from "../player/wotr-free-peoples-player";
import { WotrPlayer } from "../player/wotr-player";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrRegionId } from "../region/wotr-region-models";
import {
  eliminateLeader,
  WotrEliteUnitDowngrade,
  WotrEliteUnitElimination,
  WotrLeaderElimination,
  WotrRegularUnitElimination
} from "../unit/wotr-unit-actions";
import { WotrUnitHandler } from "../unit/wotr-unit-handler";
import {
  WotrArmy,
  WotrForfeitLeadershipParams,
  WotrRegionUnitMatch
} from "../unit/wotr-unit-models";
import { WotrUnitRules } from "../unit/wotr-unit-rules";
import { WotrUnitUtils } from "../unit/wotr-unit-utils";
import { retreat, WotrCombatRoll, WotrLeaderForfeit } from "./wotr-battle-actions";
import { WotrCombatFront, WotrCombatRound } from "./wotr-battle-models";
import { WotrBattleUi } from "./wotr-battle-ui";

export interface WotrCombatCard {
  canBePlayed?: (params: WotrCombatCardParams) => boolean;
  effect: (card: WotrCard, params: WotrCombatCardParams) => Promise<void>;
}

export interface WotrCombatCardParams {
  front: WotrFrontId;
  shadow: WotrCombatFront;
  freePeoples: WotrCombatFront;
  combatRound: WotrCombatRound;
  // card: WotrCard;
  isAttacker: boolean;
  attackedArmy: () => WotrArmy | undefined;
  attackingArmy: () => WotrArmy | undefined;
  regionId: WotrRegionId;
}

export interface WotrCombatCardAbility {
  play: () => Promise<WotrAction[]>;
}

@Injectable({ providedIn: "root" })
export class WotrCombatCards {
  private unitHandler = inject(WotrUnitHandler);
  private unitUtils = inject(WotrUnitUtils);
  private ui = inject(WotrGameUi);
  private q = inject(WotrGameQuery);
  private unitRules = inject(WotrUnitRules);
  battleUi!: WotrBattleUi;

  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);

  canBePlayed(cardLabel: WotrCardCombatLabel, params: WotrCombatCardParams): boolean {
    const combatCard = this.combatCards[cardLabel];
    return combatCard.canBePlayed?.(params) ?? true;
  }

  async combatCardReaction(card: WotrCard, params: WotrCombatCardParams): Promise<void> {
    return this.combatCards[card.combatLabel].effect(card, params);
  }

  private async activateCombatCard(
    ability: WotrCombatCardAbility,
    cardId: WotrCardId,
    player: WotrPlayer
  ): Promise<false | WotrAction[]> {
    const story = await player.activateCombatCard(ability, cardId);
    switch (story.type) {
      case "reaction-combat-card":
        return story.actions;
      case "reaction-combat-card-skip":
        return false;
      default:
        throw unexpectedStory(story, " combat card activation or not");
    }
  }

  private async forfeitLeadership(
    params: WotrForfeitLeadershipParams,
    player: WotrPlayer
  ): Promise<number> {
    const story = await player.forfeitLeadership(params);
    if (!("actions" in story)) return 0;
    const action = findAction<WotrLeaderForfeit>(story.actions, "leader-forfeit");
    if (!action?.leaders) return 0;
    return this.unitUtils.leadership(action.leaders);
  }

  private combatCards: Record<WotrCardCombatLabel, WotrCombatCard> = {
    // Advantageous Position (Initiative 3)
    // Play if the defending Army is inside the borders of a Free Peoples Nation.
    // Subtract 1 from all dice on the Combat roll of the Shadow player (an unmodified '6' is still considered a hit for him).
    "Advantageous Position": {
      canBePlayed: params => {
        console.warn("Not implemented");
        return false;
      },
      effect: async (card, params) => {
        params.shadow.combatModifiers.push(-1);
      }
    },
    // Andúril (Initiative 4)
    // Play if Strider/Aragorn is in the battle.
    // Before rolling the dice for your Leader re-roll, forfeit Strider's Leadership to automatically change one missed die roll to a hit, or forfeit Aragorn's Leadership to
    // automatically change up to two missed die rolls to hits.
    "Anduril": {
      canBePlayed: params => {
        console.warn("Not implemented");
        return false;
      },
      effect: async (card, params) => {
        throw new Error("TODO");
      }
    },
    // Black Breath (Initiative 6)
    // Play if a Nazgûl is in the battle.
    // If your Leader re-roll scores at least one hit, you may additionally eliminate one Free Peoples Leader participating in the battle.
    // Alternatively, you can choose to eliminate a Companion in the battle, if the number of hits equals or exceeds the Companion's Level.
    "Black Breath": {
      canBePlayed: params => this.unitUtils.hasNazgul(params.shadow.army()),
      effect: async (card, params) => {
        const hits = params.shadow.nLeaderSuccesses;
        if (!hits) return;
        const ability: WotrCombatCardAbility = {
          play: async () => {
            const units = await this.ui.askRegionUnits("Choose a unit to eliminate", {
              type: "blackBreath",
              regionIds: [params.regionId],
              hits
            });
            if (units.leaders?.length)
              return [eliminateLeader(params.regionId, units.leaders[0].nation, 1)];
            if (units.characters?.length) return [eliminateCharacter(units.characters[0])];
            return [];
          }
        };
        await this.activateCombatCard(ability, card.id, this.shadow);
      }
    },
    // Blade of Westernesse (Initiative 6)
    // Play if a Hobbit is in the battle.
    // Use one hit during the Leader re-roll to eliminate one Minion of your choice that is participating in the battle
    "Blade of Westernesse": {
      canBePlayed: params => {
        console.warn("Not implemented");
        return false;
      },
      effect: async (card, params) => {
        throw new Error("TODO");
      }
    },
    // Brave Stand (Initiative 3)
    // Play if a Companion is in the battle.
    // The Shadow player rolls one die less in his Combat roll for each Companion in the battle (to a minimum of one).
    "Brave Stand": {
      canBePlayed: params => this.unitUtils.hasCompanions(params.freePeoples.army()),
      effect: async (card, params) => {
        params.shadow.lessNCombatDice = this.unitUtils.nCompanions(params.freePeoples.army());
      }
    },
    // Charge (Initiative 2)
    // Play if a Free Peoples Elite unit is in the battle.
    // Before the Combat roll, roll an additional attack using only the Free Peoples Elite units (up to a maximum of 5) and apply the result immediately.
    "Charge": {
      canBePlayed: params => this.unitUtils.hasEliteUnits(params.freePeoples.army()),
      effect: async (card, params) => {
        const nEliteUnits = this.unitUtils.getNEliteUnits(params.freePeoples.army());
        if (nEliteUnits > 0) {
          const rollStory = await this.freePeoples.rollCombatDice(nEliteUnits);
          const rollAction = assertAction<WotrCombatRoll>(rollStory, "combat-roll");
          const threashold = params.combatRound.siege ? 6 : 5;
          const nHits = rollAction.dice.filter(d => d >= threashold).length;
          await this.applyExtraCombatHits(nHits, params.shadow, card, params);
        }
      }
    },
    // Confusion (Initiative 4)
    // Every unmodified die result of '1' in the Shadow player's Combat roll scores one hit against the Shadow Army.
    // Any such result cannot be rolled again during the Shadow player's Leader re-roll.
    "Confusion": {
      effect: async (card, params) => {
        const oneResults = params.shadow.combatRoll!.filter(result => result === 1).length;
        params.freePeoples.hitsModifiers.push(oneResults);
        params.shadow.lessNLeaderDice = oneResults;
      }
    },
    // Cruel as Death (Initiative 3)
    // Play if the total Nazgûl Leadership is 2 or more.
    // Forfeit two points of Nazgûl Leadership to add 1 to all dice on your Combat roll.
    "Cruel as Death": {
      canBePlayed: params => this.unitUtils.nazgulLeadership(params.shadow.army()) >= 2,
      effect: async (card, params) => {
        const points = await this.forfeitLeadership(
          {
            cardId: card.id,
            frontId: "shadow",
            regionId: params.shadow.regionId,
            onlyNazgul: true,
            points: 2
          },
          this.shadow
        );
        if (points) params.shadow.combatModifiers.push(1);
      }
    },
    // Daring Defiance (Initiative 0)
    // Play if a Companion is in the battle.
    // Forfeit the Leadership of all the Companions participating in the battle to cancel the Combat card played by the Shadow player.
    "Daring Defiance": {
      canBePlayed: params => {
        console.warn("Not implemented");
        return false;
      },
      effect: async (card, params) => {
        throw new Error("TODO");
      }
    },
    // Daylight (Initiative 3)
    // The Shadow player rolls a maximum of three dice in his Combat roll.
    "Daylight": {
      effect: async (card, params) => {
        params.shadow.maxNCombatDice = 3;
      }
    },
    // Deadly Strife (Initiative 3)
    // Both Armies add 2 to all dice on their Combat roll and Leader re-roll.
    "Deadly Strife": {
      canBePlayed: params => true,
      effect: async (card, params) => {
        params.shadow.combatModifiers.push(2);
        params.shadow.leaderModifiers.push(2);
        params.freePeoples.combatModifiers.push(2);
        params.freePeoples.leaderModifiers.push(2);
      }
    },
    // Devilry of Orthanc (Initiative 3)
    // Play if an Isengard Army unit is in the battle and the defending Army is in a Stronghold.
    // Add 1 to all dice on your Combat roll.
    "Delivery of Orthanc": {
      canBePlayed: params => {
        const shadowArmy = params.isAttacker ? params.attackingArmy() : params.attackedArmy();
        if (!shadowArmy) return false;
        if (!this.unitUtils.hasUnitsOfNation("isengard", shadowArmy)) return false;
        // https://boardgamegeek.com/thread/2467589/devilry-of-orthanc
        if (!params.combatRound.siege) return false;
        return true;
      },
      effect: async (card, params) => {
        params.combatRound.shadow.combatModifiers.push(1);
      }
    },
    // Desperate Battle (Initiative 3)
    // Both Armies add 1 to all dice on their Combat roll and Leader re-roll.
    "Desperate Battle": {
      effect: async (card, params) => {
        params.shadow.combatModifiers.push(1);
        params.shadow.leaderModifiers.push(1);
        params.freePeoples.combatModifiers.push(1);
        params.freePeoples.leaderModifiers.push(1);
      }
    },
    // Dread and Despair (Initiative 3)
    // Play if the total Nazgûl Leadership is 1 or more.
    // Before the Combat roll, forfeit one or more points of Nazgûl Leadership.
    // During his Combat roll, the Free Peoples player rolls one Combat die less (to a minimum of one) for every point you have chosen to forfeit.
    "Dread and Despair": {
      canBePlayed: params => this.unitUtils.nazgulLeadership(params.shadow.army()) >= 1,
      effect: async (card, params) => {
        const points = await this.forfeitLeadership(
          {
            cardId: card.id,
            frontId: "shadow",
            regionId: params.regionId,
            onlyNazgul: true,
            points: "oneOrMore"
          },
          this.shadow
        );
        params.freePeoples.lessNCombatDice = points;
        params.shadow.forfeitedLeadership = points;
      }
    },
    // Durin's Bane (Initiative 2)
    // Play if the defending Army is within two regions of Moria.
    // Before the Combat Roll, roll an additional attack using three Combat dice; score hits on 4+ and apply the result immediately
    // https://boardgamegeek.com/thread/532748/durins-bane-within-two-regions-of-moria
    "Durin's Bane": {
      canBePlayed: params => this.q.region(params.regionId).isWithinNRegionsOf("moria", 2),
      effect: async (card, params) => {
        const ability: WotrCombatCardAbility = {
          play: async () => {
            const action = await this.battleUi.rollCombatDice(3, "shadow");
            return [action];
          }
        };
        const actions = await this.activateCombatCard(ability, card.id, this.shadow);
        if (!actions) return;
        const rollAction = findAction<WotrCombatRoll>(actions, "combat-roll")!;
        const nHits = rollAction?.dice.filter(d => d >= 4).length;
        await this.applyExtraCombatHits(nHits, params.freePeoples, card, params);
      }
    },
    // Ents' Rage (Initiative 3)
    // Play if the defending Army is in a Rohan region, Fangorn or Orthanc.
    // Add 2 to all dice on your Combat roll.
    "Ents' Rage": {
      canBePlayed: params => {
        console.warn("Not implemented");
        return false;
      },
      effect: async (card, params) => {
        throw new Error("TODO");
      }
    },
    // Fateful Strike (Initiative 6)
    // Play if a Free Peoples Leader or a Companion is in the battle.
    // If your Leader re-roll scores one hit, additionally eliminate a Nazgûl (if in the battle).
    // If the re-roll scores two or more hits, you can eliminate a Minion (if in the battle) instead of a Nazgûl.
    "Fateful Strike": {
      canBePlayed: params => {
        const army = params.freePeoples.army();
        return !!(army.leaders?.length || army.characters?.length);
      },
      effect: async (card, params) => {
        const nHits = params.freePeoples.nLeaderSuccesses;
        if (!nHits) return;
        const unitMatches: WotrRegionUnitMatch[] = [];
        if (nHits >= 2) {
          unitMatches.push({ unitType: "nazgulOrMinion" });
        } else {
          unitMatches.push({ unitType: "nazgul" });
        }
        await this.freePeoples.eliminateUnits(
          { regionIds: [params.regionId], units: unitMatches },
          card.id
        );
      }
    },
    // Foul Stench (Initiative 3)
    // Play if the total Nazgûl Leadership is 1 or more.
    // If the Nazgûl Leadership equals or exceeds the total Free Peoples Leadership, the Free Peoples Leader re-roll is cancelled.
    "Foul Stench": {
      canBePlayed: params => this.unitUtils.hasNazgul(params.shadow.army()),
      effect: async (card, params) => {
        const nazgulLeadership = this.unitUtils.nazgulLeadership(params.shadow.army());
        // TODO gandalf special ability
        const freePeoplesLeadership = this.unitUtils.leadership(params.freePeoples.army());
        if (nazgulLeadership >= freePeoplesLeadership) {
          params.freePeoples.leaderRollCancelled = true;
        }
      }
    },
    // Great Host (Initiative 7)
    // If, after removing casualties from the Combat roll and Leader re-roll
    // your Army units are at least twice as many as the enemy Army units,
    // score one automatic hit.
    "Great Host": {
      effect: async (card, params) => {
        const shadowArmny = params.shadow.army();
        const freePeoplesArmy = params.freePeoples.army();
        const nShadowUnits = this.unitUtils.getNArmyUnits(shadowArmny);
        const nFreePeoplesUnits = this.unitUtils.getNArmyUnits(freePeoplesArmy);
        if (nShadowUnits >= 2 * nFreePeoplesUnits) {
          await this.freePeoples.chooseCasualties(1, params.regionId, card.id);
        }
      }
    },
    // Heroic Death (Initiative 6)
    // Play if a Free Peoples Leader or a Companion is in the battle.
    // Before you remove casualties inflicted by your opponent's Combat roll and Leader re-roll, you may eliminate one of your Leaders to cancel one hit, or eliminate one
    // Companion to cancel a number of hits equal to or less than the Companion's Level.
    "Heroic Death": {
      canBePlayed: params => {
        const army = params.freePeoples.army();
        return !!(army.leaders?.length || army.characters?.length);
      },
      effect: async (card, params) => {
        const ability: WotrCombatCardAbility = {
          play: async () => {
            const units = await this.ui.askRegionUnits("Choose a unit to eliminate", {
              type: "heroicDeath",
              regionIds: [params.regionId]
            });
            if (units.leaders?.length) {
              const leader = units.leaders[0];
              return [eliminateLeader(params.regionId, leader.nation, 1)];
            } else if (units.characters?.length) {
              const character = units.characters[0];
              return [eliminateCharacter(character)];
            }
            return [];
          }
        };
        const r = await this.activateCombatCard(ability, card.id, this.freePeoples);
        if (r) {
          const leaderElim = findAction<WotrLeaderElimination>(r, "leader-elimination");
          if (leaderElim) {
            params.shadow.hitsModifiers.push(-1);
          } else {
            const characterElim = findAction<WotrCharacterElimination>(r, "character-elimination");
            if (characterElim) {
              const characterId = characterElim.characters[0];
              const character = this.q.character(characterId);
              params.shadow.hitsModifiers.push(
                -Math.min(character.character().level, params.shadow.nTotalHits || 0)
              );
            }
          }
        }
      }
    },
    // Huorn-dark (Initiative 3)
    // Play if the defending Army is in a Rohan region, Fangorn or Orthanc.
    // The Shadow player rolls a maximum of two dice in his Combat roll.
    "Huorn-dark": {
      canBePlayed: params => {
        console.warn("Not implemented");
        return false;
      },
      effect: async (card, params) => {
        throw new Error("TODO");
      }
    },
    // It is a gift (Initiative 3)
    // Play if the defending Army is in the same region as the Fellowship.
    // Add 1 to all dice on your Combat roll and Leader re-roll.
    "It is a Gift": {
      canBePlayed: params => {
        console.warn("Not implemented");
        return false;
      },
      effect: async (card, params) => {
        throw new Error("TODO");
      }
    },
    // Mighty Attack (Initiative 4)
    // Play if a Companion is in the battle.
    // Before rolling the dice for your Leader re-roll, forfeit the Leadership of one Companion participating in the battle to automatically change one missed die roll to a hit.
    "Mighty Attack": {
      canBePlayed: params => {
        console.warn("Not implemented");
        return false;
      },
      effect: async (card, params) => {
        throw new Error("TODO");
      }
    },
    // Mûmakil (Initiative 3-5)
    // Play if a Southrons & Easterlings Elite unit is in the battle.
    // Add 1 to all dice on your Combat roll. If, after the Leader re-roll, you scored more total hits than your opponent (including hits from any Free Peoples pre-Combat
    // attack from a Combat card), score one additional hit.
    "Mumakil": {
      canBePlayed: params => {
        console.warn("Not implemented");
        return false;
      },
      effect: async (card, params) => {
        throw new Error("TODO");
      }
    },
    // Nameless Wood (Initiative 5)
    // Play if the defending Army is in a Rohan region, Fangorn or Orthanc.
    // If your Combat roll or Leader reroll score at least one hit, score two additional hits.
    "Nameless Wood": {
      canBePlayed: params => {
        const region = this.q.region(params.regionId);
        return region.isNation("rohan") || region.id() === "fangorn" || region.id() === "orthanc";
      },
      effect: async (card, params) => {
        if (params.freePeoples.nTotalHits! > 0) {
          params.freePeoples.hitsModifiers.push(2);
        }
      }
    },
    // No Quarter (Initiative 5)
    // If your Combat roll or Leader re-roll scores at least one hit, score one additional hit.
    "No Quarter": {
      effect: async (card, params) => {
        if (params.freePeoples.nCombatSuccesses || params.freePeoples.nLeaderSuccesses) {
          params.freePeoples.hitsModifiers.push(1);
        }
      }
    },
    // One for the Dark Lord (Initiative 3)
    // Play if the defending Army is in the same region as the Fellowship.
    // Add 1 to all dice on your Combat roll and Leader re-roll.
    "One for the Dark Lord": {
      canBePlayed: params => {
        console.warn("Not implemented");
        return false;
      },
      effect: async (card, params) => {
        throw new Error("TODO");
      }
    },
    // Onslaught (Initiative 7)
    // After removing casualties from the Combat roll and Leader re-roll, you may inflict and apply up to four additional hits against your units. Roll one die for each hit
    // you inflicted to your units and score one hit against the enemy on each result of 4+.
    "Onslaught": {
      effect: async (card, params) => {
        const ability: WotrCombatCardAbility = {
          play: async () => {
            const shadowArmy = params.shadow.army();
            const maxHitPoints = this.unitUtils.nHits(shadowArmy);
            const hitPoints = await this.ui.askQuantity("Choose number of hit points to inflict", {
              default: 1,
              min: 1,
              max: Math.min(4, maxHitPoints)
            });
            if (!hitPoints) return [];
            return this.battleUi.chooseCasualties(hitPoints, params.regionId, "shadow");
          }
        };
        const actions = await this.activateCombatCard(ability, card.id, this.shadow);
        if (!actions) return;
        const hits = this.casualtyHits(actions);
        if (hits) {
          const rollStory = await this.shadow.rollCombatDice(hits);
          const rollAction = assertAction<WotrCombatRoll>(rollStory, "combat-roll");
          const nHits = rollAction.dice.filter(r => r >= 4).length;
          const fpArmy = params.freePeoples.army();
          const fpArmyHitPoints = this.unitUtils.nHits(fpArmy);
          if (nHits >= fpArmyHitPoints) {
            await this.freePeoples.eliminateArmy(params.regionId, card.id);
          } else {
            await this.freePeoples.chooseCasualties(nHits, params.regionId, card.id);
          }
        }
      }
    },
    // Relentless Assault (Initiative 3)
    // Before the Combat roll, you may inflict and apply up to two hits against your units. Add 1 to all dice on your Combat roll for each hit you inflicted.
    "Relentless Assault": {
      effect: async (card, params) => {
        const ability: WotrCombatCardAbility = {
          play: async () => {
            const hitPoints = await this.ui.askQuantity("Choose number of hit points to inflict", {
              default: 0,
              min: 0,
              max: 2
            });
            if (!hitPoints) return [];
            return this.battleUi.chooseCasualties(hitPoints, params.regionId, "shadow");
          }
        };
        const actions = await this.activateCombatCard(ability, card.id, this.shadow);
        if (!actions) return;
        const hits = this.casualtyHits(actions);
        if (hits) {
          params.shadow.combatModifiers.push(hits);
        }
      }
    },
    // Scouts (Initiative 1)
    // Play if the Free Peoples Army is defending in a field battle.
    // Before the Combat roll, retreat your Army to an adjacent free region or withdraw into a siege.
    "Scouts": {
      canBePlayed: params => {
        if (params.combatRound.siege) return false;
        if (params.freePeoples.isAttacker) return false;
        return true;
      },
      effect: async (card, params) => {
        const ability: WotrCombatCardAbility = {
          play: async () => {
            const region = this.q.region(params.regionId);
            const retreatableRegions = this.unitRules.retreatableRegions(
              region.region(),
              "free-peoples"
            );
            if (!retreatableRegions.length) return [];
            const retreatRegionId = await this.ui.askRegion(
              "Choose a region to retreat your Army to",
              retreatableRegions
            );
            return [retreat(retreatRegionId)];
          }
        };
        const actions = await this.activateCombatCard(ability, card.id, this.freePeoples);
        if (!actions) return;
        params.combatRound.endBattle = true;
      }
    },
    // Servant of the Secret Fire (Initiative 3)
    // Play if Gandalf is in the battle.
    // Add 1 to all dice on your Combat roll.
    "Servant of the Secret Fire": {
      canBePlayed: params => {
        console.warn("Not implemented");
        return false;
      },
      effect: async (card, params) => {
        throw new Error("TODO");
      }
    },
    // Shield-wall (Initiative 6)
    // Before you remove casualties inflicted by your opponent's Combat roll and Leader re-roll, if your opponent scored two or more hits, cancel one hit.
    "Shield-Wall": {
      effect: async (card, params) => {
        if (params.shadow.nTotalHits! >= 2) {
          params.freePeoples.hitsModifiers.push(-1);
        }
      }
    },
    // Sudden Strike (Initiative 2)
    // Play if a Free Peoples Leader or a Companion is in the battle.
    // Before the Combat roll, roll an additional attack using a number of dice equal to your Leadership (up to a maximum of 5) and apply the result immediately.
    "Sudden Strike": {
      canBePlayed: params => {
        const army = params.freePeoples.army();
        return !!(army.leaders?.length || army.characters?.length);
      },
      effect: async (card, params) => {
        const ability: WotrCombatCardAbility = {
          play: async () => {
            const leadership = this.unitUtils.leadership(params.freePeoples.army());
            const nDice = Math.min(leadership, 5);
            if (nDice === 0) return [];
            return [await this.battleUi.rollCombatDice(nDice, "free-peoples")];
          }
        };
        const actions = await this.activateCombatCard(ability, card.id, this.freePeoples);
        if (!actions) return;
        const action = findAction<WotrCombatRoll>(actions, "combat-roll");
        const nHits = action!.dice.filter(r => r >= 5).length;
        await this.applyExtraCombatHits(nHits, params.shadow, card, params);
      }
    },
    // Swarm of Bats (Initiative 0)
    // Cancel the effects of the Combat card played by the Free Peoples player.
    // If the Free Peoples player did not play a card, add 1 to all dice on your Leader re-roll.
    "Swarm of Bats": {
      effect: async (card, params) => {
        if (params.freePeoples.combatCard) {
          params.freePeoples.combatCard = undefined;
        } else {
          params.shadow.leaderModifiers.push(1);
        }
      }
    },
    // They are Terrible (Initiative 4)
    // Play if the total Nazgûl Leadership is 1 or more.
    // Forfeit one point of Nazgûl Leadership to add 1 to all dice on your Leader re-roll.
    "They are Terrible": {
      canBePlayed: params => this.unitUtils.nazgulLeadership(params.shadow.army()) >= 1,
      effect: async (card, params) => {
        const points = await this.forfeitLeadership(
          {
            cardId: card.id,
            frontId: "shadow",
            regionId: params.regionId,
            onlyNazgul: true,
            points: 1
          },
          this.shadow
        );
        if (points) params.shadow.leaderModifiers.push(1);
      }
    },
    // Valour (Initiative 3)
    // Play if a Free Peoples Elite unit is in the battle.
    // Add 1 to all dice on your Combat roll.
    "Valour": {
      canBePlayed: params => {
        return params.freePeoples.army().elites?.some(u => u.quantity) ?? false;
      },
      effect: async (card, params) => {
        params.freePeoples.combatModifiers.push(1);
      }
    },
    // We Come to Kill (Initiative 7)
    // Play if a Shadow Elite unit is in the battle.
    // After removing casualties from the Combat roll and Leader re-roll,
    // roll an additional attack using only the Shadow Elite units (up to a maximum of five) and score one hit for each result of 5+.
    "We Come to Kill": {
      canBePlayed: params => this.unitUtils.hasEliteUnits(params.shadow.army()),
      effect: async (card, params) => {
        const ability: WotrCombatCardAbility = {
          play: async () => {
            const nElites = this.unitUtils.getNEliteUnits(params.shadow.army());
            const nDice = Math.min(nElites, 5);
            if (nDice === 0) return [];
            return [await this.battleUi.rollCombatDice(nDice, "shadow")];
          }
        };
        const actions = await this.activateCombatCard(ability, card.id, this.shadow);
        if (!actions) return;
        const action = findAction<WotrCombatRoll>(actions, "combat-roll");
        const nHits = action!.dice.filter(r => r >= 5).length;
        if (nHits) {
          await this.freePeoples.chooseCasualties(nHits, params.regionId, card.id);
        }
      }
    },
    // Words of Power (Initiative 1)
    // Play if a Nazgûl is in the battle.
    // Choose a Companion. That Companion's Leadership and special abilities are cancelled for this Combat round.
    "Words of Power": {
      canBePlayed: params => this.unitUtils.hasNazgul(params.shadow.army()),
      effect: async (card, params) => {
        const ability: WotrCombatCardAbility = {
          play: async () => {
            const units = await this.ui.askRegionUnits("Choose a Companion to cancel", {
              type: "wordsOfPower",
              regionIds: [params.regionId]
            });
            if (units.characters?.length) return [chooseCharacter(units.characters[0])];
            return [];
          }
        };
        const actions = await this.activateCombatCard(ability, card.id, this.shadow);
        if (!actions) return;
        const action = findAction<WotrCharacterChoose>(actions, "character-choose");
        params.freePeoples.cancelledCharacters.push(action!.characters[0]);
      }
    }
  };

  private casualtyHits(actions: WotrAction[]) {
    const regularEliminations = findActions<WotrRegularUnitElimination>(
      actions,
      "regular-unit-elimination"
    );
    const eliteEliminations = findActions<WotrEliteUnitElimination>(
      actions,
      "elite-unit-elimination"
    );
    const eliteDowngrades = findActions<WotrEliteUnitDowngrade>(actions, "elite-unit-downgrade");
    let hits = 0;
    hits += regularEliminations.reduce((sum, elim) => sum + elim.quantity, 0);
    hits += eliteEliminations.reduce((sum, elim) => sum + elim.quantity, 0);
    hits += eliteDowngrades.reduce((sum, downgrade) => sum + downgrade.quantity, 0);
    return hits;
  }

  private async applyExtraCombatHits(
    nHits: number,
    defendingFront: WotrCombatFront,
    card: WotrCard,
    params: WotrCombatCardParams
  ) {
    if (!nHits) return;
    const armyHitPoints = this.unitUtils.nHits(defendingFront.army());
    if (nHits >= armyHitPoints) {
      await defendingFront.player.eliminateArmy(params.regionId, card.id);
      params.combatRound.endBattle = true;
    } else {
      await defendingFront.player.chooseCasualties(nHits, params.regionId, card.id);
    }
  }
}

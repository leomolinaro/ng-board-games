import { inject, Injectable } from "@angular/core";
import { randomUtil } from "@leobg/commons/utils";
import { getCard, WotrCardId } from "../card/wotr-card-models";
import { eliminateCharacter } from "../character/wotr-character-actions";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrGameUi } from "../game/wotr-game-ui";
import { WotrStory } from "../game/wotr-story-models";
import { WotrRegion, WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import {
  downgradeEliteUnit,
  eliminateEliteUnit,
  eliminateLeader,
  eliminateNazgul,
  eliminateRegularUnit
} from "../unit/wotr-unit-actions";
import { WotrUnits } from "../unit/wotr-unit-models";
import { WotrUnitUtils } from "../unit/wotr-unit-utils";
import {
  advanceArmy,
  ceaseBattle,
  combatCardById,
  continueBattle,
  noCombatCard,
  notAdvanceArmy,
  notRetreat,
  notRetreatIntoSiege,
  retreat,
  retreatIntoSiege,
  WotrCombatReRoll,
  WotrCombatRoll
} from "./wotr-battle-actions";
import { WotrBattleHandler } from "./wotr-battle-handler";
import { WotrCombatRound } from "./wotr-battle-models";
import { WotrBattleStore } from "./wotr-battle-store";
import { WotrCombatCardAbility, WotrCombatCards } from "./wotr-combat-cards";
import { WotrCombatDie } from "./wotr-combat-die-models";

@Injectable({ providedIn: "root" })
export class WotrBattleUi {
  private ui = inject(WotrGameUi);
  private battleStore = inject(WotrBattleStore);
  private regionStore = inject(WotrRegionStore);
  private unitUtils = inject(WotrUnitUtils);
  private q = inject(WotrGameQuery);
  private combatCards = inject(WotrCombatCards);
  private battleHandler = inject(WotrBattleHandler);

  async rollCombatDice(nDice: number, frontId: WotrFrontId): Promise<WotrCombatRoll> {
    await this.ui.askContinue(`Roll ${nDice} combat dice`);
    return {
      type: "combat-roll",
      dice: this.rollDice(nDice)
    };
  }

  async reRollCombatDice(nDice: number, frontId: WotrFrontId): Promise<WotrCombatReRoll> {
    await this.ui.askContinue(`Re-roll ${nDice} combat dice`);
    return {
      type: "combat-re-roll",
      dice: this.rollDice(nDice)
    };
  }

  rollDice(nDice: number): WotrCombatDie[] {
    const dice: WotrCombatDie[] = [];
    for (let i = 0; i < nDice; i++) {
      dice.push(randomUtil.getRandomInteger(1, 7) as WotrCombatDie);
    }
    return dice;
  }

  async chooseCasualties(
    hitPoints: number,
    regionId: WotrRegionId,
    frontId: WotrFrontId
  ): Promise<WotrAction[]> {
    const underSiege = this.q.region(regionId).isUnderSiege(frontId);
    const units = await this.ui.askCasualtyUnits(`Choose casualties for ${hitPoints} hit points`, {
      type: "chooseCasualties",
      regionIds: [regionId],
      underSiege,
      hitPoints,
      retroguard: null
    });
    return this.eliminateUnitActions(units, regionId);
  }

  async eliminateArmy(regionId: WotrRegionId, frontId: WotrFrontId): Promise<WotrAction[]> {
    const underSiege = this.q.region(regionId).isUnderSiege(frontId);
    const units = await this.ui.askCasualtyUnits("Eliminate the entire army", {
      type: "chooseCasualties",
      regionIds: [regionId],
      underSiege,
      hitPoints: "full",
      retroguard: null
    });
    return this.eliminateUnitActions(units, regionId);
  }

  private eliminateUnitActions(
    units: {
      downgrading: WotrUnits;
      removing: WotrUnits;
    },
    regionId: WotrRegionId
  ): WotrAction[] {
    const actions: WotrAction[] = [];
    units.downgrading.elites?.forEach(unit =>
      actions.push(downgradeEliteUnit(regionId, unit.nation, unit.quantity))
    );
    units.removing.regulars?.forEach(unit =>
      actions.push(eliminateRegularUnit(regionId, unit.nation, unit.quantity))
    );
    units.removing.elites?.forEach(unit =>
      actions.push(eliminateEliteUnit(regionId, unit.nation, unit.quantity))
    );
    units.removing.leaders?.forEach(unit =>
      actions.push(eliminateLeader(regionId, unit.nation, unit.quantity))
    );
    if (units.removing.nNazgul) {
      actions.push(eliminateNazgul(regionId, units.removing.nNazgul));
    }
    units.removing.characters?.forEach(unit => actions.push(eliminateCharacter(unit)));
    return actions;
  }

  async battleAdvance(): Promise<WotrAction[]> {
    const battle = this.battleStore.battle()!;
    const fromRegion = this.regionStore.region(battle.action.fromRegion);
    const movingUnits = await this.ui.askRegionUnits("Choose units to advance", {
      type: "moveArmy",
      regionIds: [fromRegion.id],
      retroguard: battle.retroguard || null,
      requiredUnits: [],
      required: false
    });
    if (this.unitUtils.isEmptyArmy(movingUnits)) {
      return [notAdvanceArmy(fromRegion.id)];
    } else {
      const leftUnits = this.unitUtils.splitUnits(fromRegion.army, movingUnits);
      return [advanceArmy(leftUnits)];
    }
  }

  async wantRetreatIntoSiege(): Promise<WotrAction> {
    const battle = this.battleStore.battle()!;
    const region = this.regionStore.region(battle.action.toRegion);
    const confirm = await this.ui.askConfirm(
      `Do you want to retreat into siege in ${region.name}?`,
      "Retreat into siege",
      "Continue field battle"
    );
    return confirm ? retreatIntoSiege(region.id) : notRetreatIntoSiege(region.id);
  }

  async wantContinueBattle(): Promise<WotrAction[]> {
    const battle = this.battleStore.battle()!;
    const region = this.regionStore.region(battle.action.toRegion);
    const confirm = await this.ui.askConfirm(
      `Do you want to continue the battle in ${region.name}?`,
      "Continue battle",
      "Cease battle"
    );
    if (!confirm) return [ceaseBattle(region.id)];
    const actions: WotrAction[] = [];
    if (battle.siege) {
      const downgradeSelection = await this.ui.askRegionUnits("Choose an elite unit to downgrade", {
        type: "downgradeUnit",
        nEliteUnits: 1,
        regionIds: [region.id]
      });
      actions.push(downgradeEliteUnit(region.id, downgradeSelection.elites![0].nation, 1));
    }
    actions.push(continueBattle(region.id));
    return actions;
  }

  async wantRetreat(): Promise<WotrAction> {
    const battle = this.battleStore.battle()!;
    const region = this.regionStore.region(battle.action.toRegion);
    const confirm = await this.ui.askConfirm(
      `Do you want to retreat from ${region.name}?`,
      "Retreat",
      "Not retreat"
    );
    if (confirm) {
      const retreatableRegions = this.retreatableRegions(region, battle.defender.frontId);
      const toRegionId = await this.ui.askRegion(
        "Choose a region to retreat to",
        retreatableRegions
      );
      return retreat(toRegionId);
    } else {
      return notRetreat();
    }
  }

  private retreatableRegions(fromRegion: WotrRegion, frontId: WotrFrontId): WotrRegionId[] {
    return fromRegion.neighbors
      .filter(neighbor => {
        return this.regionStore.isFreeForArmyRetreat(neighbor, frontId);
      })
      .map(neighbor => neighbor.id);
  }

  async chooseCombatCard(
    frontId: WotrFrontId,
    combatRound: WotrCombatRound
  ): Promise<WotrAction[]> {
    const doPlayCard = await this.ui.askConfirm(
      "Do you want to play a combat card?",
      "Choose combat card",
      "Skip"
    );
    if (!doPlayCard) return [noCombatCard()];
    const params = this.battleHandler.combatCardParams(frontId, combatRound);
    const playableCards = this.q
      .front(frontId)
      .handCards()
      .filter(c => {
        const card = getCard(c);
        return this.combatCards.canBePlayed(card.combatLabel, params);
      });
    const cardId = await this.ui.askHandCard("Choose a combat card to play", {
      nCards: 1,
      frontId,
      message: "Choose a combat card to play",
      cards: playableCards
    });
    return [combatCardById(cardId)];
  }

  async activateCombatCard(ability: WotrCombatCardAbility, cardId: WotrCardId): Promise<WotrStory> {
    const card = getCard(cardId);
    const confirm = await this.ui.askConfirm(
      `Do you want to activate ${card.combatLabel} ability?`,
      "Activate",
      "Skip"
    );
    if (confirm) {
      return {
        type: "reaction-combat-card",
        card: cardId,
        actions: await ability.play()
      };
    } else {
      return { type: "reaction-combat-card-skip", card: cardId };
    }
  }
}

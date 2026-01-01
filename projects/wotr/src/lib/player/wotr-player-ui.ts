import { inject, Injectable } from "@angular/core";
import { WotrUiAbility } from "../ability/wotr-ability";
import { WotrActionDieUi } from "../action-die/wotr-action-die-ui";
import { WotrCombatRound } from "../battle/wotr-battle-models";
import { WotrBattleStore } from "../battle/wotr-battle-store";
import { WotrBattleUi } from "../battle/wotr-battle-ui";
import { WotrCombatCardAbility } from "../battle/wotr-combat-cards";
import { WotrCardDrawUi } from "../card/wotr-card-draw-ui";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCardPlayUi } from "../card/wotr-card-play-ui";
import { WotrCharacterId, WotrCompanionId } from "../character/wotr-character-models";
import { WotrCharacterUi } from "../character/wotr-character-ui";
import { WotrFellowshipUi } from "../fellowship/wotr-fellowship-ui";
import { WotrFrontId } from "../front/wotr-front-models";
import {
  WotrBaseStory,
  WotrCardReactionStory,
  WotrCombatCardReactionStory,
  WotrReactionStory,
  WotrStory
} from "../game/wotr-story-models";
import { WotrHuntEffectParams } from "../hunt/wotr-hunt-models";
import { WotrHuntUi } from "../hunt/wotr-hunt-ui";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionUi } from "../region/wotr-region-ui";
import { WotrEliminateUnitsParams, WotrForfeitLeadershipParams } from "../unit/wotr-unit-models";
import { WotrUnitUi } from "../unit/wotr-unit-ui";
import { WotrPlayerStoryService } from "./wotr-player-story-service";

@Injectable({ providedIn: "root" })
export class WotrPlayerUi implements WotrPlayerStoryService {
  private actionDieUi = inject(WotrActionDieUi);
  private battleUi = inject(WotrBattleUi);
  private cardDrawUi = inject(WotrCardDrawUi);
  private fellowshipUi = inject(WotrFellowshipUi);
  private huntUi = inject(WotrHuntUi);
  private characterUi = inject(WotrCharacterUi);
  private cardPlayUi = inject(WotrCardPlayUi);
  private unitUi = inject(WotrUnitUi);
  private battleStore = inject(WotrBattleStore);
  private regionUi = inject(WotrRegionUi);

  async firstPhaseDraw(frontId: WotrFrontId): Promise<WotrStory> {
    return {
      type: "base",
      actions: [await this.cardDrawUi.firstPhaseDrawCards(frontId)]
    };
  }

  async firstPhaseDiscard(frontId: WotrFrontId): Promise<WotrStory> {
    return {
      type: "base",
      actions: [await this.cardDrawUi.discardExcessCards(frontId)]
    };
  }

  async fellowshipPhase(): Promise<WotrStory> {
    return {
      type: "base",
      actions: await this.fellowshipUi.fellowshipPhase()
    };
  }

  async huntAllocationPhase(): Promise<WotrStory> {
    return { type: "base", actions: await this.huntUi.huntAllocationPhase() };
  }

  async rollActionDice(frontId: WotrFrontId): Promise<WotrStory> {
    return {
      type: "base",
      actions: [await this.actionDieUi.rollActionDice(frontId)]
    };
  }

  async actionResolution(frontId: WotrFrontId): Promise<WotrStory> {
    return this.actionDieUi.actionResolution(frontId, null);
  }

  async separateCompanions(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }

  async rollHuntDice(): Promise<WotrStory> {
    return { type: "base", actions: [await this.huntUi.rollHuntDice()] };
  }

  async reRollHuntDice(nReRolls: number): Promise<WotrStory> {
    return { type: "base", actions: [await this.huntUi.reRollHuntDice(nReRolls)] };
  }

  async rollShelobsLairDie(): Promise<WotrStory> {
    return { type: "base", actions: [await this.huntUi.rollShelobsLairDie()] };
  }

  async drawHuntTile(): Promise<WotrStory> {
    return { type: "base", actions: [await this.huntUi.drawHuntTile()] };
  }

  async huntEffect(huntResolution: WotrHuntEffectParams): Promise<WotrStory> {
    return { type: "base", actions: await this.huntUi.huntEffect(huntResolution) };
  }

  async lureOfTheRingEffect(character: WotrCompanionId): Promise<WotrStory> {
    return {
      type: "reaction-card",
      card: "scha13",
      actions: await this.huntUi.lureOfTheRingEffect(character)
    };
  }

  async revealFellowship(): Promise<WotrStory> {
    return {
      type: "base",
      actions: await this.huntUi.revealFellowship()
    };
  }

  async activateTableCard(ability: WotrUiAbility, cardId: WotrCardId): Promise<WotrStory> {
    return this.cardPlayUi.activateTableCard(ability, cardId);
  }

  async activateCombatCard(ability: WotrCombatCardAbility, cardId: WotrCardId): Promise<WotrStory> {
    return this.battleUi.activateCombatCard(ability, cardId);
  }

  async activateCharacterAbility(
    ability: WotrUiAbility,
    characterId: WotrCharacterId
  ): Promise<WotrStory> {
    return this.characterUi.activateCharacterAbility(ability, characterId);
  }

  async forfeitLeadership(params: WotrForfeitLeadershipParams): Promise<WotrReactionStory> {
    return this.unitUi.forfeitLeadership(params);
  }

  async wantRetreatIntoSiege(): Promise<WotrBaseStory> {
    return {
      type: "base",
      actions: [await this.battleUi.wantRetreatIntoSiege()]
    };
  }

  async wantRetreat(): Promise<WotrBaseStory> {
    return {
      type: "base",
      actions: [await this.battleUi.wantRetreat()]
    };
  }

  async chooseCombatCard(
    frontId: WotrFrontId,
    combatRound: WotrCombatRound
  ): Promise<WotrBaseStory> {
    return { type: "base", actions: await this.battleUi.chooseCombatCard(frontId, combatRound) };
  }

  async rollCombatDice(nDice: number, frontId: WotrFrontId): Promise<WotrBaseStory> {
    return {
      type: "base",
      actions: [await this.battleUi.rollCombatDice(nDice, frontId)]
    };
  }

  async reRollCombatDice(nDice: number, frontId: WotrFrontId): Promise<WotrBaseStory> {
    return {
      type: "base",
      actions: [await this.battleUi.reRollCombatDice(nDice, frontId)]
    };
  }

  async chooseCasualties(
    hitPoints: number,
    regionId: WotrRegionId,
    cardId: WotrCardId | null,
    frontId: WotrFrontId
  ): Promise<WotrBaseStory | WotrCardReactionStory | WotrCombatCardReactionStory> {
    const actions = await this.battleUi.chooseCasualties(hitPoints, regionId, frontId);
    if (cardId) {
      if (this.battleStore.battleInProgress()) {
        return { type: "reaction-combat-card", card: cardId, actions };
      } else {
        return { type: "reaction-card", card: cardId, actions };
      }
    } else {
      return { type: "base", actions };
    }
  }

  async eliminateArmy(
    regionId: WotrRegionId,
    cardId: WotrCardId | null,
    frontId: WotrFrontId
  ): Promise<WotrBaseStory | WotrCardReactionStory> {
    const actions = await this.battleUi.eliminateArmy(regionId, frontId);
    if (cardId) {
      return { type: "reaction-card", card: cardId, actions };
    } else {
      return { type: "base", actions };
    }
  }

  async battleAdvance(): Promise<WotrBaseStory> {
    return {
      type: "base",
      actions: await this.battleUi.battleAdvance()
    };
  }

  async wantContinueBattle(): Promise<WotrBaseStory> {
    return {
      type: "base",
      actions: await this.battleUi.wantContinueBattle()
    };
  }

  async discardExcessCards(frontId: WotrFrontId): Promise<WotrBaseStory> {
    return {
      type: "base",
      actions: [await this.cardDrawUi.discardExcessCards(frontId)]
    };
  }

  async playCharacterCardFromHand(frontId: WotrFrontId): Promise<WotrBaseStory> {
    return {
      type: "base",
      actions: await this.cardPlayUi.playCharacterCardFromHand(frontId)
    };
  }

  async eliminateUnits(
    params: WotrEliminateUnitsParams,
    cardId: WotrCardId,
    frontId: WotrFrontId
  ): Promise<WotrCardReactionStory> {
    return {
      type: "reaction-card",
      card: cardId,
      actions: await this.unitUi.eliminateUnits(params, frontId)
    };
  }

  async chooseRegion(
    regions: WotrRegionId[],
    cardId: WotrCardId,
    frontId: WotrFrontId
  ): Promise<WotrCardReactionStory> {
    return {
      type: "reaction-card",
      card: cardId,
      actions: [await this.regionUi.chooseRegion(regions)]
    };
  }

  async theEaglesAreComingEffect(
    nHits: number,
    region: WotrRegionId,
    cardId: WotrCardId
  ): Promise<WotrCardReactionStory> {
    return {
      type: "reaction-card",
      card: cardId,
      actions: await this.unitUi.theEaglesAreComingEffect(nHits, region, cardId)
    };
  }
}

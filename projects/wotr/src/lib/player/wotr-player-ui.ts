import { inject, Injectable } from "@angular/core";
import { WotrActionDieUi } from "../action-die/wotr-action-die-ui";
import { WotrBattleUi } from "../battle/wotr-battle-ui";
import { WotrCardDrawUi } from "../card/wotr-card-draw-ui";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrCharacterUi } from "../character/wotr-character-ui";
import { WotrFellowshipUi } from "../fellowship/wotr-fellowship-ui";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrBaseStory, WotrReactionStory, WotrStory } from "../game/wotr-story-models";
import { WotrHuntEffectParams } from "../hunt/wotr-hunt-models";
import { WotrHuntUi } from "../hunt/wotr-hunt-ui";
import { WotrPlayerStoryService } from "./wotr-player-story-service";
import { WotrUiAbility } from "../ability/wotr-ability";

@Injectable({ providedIn: "root" })
export class WotrPlayerUi implements WotrPlayerStoryService {
  private actionDieUi = inject(WotrActionDieUi);
  private battleUi = inject(WotrBattleUi);
  private cardUi = inject(WotrCardDrawUi);
  private fellowshipUi = inject(WotrFellowshipUi);
  private huntUi = inject(WotrHuntUi);
  private characterUi = inject(WotrCharacterUi);

  async firstPhaseDraw(frontId: WotrFrontId): Promise<WotrStory> {
    return {
      type: "base",
      actions: [await this.cardUi.firstPhaseDrawCards(frontId)]
    };
  }

  async firstPhaseDiscard(frontId: WotrFrontId): Promise<WotrStory> {
    return {
      type: "base",
      actions: [await this.cardUi.discardExcessCards(frontId)]
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

  async drawHuntTile(): Promise<WotrStory> {
    return { type: "base", actions: [await this.huntUi.drawHuntTile()] };
  }

  async huntEffect(huntResolution: WotrHuntEffectParams): Promise<WotrStory> {
    return { type: "base", actions: await this.huntUi.huntEffect(huntResolution) };
  }

  async revealFellowship(): Promise<WotrStory> {
    return {
      type: "base",
      actions: await this.huntUi.revealFellowship()
    };
  }

  async activateTableCard(cardId: WotrCardId): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }

  async activateCombatCard(cardId: WotrCardId): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }

  async activateCharacterAbility(
    ability: WotrUiAbility,
    characterId: WotrCharacterId
  ): Promise<WotrStory> {
    return this.characterUi.activateCharacterAbility(ability, characterId);
  }

  async forfeitLeadership(): Promise<WotrReactionStory> {
    throw new Error("Method not implemented.");
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

  async chooseCombatCard(frontId: WotrFrontId): Promise<WotrBaseStory> {
    return { type: "base", actions: await this.battleUi.chooseCombatCard(frontId) };
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

  async chooseCasualties(hitPoints: number, frontId: WotrFrontId): Promise<WotrBaseStory> {
    return {
      type: "base",
      actions: await this.battleUi.chooseCasualties(hitPoints, frontId)
    };
  }

  async eliminateArmy(frontId: WotrFrontId): Promise<WotrBaseStory> {
    return {
      type: "base",
      actions: await this.battleUi.eliminateArmy(frontId)
    };
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
      actions: [await this.battleUi.wantContinueBattle()]
    };
  }

  async discardExcessCards(frontId: WotrFrontId): Promise<WotrBaseStory> {
    return {
      type: "base",
      actions: [await this.cardUi.discardExcessCards(frontId)]
    };
  }
}

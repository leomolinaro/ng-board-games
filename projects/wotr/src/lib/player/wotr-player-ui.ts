import { inject, Injectable } from "@angular/core";
import { WotrActionDieUi } from "../action-die/wotr-action-die-ui";
import { WotrBattleUi } from "../battle/wotr-battle-ui";
import { WotrCardDrawUi } from "../card/wotr-card-draw-ui";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrFellowshipUi } from "../fellowship/wotr-fellowship-ui";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrBattleStory, WotrGameStory, WotrReactionStory } from "../game/wotr-story-models";
import { WotrHuntEffectParams } from "../hunt/wotr-hunt-models";
import { WotrHuntUi } from "../hunt/wotr-hunt-ui";
import { WotrPlayerStoryService } from "./wotr-player-story-service";

@Injectable({ providedIn: "root" })
export class WotrPlayerUi implements WotrPlayerStoryService {
  private actionDieUi = inject(WotrActionDieUi);
  private battleUi = inject(WotrBattleUi);
  private cardUi = inject(WotrCardDrawUi);
  private fellowshipUi = inject(WotrFellowshipUi);
  private huntUi = inject(WotrHuntUi);

  async firstPhase(frontId: WotrFrontId): Promise<WotrGameStory> {
    return {
      type: "phase",
      actions: await this.cardUi.firstPhaseDrawCards(frontId)
    };
  }

  async fellowshipPhase(): Promise<WotrGameStory> {
    return {
      type: "phase",
      actions: await this.fellowshipUi.fellowshipPhase()
    };
  }

  async huntAllocationPhase(): Promise<WotrGameStory> {
    return { type: "phase", actions: await this.huntUi.huntAllocationPhase() };
  }

  async rollActionDice(frontId: WotrFrontId): Promise<WotrGameStory> {
    return {
      type: "phase",
      actions: [await this.actionDieUi.rollActionDice(frontId)]
    };
  }

  async actionResolution(frontId: WotrFrontId): Promise<WotrGameStory> {
    return this.actionDieUi.actionResolution(frontId);
  }

  async separateCompanions(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async rollHuntDice(): Promise<WotrGameStory> {
    return { type: "hunt", actions: [await this.huntUi.rollHuntDice()] };
  }

  async reRollHuntDice(nReRolls: number): Promise<WotrGameStory> {
    return { type: "hunt", actions: [await this.huntUi.reRollHuntDice(nReRolls)] };
  }

  async drawHuntTile(): Promise<WotrGameStory> {
    return { type: "hunt", actions: [await this.huntUi.drawHuntTile()] };
  }

  async huntEffect(huntResolution: WotrHuntEffectParams): Promise<WotrGameStory> {
    return { type: "hunt", actions: await this.huntUi.huntEffect(huntResolution) };
  }

  async revealFellowship(): Promise<WotrGameStory> {
    return {
      type: "hunt",
      actions: await this.huntUi.revealFellowship()
    };
  }

  async activateTableCard(cardId: WotrCardId): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async activateCombatCard(cardId: WotrCardId): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async activateCharacterAbility(characterId: WotrCharacterId): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async forfeitLeadership(): Promise<WotrReactionStory> {
    throw new Error("Method not implemented.");
  }

  async wantRetreatIntoSiege(): Promise<WotrBattleStory> {
    return {
      type: "battle",
      actions: [await this.battleUi.wantRetreatIntoSiege()]
    };
  }

  async wantRetreat(): Promise<WotrBattleStory> {
    return {
      type: "battle",
      actions: [await this.battleUi.wantRetreat()]
    };
  }

  async chooseCombatCard(frontId: WotrFrontId): Promise<WotrBattleStory> {
    return { type: "battle", actions: await this.battleUi.chooseCombatCard(frontId) };
  }

  async rollCombatDice(nDice: number, frontId: WotrFrontId): Promise<WotrBattleStory> {
    return {
      type: "battle",
      actions: [await this.battleUi.rollCombatDice(nDice, frontId)]
    };
  }

  async reRollCombatDice(nDice: number, frontId: WotrFrontId): Promise<WotrBattleStory> {
    return {
      type: "battle",
      actions: [await this.battleUi.reRollCombatDice(nDice, frontId)]
    };
  }

  async chooseCasualties(hitPoints: number, frontId: WotrFrontId): Promise<WotrBattleStory> {
    return {
      type: "battle",
      actions: await this.battleUi.chooseCasualties(hitPoints, frontId)
    };
  }

  async eliminateArmy(frontId: WotrFrontId): Promise<WotrBattleStory> {
    return {
      type: "battle",
      actions: await this.battleUi.eliminateArmy(frontId)
    };
  }

  async battleAdvance(): Promise<WotrBattleStory> {
    return {
      type: "battle",
      actions: await this.battleUi.battleAdvance()
    };
  }

  async wantContinueBattle(): Promise<WotrBattleStory> {
    return {
      type: "battle",
      actions: [await this.battleUi.wantContinueBattle()]
    };
  }
}

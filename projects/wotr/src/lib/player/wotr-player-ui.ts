import { inject, Injectable } from "@angular/core";
import { randomUtil } from "../../../../commons/utils/src";
import { rollActionDice } from "../action-die/wotr-action-die-actions";
import { WotrActionDie } from "../action-die/wotr-action-die-models";
import { WotrActionDieRules } from "../action-die/wotr-action-die-rules";
import { WotrActionDieUi } from "../action-die/wotr-action-die-ui";
import { WotrBattleUi } from "../battle/wotr-battle-ui";
import { WotrCombatDie } from "../battle/wotr-combat-die-models";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCardUi } from "../card/wotr-card-ui";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrFellowshipHandler } from "../fellowship/wotr-fellowship-handler";
import { WotrFellowshipRules } from "../fellowship/wotr-fellowship-rules";
import { WotrFellowshipUi } from "../fellowship/wotr-fellowship-ui";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameUi, WotrPlayerChoice } from "../game/wotr-game-ui";
import { WotrBattleStory, WotrGameStory, WotrReactionStory } from "../game/wotr-story-models";
import { allocateHuntDice, rollHuntDice } from "../hunt/wotr-hunt-actions";
import {
  WotrFellowshipCorruptionChoice,
  WotrHuntEffectChoiceParams
} from "../hunt/wotr-hunt-effect-choices";
import { WotrHuntStore } from "../hunt/wotr-hunt-store";
import { WotrHuntUi } from "../hunt/wotr-hunt-ui";
import { WotrPlayerStoryService } from "./wotr-player-story-service";

@Injectable({ providedIn: "root" })
export class WotrPlayerUi implements WotrPlayerStoryService {
  private ui = inject(WotrGameUi);
  private fellowshipHandler = inject(WotrFellowshipHandler);
  private fellowshipUi = inject(WotrFellowshipUi);
  private huntStore = inject(WotrHuntStore);
  private huntUi = inject(WotrHuntUi);
  private actionDieRules = inject(WotrActionDieRules);
  private actionDieUi = inject(WotrActionDieUi);
  private fellowshipCorruptionChoice = inject(WotrFellowshipCorruptionChoice);
  private cardUi = inject(WotrCardUi);
  private battleUi = inject(WotrBattleUi);

  private fellowshipRules = inject(WotrFellowshipRules);

  async firstPhase(frontId: WotrFrontId): Promise<WotrGameStory> {
    return this.cardUi.firstPhaseDrawCards(frontId);
  }

  async fellowshipPhase(): Promise<WotrGameStory> {
    return {
      type: "phase",
      actions: await this.fellowshipUi.fellowshipPhase()
    };
  }

  async huntAllocationPhase(): Promise<WotrGameStory> {
    const min = this.huntStore.minimumNumberOfHuntDice();
    const max = this.huntStore.maximumNumberOfHuntDice();
    const quantity = await this.ui.askQuantity(
      "How many hunt dice do you want to allocate?",
      min,
      max
    );
    return { type: "phase", actions: [allocateHuntDice(quantity)] };
  }

  async rollActionDice(frontId: WotrFrontId): Promise<WotrGameStory> {
    const nActionDice = this.actionDieRules.rollableActionDice(frontId);
    await this.ui.askContinue(`Roll ${nActionDice} action dice`);
    const actionDice: WotrActionDie[] = [];
    for (let i = 0; i < nActionDice; i++) {
      actionDice.push(this.actionDieRules.rollActionDie(frontId));
    }
    return { type: "phase", actions: [rollActionDice(...actionDice)] };
  }

  async actionResolution(frontId: WotrFrontId): Promise<WotrGameStory> {
    return this.actionDieUi.actionResolution(frontId);
  }

  async separateCompanions(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async rollHuntDice(): Promise<WotrGameStory> {
    await this.ui.askContinue("Roll hunt dice");
    const huntDice: WotrCombatDie[] = [];
    for (let i = 0; i < this.huntStore.nHuntDice(); i++) {
      huntDice.push(randomUtil.getRandomInteger(1, 7) as WotrCombatDie);
    }
    return { type: "hunt", actions: [rollHuntDice(...huntDice)] };
  }

  async reRollHuntDice(): Promise<WotrGameStory> {
    return { type: "hunt", actions: [await this.huntUi.reRollHuntDice()] };
  }

  async drawHuntTile(): Promise<WotrGameStory> {
    return { type: "hunt", actions: [await this.huntUi.drawHuntTile()] };
  }

  async huntEffect(damage: number): Promise<WotrGameStory> {
    // TODO
    const choices: WotrPlayerChoice<WotrHuntEffectChoiceParams>[] = [
      this.fellowshipCorruptionChoice
    ];
    const actions = await this.ui.askChoice(`Absorbe ${damage} hunt damage points`, choices, {
      damage
    });
    return { type: "hunt", actions };
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

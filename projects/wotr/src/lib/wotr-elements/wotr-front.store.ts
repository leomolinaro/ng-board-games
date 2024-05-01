import { Injectable, Signal, computed } from "@angular/core";
import { immutableUtil } from "@leobg/commons/utils";
import { WotrCardId, WotrCharacterCardId, WotrStrategyCardId, isCharacterCard, isStrategyCard } from "./wotr-card.models";
import { WotrActionDie, WotrActionToken } from "./wotr-dice.models";
import { WotrFront, WotrFrontId } from "./wotr-front.models";

export interface WotrFrontState {
  ids: WotrFrontId[];
  map: Record<WotrFrontId, WotrFront>;
}

@Injectable ()
export class WotrFrontStore {

  update!: (actionName: string, updater: (a: WotrFrontState) => WotrFrontState) => void;
  state!: Signal<WotrFrontState>;

  fronts = computed (() => { const s = this.state (); return s.ids.map (id => s.map[id]); });
  freePeopleFront = computed (() => this.state ().map["free-peoples"]);
  shadowFront = computed (() => this.state ().map.shadow);
  frontIds () { return this.state ().ids; }
  hasActionDice (frontId: WotrFrontId) { return !!this.state ().map[frontId].actionDice.length; }
  hasActionTokens (frontId: WotrFrontId) { return !!this.state ().map[frontId].actionTokens.length; }
  front (id: WotrFrontId, state: WotrFrontState) { return state.map[id]; }

  init (): WotrFrontState {
    return {
      ids: ["free-peoples", "shadow"],
      map: {
        "free-peoples": this.initFront ("free-peoples", "Free Peoples"),
        shadow: this.initFront ("shadow", "Shadow"),
      }
    };
  }
  
  private initFront (id: WotrFrontId, name: string): WotrFront {
    return {
      id, name,
      characterDeck: [],
      strategyDeck: [],
      handCards: [],
      tableCards: [],
      characterDiscardPile: [],
      strategyDiscardPile: [],
      actionDice: [],
      actionTokens: []
    };
  }

  private updateFront (actionName: string, frontId: WotrFrontId, updater: (a: WotrFront) => WotrFront) {
    this.update (actionName, s => ({ ...s, map: { ...s.map, [frontId]: updater (s.map[frontId]) } }));
  }
  
  setCharacterDeck (characterDeck: WotrCharacterCardId[], frontId: WotrFrontId) {
    this.updateFront ("setCharacterDeck", frontId, front => ({ ...front, characterDeck }));
  }
  
  setStrategyDeck (strategyDeck: WotrStrategyCardId[], frontId: WotrFrontId) {
    this.updateFront ("setStrategyDeck", frontId, front => ({ ...front, strategyDeck }));
  }

  discardCards (cardIds: WotrCardId[], frontId: WotrFrontId) {
    this.updateFront ("discardCards", frontId, front => {
      let characterDiscardPile = front.characterDiscardPile;
      let strategyDiscardPile = front.strategyDiscardPile;
      let handCards = front.handCards;
      for (const cardId of cardIds) {
        handCards = immutableUtil.listRemoveFirst (c => c === cardId, handCards);
        if (isCharacterCard (cardId)) { characterDiscardPile = immutableUtil.listPush ([cardId], characterDiscardPile); }
        if (isStrategyCard (cardId)) { strategyDiscardPile = immutableUtil.listPush ([cardId], strategyDiscardPile); }
      }
      return {
        ...front,
        handCards,
        characterDiscardPile,
        strategyDiscardPile
      };
    });
  }

  drawCards (cardIds: WotrCardId[], frontId: WotrFrontId) {
    this.updateFront ("drawCards", frontId, front => ({
      ...front,
      handCards: immutableUtil.listPush (cardIds, front.handCards)
    }));
  }

  setActionTokens (tokens: WotrActionToken[], frontId: WotrFrontId): void {
    this.updateFront ("setActionTokens", frontId, front => ({
      ...front,
      actionTokens: tokens
    }));
  }

  setActionDice (dice: WotrActionDie[], frontId: WotrFrontId): void {
    this.updateFront ("setActionDice", frontId, front => ({
      ...front,
      actionDice: dice
    }));
  }

  removeActionDie (die: WotrActionDie, frontId: WotrFrontId): void {
    this.updateFront ("removeActionDie", frontId, front => ({
      ...front,
      actionDice: immutableUtil.listRemoveFirst (d => d === die, front.actionDice)
    }));
  }

  removeAllEyeResults (frontId: WotrFrontId): void {
    this.updateFront ("removeAllEyeResults", frontId, front => ({
      ...front,
      actionDice: immutableUtil.listRemoveAll (d => d === "eye", front.actionDice)
    }));
  }


  removeActionToken (token: WotrActionToken, frontId: WotrFrontId): void {
    this.updateFront ("removeActionToken", frontId, front => ({
      ...front,
      actionTokens: immutableUtil.listRemoveFirst (t => t === token, front.actionTokens)
    }));
  }

  playCardOnTable (card: WotrCardId, frontId: WotrFrontId): void {
    this.updateFront ("playCardOnTable", frontId, front => ({
      ...front,
      tableCards: immutableUtil.listPush ([card], front.tableCards)
    }));
  }

  discardCardFromTable (card: WotrCardId, frontId: WotrFrontId): void {
    this.updateFront ("discardCardFromTable", frontId, front => ({
      ...front,
      tableCards: immutableUtil.listRemoveFirst (c => c === card, front.tableCards)
    }));
  }

}

import { Injectable } from "@angular/core";
import { immutableUtil } from "@leobg/commons/utils";
import { WotrCardId, WotrCharacterCardId, WotrStrategyCardId, isCharacterCard, isStrategyCard } from "./wotr-card.models";
import { WotrFront, WotrFrontId } from "./wotr-front.models";

export interface WotrFrontState {
  ids: WotrFrontId[];
  map: Record<WotrFrontId, WotrFront>;
}

@Injectable ({
  providedIn: "root"
})
export class WotrFrontStore {

  update!: (actionName: string, updater: (a: WotrFrontState) => WotrFrontState) => void;

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
      actionDice: []
    };
  }

  private updateFront (actionName: string, frontId: WotrFrontId, updater: (a: WotrFront) => WotrFront) {
    this.update (actionName, s => ({ ...s, map: { ...s.map, [frontId]: updater (s.map[frontId]) } }));
  }
  
  getFront (id: WotrFrontId, state: WotrFrontState) { return state.map[id]; }
  getFronts (state: WotrFrontState) { return state.ids.map (id => state.map[id]); }
  
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

}

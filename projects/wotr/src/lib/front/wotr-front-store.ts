import { Injectable, Signal, computed } from "@angular/core";
import { immutableUtil } from "@leobg/commons/utils";
import { WotrActionDie, WotrActionToken } from "../action-die/wotr-action-die-models";
import {
  WotrCardId,
  WotrCharacterCardId,
  WotrStrategyCardId,
  isCharacterCard,
  isStrategyCard
} from "../card/wotr-card-models";
import { WotrElvenRing, WotrFront, WotrFrontId } from "./wotr-front-models";

export interface WotrFrontState {
  ids: WotrFrontId[];
  map: Record<WotrFrontId, WotrFront>;
  currentCard: WotrCardId | null;
}

export function initialState(): WotrFrontState {
  return {
    ids: ["free-peoples", "shadow"],
    map: {
      "free-peoples": initialFront("free-peoples", "Free Peoples", ["vilya", "nenya", "narya"]),
      "shadow": initialFront("shadow", "Shadow", [])
    },
    currentCard: null
  };
}

function initialFront(id: WotrFrontId, name: string, elvenRings: WotrElvenRing[]): WotrFront {
  return {
    id,
    name,
    characterDeck: [],
    strategyDeck: [],
    handCards: [],
    tableCards: [],
    characterDiscardPile: [],
    strategyDiscardPile: [],
    actionDice: [],
    actionTokens: [],
    elvenRings,
    victoryPoints: 0
  };
}

@Injectable({ providedIn: "root" })
export class WotrFrontStore {
  update!: (actionName: string, updater: (a: WotrFrontState) => WotrFrontState) => void;
  state!: Signal<WotrFrontState>;

  fronts = computed(() => {
    const s = this.state();
    return s.ids.map(id => s.map[id]);
  });
  freePeoplesFront = computed(() => this.state().map["free-peoples"]);
  shadowFront = computed(() => this.state().map.shadow);
  frontIds() {
    return this.state().ids;
  }
  hasActionDice(frontId: WotrFrontId) {
    return !!this.front(frontId).actionDice.length;
  }
  nActionDice(frontId: WotrFrontId) {
    return this.front(frontId).actionDice.length;
  }
  hasActionTokens(frontId: WotrFrontId) {
    return !!this.front(frontId).actionTokens.length;
  }
  actionTokens(frontId: WotrFrontId) {
    return this.front(frontId).actionTokens;
  }
  front(id: WotrFrontId) {
    return this.state().map[id];
  }
  characterDeck(id: WotrFrontId) {
    return this.front(id).characterDeck;
  }
  strategyDeck(id: WotrFrontId) {
    return this.front(id).strategyDeck;
  }
  handCards(id: WotrFrontId) {
    return this.front(id).handCards;
  }
  hasTableCard(cardId: WotrCardId, frontId: WotrFrontId) {
    return !!this.front(frontId).tableCards.includes(cardId);
  }
  currentCard() {
    return this.state().currentCard;
  }

  private updateFront(
    actionName: string,
    frontId: WotrFrontId,
    updater: (a: WotrFront) => WotrFront
  ) {
    this.update(actionName, s => ({ ...s, map: { ...s.map, [frontId]: updater(s.map[frontId]) } }));
  }

  clearCurrentCard() {
    this.update("clearCurrentCard", s => ({ ...s, currentCard: null }));
  }

  setCurrentCard(currentCard: WotrCardId) {
    this.update("setCurrentCard", s => ({ ...s, currentCard }));
  }

  setCharacterDeck(characterDeck: WotrCharacterCardId[], frontId: WotrFrontId) {
    this.updateFront("setCharacterDeck", frontId, front => ({ ...front, characterDeck }));
  }

  setStrategyDeck(strategyDeck: WotrStrategyCardId[], frontId: WotrFrontId) {
    this.updateFront("setStrategyDeck", frontId, front => ({ ...front, strategyDeck }));
  }

  discardCards(cardIds: WotrCardId[], frontId: WotrFrontId) {
    this.updateFront("discardCards", frontId, front => {
      let characterDiscardPile = front.characterDiscardPile;
      let strategyDiscardPile = front.strategyDiscardPile;
      let handCards = front.handCards;
      for (const cardId of cardIds) {
        handCards = immutableUtil.listRemoveFirst(c => c === cardId, handCards);
        if (isCharacterCard(cardId)) {
          characterDiscardPile = immutableUtil.listPush([cardId], characterDiscardPile);
        }
        if (isStrategyCard(cardId)) {
          strategyDiscardPile = immutableUtil.listPush([cardId], strategyDiscardPile);
        }
      }
      return {
        ...front,
        handCards,
        characterDiscardPile,
        strategyDiscardPile
      };
    });
  }

  drawCards(cardIds: WotrCardId[], frontId: WotrFrontId) {
    this.updateFront("drawCards", frontId, front => {
      let characterDeck = front.characterDeck;
      let strategyDeck = front.strategyDeck;
      for (const cardId of cardIds) {
        if (isCharacterCard(cardId)) {
          characterDeck = immutableUtil.listRemoveFirst(c => c === cardId, characterDeck);
        } else if (isStrategyCard(cardId)) {
          strategyDeck = immutableUtil.listRemoveFirst(c => c === cardId, strategyDeck);
        }
      }
      return {
        ...front,
        characterDeck,
        strategyDeck,
        handCards: immutableUtil.listPush(cardIds, front.handCards)
      };
    });
  }

  setActionTokens(tokens: WotrActionToken[], frontId: WotrFrontId): void {
    this.updateFront("setActionTokens", frontId, front => ({
      ...front,
      actionTokens: tokens
    }));
  }

  setActionDice(dice: WotrActionDie[], frontId: WotrFrontId): void {
    this.updateFront("setActionDice", frontId, front => ({
      ...front,
      actionDice: dice
    }));
  }

  removeActionDie(die: WotrActionDie, frontId: WotrFrontId): void {
    this.updateFront("removeActionDie", frontId, front => ({
      ...front,
      actionDice: immutableUtil.listRemoveFirst(d => d === die, front.actionDice)
    }));
  }

  removeAllEyeResults(frontId: WotrFrontId): void {
    this.updateFront("removeAllEyeResults", frontId, front => ({
      ...front,
      actionDice: immutableUtil.listRemoveAll(d => d === "eye", front.actionDice)
    }));
  }

  removeActionToken(token: WotrActionToken, frontId: WotrFrontId): void {
    this.updateFront("removeActionToken", frontId, front => ({
      ...front,
      actionTokens: immutableUtil.listRemoveFirst(t => t === token, front.actionTokens)
    }));
  }

  playCardOnTable(card: WotrCardId, frontId: WotrFrontId): void {
    this.updateFront("playCardOnTable", frontId, front => ({
      ...front,
      tableCards: immutableUtil.listPush([card], front.tableCards)
    }));
  }

  discardCardFromTable(card: WotrCardId, frontId: WotrFrontId): void {
    this.updateFront("discardCardFromTable", frontId, front => ({
      ...front,
      tableCards: immutableUtil.listRemoveFirst(c => c === card, front.tableCards)
    }));
  }

  setVictoryPoints(victoryPoints: number, front: WotrFrontId) {
    this.updateFront("setVictoryPoints", front, f => ({ ...f, victoryPoints }));
  }
}

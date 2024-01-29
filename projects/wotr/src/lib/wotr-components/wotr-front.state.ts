import { WotrCharacterCardId, WotrStrategyCardId } from "./wotr-card.models";
import { WotrFront, WotrFrontId } from "./wotr-front.models";

export interface WotrFrontState {
  ids: WotrFrontId[];
  map: Record<WotrFrontId, WotrFront>;
}

export function initFrontState (): WotrFrontState {
  return {
    ids: ["free-peoples", "shadow"],
    map: {
      "free-peoples": initFront ("free-peoples", "Free Peoples"),
      shadow: initFront ("shadow", "Shadow"),
    }
  };
}

function initFront (
  id: WotrFrontId, name: string
): WotrFront {
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

export function getFront (id: WotrFrontId, state: WotrFrontState) { return state.map[id]; }
export function getFronts (state: WotrFrontState) { return state.ids.map (id => state.map[id]); }

export function setCharacterDeck (characterDeck: WotrCharacterCardId[], front: WotrFront) {
  return { ...front, characterDeck };
}

export function setStrategyDeck (strategyDeck: WotrStrategyCardId[], front: WotrFront) {
  return { ...front, strategyDeck };
}


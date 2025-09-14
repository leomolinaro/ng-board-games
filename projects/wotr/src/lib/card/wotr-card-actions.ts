import { WotrCardId, WotrCardLabel, labelToCardId } from "./wotr-card-models";

export type WotrCardAction =
  | WotrCardDraw
  | WotrCardDiscard
  | WotrCardPlayOnTable
  | WotrCardRandomDiscard
  | WotrCardDiscardFromTable;

function labelsToCardIds(labels: WotrCardLabel[]): WotrCardId[] {
  return labels.map(label => labelToCardId(label));
}
export interface WotrCardDraw {
  type: "card-draw";
  cards: WotrCardId[];
}
export function drawCards(...cards: WotrCardLabel[]): WotrCardDraw {
  return { type: "card-draw", cards: labelsToCardIds(cards) };
}
export function drawCardIds(...cards: WotrCardId[]): WotrCardDraw {
  return { type: "card-draw", cards };
}
export interface WotrCardDiscard {
  type: "card-discard";
  cards: WotrCardId[];
}
export function discardCards(...cards: WotrCardLabel[]): WotrCardDiscard {
  return { type: "card-discard", cards: labelsToCardIds(cards) };
}
export function discardCardIds(...cards: WotrCardId[]): WotrCardDiscard {
  return { type: "card-discard", cards };
}
export interface WotrCardPlayOnTable {
  type: "card-play-on-table";
  card: WotrCardId;
}
export function playCardOnTable(card: WotrCardLabel): WotrCardPlayOnTable {
  return { type: "card-play-on-table", card: labelToCardId(card) };
}
export interface WotrCardRandomDiscard {
  type: "card-random-discard";
  card: WotrCardId;
}
export function discardRandomCard(card: WotrCardLabel): WotrCardRandomDiscard {
  return { type: "card-random-discard", card: labelToCardId(card) };
}
export interface WotrCardDiscardFromTable {
  type: "card-discard-from-table";
  card: WotrCardId;
}
export function discardCardFromTable(card: WotrCardLabel): WotrCardDiscardFromTable {
  return discardCardFromTableById(labelToCardId(card));
}

export function discardCardFromTableById(card: WotrCardId): WotrCardDiscardFromTable {
  return { type: "card-discard-from-table", card };
}

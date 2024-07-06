import { WotrCardId, WotrCardLabel, labelToCardId } from "./wotr-card.models";

export type WotrCardAction = WotrCardDraw | /* WotrCardDiscard | */ WotrCardPlayOnTable | WotrCardRandomDiscard | WotrCardDiscardFromTable;

function labelsToCardIds (labels: WotrCardLabel[]): WotrCardId[] { return labels.map (label => labelToCardId (label)); }
export interface WotrCardDraw { type: "card-draw"; cards: WotrCardId[]; discarded?: WotrCardId[] }
export function drawCards (card1: WotrCardLabel): WotrCardDraw;
export function drawCards (card1: WotrCardLabel, card2: WotrCardLabel): WotrCardDraw;
export function drawCards (card1: WotrCardLabel, discarded: WotrCardDiscard): WotrCardDraw;
export function drawCards (card1: WotrCardLabel, card2: WotrCardLabel, discarded: WotrCardDiscard): WotrCardDraw;
export function drawCards (...args: (WotrCardLabel | WotrCardDiscard)[]): WotrCardDraw {
  const drawCardAction: WotrCardDraw = { type: "card-draw", cards: [] };
  for (const arg of args) {
    if (typeof arg === "string") {
      drawCardAction.cards.push (labelToCardId (arg));
    } else {
      drawCardAction.discarded = arg.cards;
    }
  }
  return drawCardAction;
}

export interface WotrCardDiscard { /* type: "card-discard"; */ cards: WotrCardId[] }
export function discardCards (...cards: WotrCardLabel[]): WotrCardDiscard { return { /* type: "card-discard", */ cards: labelsToCardIds (cards) }; }
export interface WotrCardPlayOnTable { type: "card-play-on-table"; card: WotrCardId }
export function playCardOnTable (card: WotrCardLabel): WotrCardPlayOnTable { return { type: "card-play-on-table", card: labelToCardId (card) }; }
export interface WotrCardRandomDiscard { type: "card-random-discard"; card: WotrCardId }
export function discardRandomCard (card: WotrCardLabel): WotrCardRandomDiscard { return { type: "card-random-discard", card: labelToCardId (card) }; }
export interface WotrCardDiscardFromTable { type: "card-discard-from-table"; card: WotrCardId }
export function discardCardFromTable (card: WotrCardLabel): WotrCardDiscardFromTable { return { type: "card-discard-from-table", card: labelToCardId (card) }; }

import { WotrCardId, WotrCardLabel, labelToCardId } from "../wotr-elements/wotr-card.models";

export type WotrCardAction = WotrCardDraw | WotrCardDiscard | WotrCardPlayOnTable | WotrCardRandomDiscard | WotrCardDiscardFromTable;

function labelsToCards (labels: WotrCardLabel[]): WotrCardId[] { return labels.map (label => labelToCardId (label)); }
export interface WotrCardDraw { type: "card-draw"; cards: WotrCardId[] }
export function drawCards (...cards: WotrCardLabel[]): WotrCardDraw { return { type: "card-draw", cards: labelsToCards (cards) }; }
export interface WotrCardDiscard { type: "card-discard"; cards: WotrCardId[] }
export function discardCards (...cards: WotrCardLabel[]): WotrCardDiscard { return { type: "card-discard", cards: labelsToCards (cards) }; }
export interface WotrCardPlayOnTable { type: "card-play-on-table"; cards: WotrCardId[] }
export function playCardOnTable (...cards: WotrCardLabel[]): WotrCardPlayOnTable { return { type: "card-play-on-table", cards: labelsToCards (cards) }; }
export interface WotrCardRandomDiscard { type: "card-random-discard"; cards: WotrCardId[] }
export function discardRandomCards (...cards: WotrCardLabel[]): WotrCardRandomDiscard { return { type: "card-random-discard", cards: labelsToCards (cards) }; }
export interface WotrCardDiscardFromTable { type: "card-discard-from-table"; cards: WotrCardId[] }
export function discardCardFromTable (...cards: WotrCardLabel[]): WotrCardDiscardFromTable { return { type: "card-discard-from-table", cards: labelsToCards (cards) }; }

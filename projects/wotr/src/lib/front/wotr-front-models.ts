import { WotrActionDie, WotrActionToken } from "../action-die/wotr-action-die-models";
import { WotrCardId, WotrCharacterCardId, WotrStrategyCardId } from "../card/wotr-card-models";

export type WotrFrontId = "free-peoples" | "shadow";
export type WotrElvenRing = "vilya" | "nenya" | "narya";

export interface WotrFront {
  id: WotrFrontId;
  name: string;
  handCards: WotrCardId[];
  tableCards: WotrCardId[];
  characterDeck: WotrCharacterCardId[];
  strategyDeck: WotrStrategyCardId[];
  characterDiscardPile: WotrCharacterCardId[];
  strategyDiscardPile: WotrStrategyCardId[];
  actionDice: WotrActionDie[];
  actionTokens: WotrActionToken[];
  elvenRings: WotrElvenRing[];
  elvenRingUsed: boolean;
  victoryPoints: number;
}

export function oppositeFront(front: WotrFrontId): WotrFrontId {
  switch (front) {
    case "free-peoples":
      return "shadow";
    case "shadow":
      return "free-peoples";
  }
}

export function elvenRingLabel(ring: WotrElvenRing): string {
  switch (ring) {
    case "vilya":
      return "Vilya";
    case "nenya":
      return "Nenya";
    case "narya":
      return "Narya";
  }
}

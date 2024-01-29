import { WotrCardId, WotrCharacterCardId, WotrStrategyCardId } from "./wotr-card.models";
import { WotrActionDie } from "./wotr-dice.models";

export type WotrFrontId = "free-peoples" | "shadow";

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
}

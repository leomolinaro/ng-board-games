import { Injectable, inject } from "@angular/core";
import { immutableUtil } from "@leobg/commons/utils";
import { isCharacterCard, isStrategyCard } from "../wotr-elements/wotr-card.models";
import { WotrGameStateService } from "../wotr-elements/wotr-game-state.service";
import { WotrActionApplier } from "./wotr-action-applier";
import { WotrCardAction } from "./wotr-card-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrCardActionsService {

  private g = inject (WotrGameStateService);

  getActionAppliers (): Record<WotrCardAction["type"], WotrActionApplier<WotrCardAction>> {
    return {
      "card-discard": (action, front, state) => this.g.updateFront (front, f => {
        let characterDiscardPile = f.characterDiscardPile;
        let strategyDiscardPile = f.strategyDiscardPile;
        let handCards = f.handCards;
        for (const card of action.cards) {
          handCards = immutableUtil.listRemoveFirst (c => c === card, handCards);
          if (isCharacterCard (card)) { characterDiscardPile = immutableUtil.listPush ([card], characterDiscardPile); }
          if (isStrategyCard (card)) { strategyDiscardPile = immutableUtil.listPush ([card], strategyDiscardPile); }
        }
        return {
          ...f,
          handCards,
          characterDiscardPile,
          strategyDiscardPile
        };
      }, state),
      "card-discard-from-table": (action, front, state) => state,
      "card-draw": (action, front, state) => this.g.updateFront (front, f => ({
        ...f,
        handCards: immutableUtil.listPush (action.cards, f.handCards)
      }), state),
      "card-play-on-table": (action, front, state) => state,
      "card-random-discard": (action, front, state) => state,
    };
  }

}

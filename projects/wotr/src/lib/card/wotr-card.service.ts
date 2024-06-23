import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { oppositeFront } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrCardAction } from "./wotr-card-actions";
import { WotrCardId, cardToLabel } from "./wotr-card.models";

@Injectable ()
export class WotrCardService {
  
  private actionService = inject (WotrActionService);
  private frontStore = inject (WotrFrontStore);
  
  init () {
    this.actionService.registerActions (this.getActionAppliers () as any);
    this.actionService.registerActionLoggers (this.getActionLoggers () as any);
  }

  getActionAppliers (): WotrActionApplierMap<WotrCardAction> {
    return {
      "card-discard": async (action, front) => this.frontStore.discardCards (action.cards, front),
      "card-discard-from-table": async (action, front) => this.frontStore.discardCardFromTable (action.card, front),
      "card-draw": async (action, front) => this.frontStore.drawCards (action.cards, front),
      "card-play-on-table": async (action, front) => this.frontStore.playCardOnTable (action.card, front),
      "card-random-discard": async (action, front) => this.frontStore.discardCards ([action.card], oppositeFront (front)),
    };
  }

  getActionLoggers (): WotrActionLoggerMap<WotrCardAction> {
    return {
      "card-discard": (action, front, f) => [f.player (front), ` discards ${this.nCards (action.cards)}`],
      "card-discard-from-table": (action, front, f) => [f.player (front), ` discards "${cardToLabel (action.card)}" from table`],
      "card-draw": (action, front, f) => [f.player (front), ` draws ${this.nCards (action.cards)}`],
      "card-play-on-table": (action, front, f) => [f.player (front), ` plays "${cardToLabel (action.card)}" on table`],
      "card-random-discard": (action, front, f) => [f.player (front), " random discards 1 card from ", f.player (oppositeFront (front)), " hand"],
    };
  }

  private nCards (cards: WotrCardId[]) {
    return `${cards.length} ${cards.length === 1 ? "card" : "cards"}`;
  }

}

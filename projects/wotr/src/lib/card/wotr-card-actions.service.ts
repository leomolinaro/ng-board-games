import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { oppositeFront } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrCardAction } from "./wotr-card-actions";

@Injectable ()
export class WotrCardActionsService {
  
  constructor () {
    this.actionService.registerActions (this.getActionAppliers () as any);
  }

  private actionService = inject (WotrActionService);
  private frontStore = inject (WotrFrontStore);

  getActionAppliers (): WotrActionApplierMap<WotrCardAction> {
    return {
      "card-discard": async (action, front) => this.frontStore.discardCards (action.cards, front),
      "card-discard-from-table": async (action, front) => this.frontStore.discardCardFromTable (action.card, front),
      "card-draw": async (action, front) => this.frontStore.drawCards (action.cards, front),
      "card-play-on-table": async (action, front) => this.frontStore.playCardOnTable (action.card, front),
      "card-random-discard": async (action, front) => this.frontStore.discardCards ([action.card], oppositeFront (front)),
    };
  }

}

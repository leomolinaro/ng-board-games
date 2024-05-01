import { Injectable, inject } from "@angular/core";
import { oppositeFront } from "../wotr-elements/wotr-front.models";
import { WotrFrontStore } from "../wotr-elements/wotr-front.store";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrCardAction } from "./wotr-card-actions";

@Injectable ()
export class WotrCardActionsService {

  private frontStore = inject (WotrFrontStore);

  getActionAppliers (): WotrActionApplierMap<WotrCardAction> {
    return {
      "card-discard": (action, front) => this.frontStore.discardCards (action.cards, front),
      "card-discard-from-table": (action, front) => this.frontStore.discardCardFromTable (action.card, front),
      "card-draw": (action, front) => this.frontStore.drawCards (action.cards, front),
      "card-play-on-table": (action, front) => this.frontStore.playCardOnTable (action.card, front),
      "card-random-discard": (action, front) => this.frontStore.discardCards ([action.card], oppositeFront (front)),
    };
  }

}

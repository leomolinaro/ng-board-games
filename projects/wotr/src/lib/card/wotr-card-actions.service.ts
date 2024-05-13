import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { oppositeFront } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrCardAction } from "./wotr-card-actions";

@Injectable ({
  providedIn: "root"
})
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

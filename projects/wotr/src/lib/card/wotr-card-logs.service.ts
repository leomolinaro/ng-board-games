import { Injectable } from "@angular/core";
import { WotrActionLoggerMap } from "../commons/wotr-action-log";
import { oppositeFront } from "../front/wotr-front.models";
import { WotrCardAction } from "./wotr-card-actions";
import { WotrCardId, cardToLabel } from "./wotr-card.models";

@Injectable ({
  providedIn: "root",
})
export class WotrCardLogsService {

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

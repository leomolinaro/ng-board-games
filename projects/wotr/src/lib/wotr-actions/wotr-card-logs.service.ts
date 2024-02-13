import { Injectable } from "@angular/core";
import { WotrCardId } from "../wotr-elements/wotr-card.models";
import { WotrActionLoggerMap } from "./wotr-action-log";
import { WotrCardAction } from "./wotr-card-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrCardLogsService {

  getActionLoggers (): WotrActionLoggerMap<WotrCardAction> {
    return {
      "card-discard": (action, front, f) => [f.player (front), f.string (` discards ${this.nCards (action.cards)}`)],
      "card-discard-from-table": (action, front, f) => [f.player (front), f.string (` discards ${this.nCards (action.cards)} from table`)],
      "card-draw": (action, front, f) => [f.player (front), f.string (` draws ${this.nCards (action.cards)}`)],
      "card-play-on-table": (action, front, f) => [f.player (front), f.string (` plays ${this.nCards (action.cards)} on table`)],
      "card-random-discard": (action, front, f) => [f.player (front), f.string (` discards ${this.nCards (action.cards)}`)],
    };
  }

  private nCards (cards: WotrCardId[]) {
    return `${cards.length} ${cards.length === 1 ? "card" : "cards"}`;
  }

}

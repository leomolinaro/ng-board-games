import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFrontId, oppositeFront } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrLogWriter } from "../log/wotr-log-writer";
import { WotrFreePeoplesPlayer } from "../player/wotr-free-peoples-player";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrCards } from "./cards/wotr-cards";
import { WotrCardAction, WotrCardDiscardFromTable, drawCardIds } from "./wotr-card-actions";
import { WotrCardId, cardToLabel, isFreePeoplesCard } from "./wotr-card-models";

@Injectable({ providedIn: "root" })
export class WotrCardHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private frontStore = inject(WotrFrontStore);
  private logger = inject(WotrLogWriter);
  private q = inject(WotrGameQuery);
  private cards = inject(WotrCards);

  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);

  init() {
    this.actionRegistry.registerActions(this.getActionAppliers() as any);
    this.actionRegistry.registerActionLoggers(this.getActionLoggers() as any);
    this.actionRegistry.registerEffectLogger<WotrCardDiscardFromTable>(
      "card-discard-from-table",
      (effect, f) => [
        f.player(isFreePeoplesCard(effect.card) ? "shadow" : "free-peoples"),
        ` discards "${cardToLabel(effect.card)}" from table`
      ]
    );
  }

  getActionAppliers(): WotrActionApplierMap<WotrCardAction> {
    return {
      "card-discard": (action, front) => this.frontStore.discardCards(action.cards, front),
      "card-discard-from-table": (action, front) => this.discardCardFromTable(action.card, front),
      "card-draw": (action, front) => this.drawCards(action.cards, front),
      "card-play-on-table": (action, front) => this.playCardOnTable(action.card, front),
      "card-play": (action, front) => this.frontStore.discardCards([action.card], front),
      "card-random-discard": (action, front) =>
        this.frontStore.discardCards([action.card], oppositeFront(front))
    };
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrCardAction> {
    return {
      "card-discard": (action, front, f) => [
        f.player(front),
        ` discards ${this.nCards(action.cards)}`
      ],
      "card-discard-from-table": (action, front, f) => [
        f.player(front),
        ` discards "${cardToLabel(action.card)}" from table`
      ],
      "card-draw": (action, front, f) => [f.player(front), ` draws ${this.nCards(action.cards)}`],
      "card-play-on-table": (action, front, f) => [
        f.player(front),
        ` plays "${cardToLabel(action.card)}" on table`
      ],
      "card-play": (action, front, f) => [f.player(front), ` plays "${cardToLabel(action.card)}"`],
      "card-random-discard": (action, front, f) => [
        f.player(front),
        " random discards 1 card from ",
        f.player(oppositeFront(front)),
        " hand"
      ]
    };
  }

  private nCards(cards: WotrCardId[]) {
    return `${cards.length} ${cards.length === 1 ? "card" : "cards"}`;
  }

  private async drawCards(cards: WotrCardId[], frontId: WotrFrontId) {
    this.frontStore.drawCards(cards, frontId);
    if (this.q.front(frontId).hasExcessCards()) {
      if (this.frontStore.shouldSkipDiscardExcessCards()) return;
      if (frontId === "free-peoples") {
        await this.freePeoples.discardExcessCards();
      } else {
        await this.shadow.discardExcessCards();
      }
    }
  }

  private discardCardFromTable(cardId: WotrCardId, front: WotrFrontId) {
    this.frontStore.discardCardFromTable(cardId, front);
    this.cards.deactivateAbilities(cardId);
    // this.logger.logEffect(discardCardFromTable(cardToLabel(cardId)));
  }

  async drawCard(cardId: WotrCardId, frontId: WotrFrontId) {
    await this.drawCards([cardId], frontId);
    this.logger.logEffect(drawCardIds(cardId));
  }

  playCardOnTable(card: WotrCardId, front: WotrFrontId): void {
    this.frontStore.playCardOnTable(card, front);
    this.cards.activateAbilities(card);
  }
}

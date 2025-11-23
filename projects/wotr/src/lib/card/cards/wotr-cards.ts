import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrFrontId } from "../../front/wotr-front-models";
import { WotrStory } from "../../game/wotr-story-models";
import {
  isFreePeopleCharacterCard,
  isFreePeopleStrategyCard,
  isShadowCharacterCard,
  WotrCardId
} from "../wotr-card-models";
import { WotrFreePeoplesCharacterCards } from "./wotr-free-peoples-character-cards";
import { WotrFreePeoplesStrategyCards } from "./wotr-free-peoples-strategy-cards";
import { WotrShadowCharacterCards } from "./wotr-shadow-character-cards";
import { WotrShadowStrategyCards } from "./wotr-shadow-strategy-cards";

export interface WotrEventCard {
  canBePlayed?: () => boolean;
  play: () => Promise<WotrAction[]>;
  effect?: (params: WotrCardParams) => Promise<void>;
}

export interface WotrCardParams {
  front: WotrFrontId;
  story: WotrStory & { actions: WotrAction[] };
  // shadow: WotrCombatFront;
  // freePeoples: WotrCombatFront;
  // combatRound: WotrCombatRound;
  cardId: WotrCardId;
  // isAttacker: boolean;
}

@Injectable({ providedIn: "root" })
export class WotrCards {
  private cards: Partial<Record<WotrCardId, WotrEventCard>> = {};

  private freePeopleCharacterCards = inject(WotrFreePeoplesCharacterCards);
  private freePeopleStrategyCards = inject(WotrFreePeoplesStrategyCards);
  private shadowCharacterCards = inject(WotrShadowCharacterCards);
  private shadowStrategyCards = inject(WotrShadowStrategyCards);

  getCard(cardId: WotrCardId): WotrEventCard {
    if (!this.cards[cardId]) {
      this.cards[cardId] = this.createCard(cardId);
    }
    return this.cards[cardId];
  }

  private createCard(cardId: WotrCardId): WotrEventCard {
    if (isFreePeopleCharacterCard(cardId)) {
      return this.freePeopleCharacterCards.createCard(cardId);
    } else if (isFreePeopleStrategyCard(cardId)) {
      return this.freePeopleStrategyCards.createCard(cardId);
    } else if (isShadowCharacterCard(cardId)) {
      return this.shadowCharacterCards.createCard(cardId);
    } else {
      return this.shadowStrategyCards.createCard(cardId);
    }
  }
}

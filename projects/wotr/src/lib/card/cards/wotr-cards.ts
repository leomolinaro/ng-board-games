import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../../commons/wotr-action-models";
import {
  isFreePeopleCharacterCard,
  isFreePeopleStrategyCard,
  isShadowCharacterCard,
  WotrCardId
} from "../wotr-card-models";
import { WotrFreePeoplesCharacterCards } from "./wotr-free-peoples-character-cards";

export interface WotrEventCard {
  canBePlayed?: () => boolean;
  play: () => Promise<WotrAction[]>;
}

@Injectable({ providedIn: "root" })
export class WotrCards {
  private cards: Partial<Record<WotrCardId, WotrEventCard>> = {};

  private freePeopleCharacterCards = inject(WotrFreePeoplesCharacterCards);
  // private freePeopleStrategyCards = inject(WotrFreePeoplesStrategyCards);
  // private shadowCharacterCards = inject(WotrShadowCharacterCards);
  // private shadowStrategyCards = inject(WotrShadowStrategyCards);

  // private characterStore = inject(WotrCharacterStore);
  // private regionStore = inject(WotrRegionStore);
  // private battleModifiers = inject(WotrBattleModifiers);
  // private nationStore = inject(WotrNationStore);
  // private actionDieModifiers = inject(WotrActionDieModifiers);
  // private frontStore = inject(WotrFrontStore);
  // private fellowshipStore = inject(WotrFellowshipStore);
  // private unitModifiers = inject(WotrUnitModifiers);
  // private gameUi = inject(WotrGameUi);
  // private unitUi = inject(WotrUnitUi);
  // private characterModifiers = inject(WotrCharacterModifiers);
  // private battleStore = inject(WotrBattleStore);
  // private nationHandler = inject(WotrNationHandler);
  // private shadow = inject(WotrShadowPlayer);

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
      // return this.freePeopleStrategyCards.createCard(cardId);
    } else if (isShadowCharacterCard(cardId)) {
      // return this.shadowCharacterCards.createCard(cardId);
    } else {
      // return this.shadowStrategyCards.createCard(cardId);
    }
    return {
      canBePlayed: () => false,
      play: async () => []
    };
    throw new Error(`Card not found: ${cardId}`);
  }
}

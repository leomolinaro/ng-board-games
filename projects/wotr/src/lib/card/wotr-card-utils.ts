/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Injectable } from "@angular/core";
import { WotrGameOptions } from "../game/options/wotr-game-options";
import {
  WotrCardNumber,
  WotrFreePeoplesCharacterCardId,
  WotrFreePeoplesStrategyCardId,
  WotrShadowCharacterCardId,
  WotrShadowStrategyCardId
} from "./wotr-card-models";

interface ExpansionCards {
  fpchaReplacements: Partial<
    Record<WotrFreePeoplesCharacterCardId, WotrFreePeoplesCharacterCardId>
  >;
  fpchaAdditions: WotrFreePeoplesCharacterCardId[];
  fpstrReplacements: Partial<Record<WotrFreePeoplesStrategyCardId, WotrFreePeoplesStrategyCardId>>;
  fpstrAdditions: WotrFreePeoplesStrategyCardId[];
  schaReplacements: Partial<Record<WotrShadowCharacterCardId, WotrShadowCharacterCardId>>;
  schaAdditions: WotrShadowCharacterCardId[];
  sstrReplacements: Partial<Record<WotrShadowStrategyCardId, WotrShadowStrategyCardId>>;
  sstrAdditions: WotrShadowStrategyCardId[];
}

export interface WotrCardDecks {
  freePeoplesCharacterCardIds: WotrFreePeoplesCharacterCardId[];
  freePeoplesStrategyCardIds: WotrFreePeoplesStrategyCardId[];
  shadowCharacterCardIds: WotrShadowCharacterCardId[];
  shadowStrategyCardIds: WotrShadowStrategyCardId[];
}

@Injectable()
export class WotrCardUtils {
  private _komeExpansionCards: ExpansionCards | null = null;
  private get komeExpansionCards(): ExpansionCards {
    if (!this._komeExpansionCards) {
      this._komeExpansionCards = {
        fpchaReplacements: {
          fpcha23: "fpcha23km"
        },
        fpchaAdditions: ["fpcha25km", "fpcha26km"],
        fpstrReplacements: {
          fpstr08: "fpstr08km",
          fpstr16: "fpstr16km",
          fpstr19: "fpstr19km",
          fpstr22: "fpstr22km",
          fpstr24: "fpstr24km"
        },
        fpstrAdditions: ["fpstr25km", "fpstr26km"],
        schaReplacements: {},
        schaAdditions: ["scha25km", "scha26km"],
        sstrReplacements: {
          sstr01: "sstr01km",
          sstr03: "sstr03km",
          sstr05: "sstr05km",
          sstr06: "sstr06km",
          sstr18: "sstr18km"
        },
        sstrAdditions: ["sstr25km", "sstr26km"]
      };
    }
    return this._komeExpansionCards;
  }

  private readonly BASE_CARD_NUMBERS: WotrCardNumber[] = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24"
  ];

  private getGameExpansionCards(options: WotrGameOptions): ExpansionCards {
    const expansions = options.expansions;
    const expansionCards: ExpansionCards[] = [];
    if (expansions.includes("kome")) expansionCards.push(this.komeExpansionCards);
    const gameExpansionCards: ExpansionCards = {
      fpchaReplacements: {},
      fpchaAdditions: [],
      fpstrReplacements: {},
      fpstrAdditions: [],
      schaReplacements: {},
      schaAdditions: [],
      sstrReplacements: {},
      sstrAdditions: []
    };
    for (const expansionCard of expansionCards) {
      Object.assign(gameExpansionCards.fpchaReplacements, expansionCard.fpchaReplacements);
      gameExpansionCards.fpchaAdditions.push(...expansionCard.fpchaAdditions);
      Object.assign(gameExpansionCards.fpstrReplacements, expansionCard.fpstrReplacements);
      gameExpansionCards.fpstrAdditions.push(...expansionCard.fpstrAdditions);
      Object.assign(gameExpansionCards.schaReplacements, expansionCard.schaReplacements);
      gameExpansionCards.schaAdditions.push(...expansionCard.schaAdditions);
      Object.assign(gameExpansionCards.sstrReplacements, expansionCard.sstrReplacements);
      gameExpansionCards.sstrAdditions.push(...expansionCard.sstrAdditions);
    }
    return gameExpansionCards;
  }

  getCardDecks(options: WotrGameOptions): WotrCardDecks {
    const expansionCards = this.getGameExpansionCards(options);
    const fpchaCardIds: WotrFreePeoplesCharacterCardId[] = [];
    const fpstrCardIds: WotrFreePeoplesStrategyCardId[] = [];
    const schaCardIds: WotrShadowCharacterCardId[] = [];
    const sstrCardIds: WotrShadowStrategyCardId[] = [];
    for (const cardNumber of this.BASE_CARD_NUMBERS) {
      let fpChaCardId = `fpcha${cardNumber}` as WotrFreePeoplesCharacterCardId;
      fpChaCardId = expansionCards.fpchaReplacements[fpChaCardId] || fpChaCardId;
      fpchaCardIds.push(fpChaCardId);
      let fpStrCardId = `fpstr${cardNumber}` as WotrFreePeoplesStrategyCardId;
      fpStrCardId = expansionCards.fpstrReplacements[fpStrCardId] || fpStrCardId;
      fpstrCardIds.push(fpStrCardId);
      let sChaCardId = `scha${cardNumber}` as WotrShadowCharacterCardId;
      sChaCardId = expansionCards.schaReplacements[sChaCardId] || sChaCardId;
      schaCardIds.push(sChaCardId);
      let sStrCardId = `sstr${cardNumber}` as WotrShadowStrategyCardId;
      sStrCardId = expansionCards.sstrReplacements[sStrCardId] || sStrCardId;
      sstrCardIds.push(sStrCardId);
    }
    for (const addition of expansionCards.fpchaAdditions) fpchaCardIds.push(addition);
    for (const addition of expansionCards.fpstrAdditions) fpstrCardIds.push(addition);
    for (const addition of expansionCards.schaAdditions) schaCardIds.push(addition);
    for (const addition of expansionCards.sstrAdditions) sstrCardIds.push(addition);
    return {
      freePeoplesCharacterCardIds: fpchaCardIds,
      freePeoplesStrategyCardIds: fpstrCardIds,
      shadowCharacterCardIds: schaCardIds,
      shadowStrategyCardIds: sstrCardIds
    };
  }
}

import { Injectable } from "@angular/core";
import { WotrCardNumber, WotrFreePeopleCharacterCardId, WotrFreePeopleStrategyCardId, WotrShadowCharacterCardId, WotrShadowStrategyCardId } from "./wotr-card.models";

@Injectable ({
  providedIn: "root",
})
export class WotrCardService {

  private readonly CARD_NUMBERS: WotrCardNumber[] = [
    "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23", "24"
  ];
  private readonly FP_CHARACTER_CARD_IDS: WotrFreePeopleCharacterCardId[] = this.CARD_NUMBERS.map (n => `fpcha${n}` as WotrFreePeopleCharacterCardId);
  getAllFreePeoplesCharacterCardIds () { return this.FP_CHARACTER_CARD_IDS; }
  private readonly FP_STRATEGY_CARD_IDS: WotrFreePeopleStrategyCardId[] = this.CARD_NUMBERS.map (n => `fpstr${n}` as WotrFreePeopleStrategyCardId);
  getAllFreePeoplesStrategyCardIds () { return this.FP_STRATEGY_CARD_IDS; }
  private readonly S_CHARACTER_CARD_IDS: WotrShadowCharacterCardId[] = this.CARD_NUMBERS.map (n => `scha${n}` as WotrShadowCharacterCardId);
  getAllShadowCharacterCardIds () { return this.S_CHARACTER_CARD_IDS; }
  private readonly S_STRATEGY_CARD_IDS: WotrShadowStrategyCardId[] = this.CARD_NUMBERS.map (n => `sstr${n}` as WotrShadowStrategyCardId);
  getAllShadowStrategyCardIds () { return this.S_STRATEGY_CARD_IDS; }

}

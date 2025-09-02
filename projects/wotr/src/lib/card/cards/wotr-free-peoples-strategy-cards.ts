import { inject, Injectable } from "@angular/core";
import { WotrCharacterRules } from "../../character/wotr-character-rules";
import { WotrCharacterStore } from "../../character/wotr-character-store";
import { WotrFellowshipStore } from "../../fellowship/wotr-fellowship-store";
import { WotrFrontStore } from "../../front/wotr-front-store";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrNationStore } from "../../nation/wotr-nation-store";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { WotrCardDrawUi } from "../wotr-card-draw-ui";
import { WotrFreePeopleStrategyCardId } from "../wotr-card-models";
import { WotrEventCard } from "./wotr-cards";

@Injectable({ providedIn: "root" })
export class WotrFreePeoplesStrategyCards {
  private characterStore = inject(WotrCharacterStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);
  private gameUi = inject(WotrGameUi);
  private cardDrawUi = inject(WotrCardDrawUi);
  private frontStore = inject(WotrFrontStore);
  private characterRules = inject(WotrCharacterRules);

  createCard(cardId: WotrFreePeopleStrategyCardId): WotrEventCard {
    switch (cardId) {
      case "fpstr01":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr02":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr03":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr04":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr05":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr06":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr07":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr08":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr09":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr10":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr11":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr12":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr13":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr14":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr15":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr16":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr17":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr18":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr19":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr20":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr21":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr22":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr23":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "fpstr24":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
    }
  }
}

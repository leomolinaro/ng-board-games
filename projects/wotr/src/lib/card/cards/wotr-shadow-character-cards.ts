import { inject, Injectable } from "@angular/core";
import { WotrCharacterRules } from "../../character/wotr-character-rules";
import { WotrCharacterStore } from "../../character/wotr-character-store";
import { WotrFellowshipStore } from "../../fellowship/wotr-fellowship-store";
import { WotrFrontStore } from "../../front/wotr-front-store";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrNationStore } from "../../nation/wotr-nation-store";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { WotrCardDrawUi } from "../wotr-card-draw-ui";
import { WotrShadowCharacterCardId } from "../wotr-card-models";
import { WotrEventCard } from "./wotr-cards";

@Injectable({ providedIn: "root" })
export class WotrShadowCharacterCards {
  private characterStore = inject(WotrCharacterStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);
  private gameUi = inject(WotrGameUi);
  private cardDrawUi = inject(WotrCardDrawUi);
  private frontStore = inject(WotrFrontStore);
  private characterRules = inject(WotrCharacterRules);

  createCard(cardId: WotrShadowCharacterCardId): WotrEventCard {
    switch (cardId) {
      case "scha01":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha02":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha03":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha04":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha05":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha06":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha07":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha08":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha09":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha10":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha11":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha12":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha13":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha14":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha15":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha16":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha17":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha18":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha19":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha20":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha21":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha22":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha23":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
      case "scha24":
        return {
          canBePlayed: () => false,
          play: async () => []
        };
    }
  }
}

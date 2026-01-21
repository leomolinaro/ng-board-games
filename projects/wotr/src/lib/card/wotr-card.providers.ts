import { Provider } from "@angular/core";
import { WotrCards } from "./cards/wotr-cards";
import { WotrFreePeoplesCharacterCards } from "./cards/wotr-free-peoples-character-cards";
import { WotrFreePeoplesStrategyCards } from "./cards/wotr-free-peoples-strategy-cards";
import { WotrShadowCharacterCards } from "./cards/wotr-shadow-character-cards";
import { WotrShadowStrategyCards } from "./cards/wotr-shadow-strategy-cards";
import { WotrCardDrawUi } from "./wotr-card-draw-ui";
import { WotrCardHandler } from "./wotr-card-handler";
import { WotrCardPlayUi } from "./wotr-card-play-ui";
import { WotrCardStoryHandler } from "./wotr-card-story-handler";
import { WotrCardUtils } from "./wotr-card-utils";

export const cardProviders: Provider[] = [
  WotrCardDrawUi,
  WotrCardHandler,
  WotrCardPlayUi,
  WotrCardStoryHandler,
  WotrCardUtils,
  WotrCards,
  WotrFreePeoplesCharacterCards,
  WotrFreePeoplesStrategyCards,
  WotrShadowCharacterCards,
  WotrShadowStrategyCards
];

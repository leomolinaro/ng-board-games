import { Provider } from "@angular/core";
import { WotrNationHandler } from "./wotr-nation-handler";
import { WotrNationModifiers } from "./wotr-nation-modifiers";
import { WotrNationRules } from "./wotr-nation-rules";
import { WotrNationStore } from "./wotr-nation-store";
import { WotrNationUi } from "./wotr-nation-ui";

export const nationProviders: Provider[] = [
  WotrNationHandler,
  WotrNationModifiers,
  WotrNationRules,
  WotrNationStore,
  WotrNationUi
];

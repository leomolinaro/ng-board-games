import { Provider } from "@angular/core";
import { WotrCharacterHandler } from "./wotr-character-handler";
import { WotrCharacterModifiers } from "./wotr-character-modifiers";
import { WotrCharacterRules } from "./wotr-character-rules";
import { WotrCharacterStore } from "./wotr-character-store";
import { WotrCharacterUi } from "./wotr-character-ui";
import { WotrCharacterAbilities } from "./wotr-characters";

export const characterProviders: Provider[] = [
  WotrCharacterHandler,
  WotrCharacterModifiers,
  WotrCharacterRules,
  WotrCharacterStore,
  WotrCharacterUi,
  WotrCharacterAbilities
];

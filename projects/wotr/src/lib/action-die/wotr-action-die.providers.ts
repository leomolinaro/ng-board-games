import { Provider } from "@angular/core";
import { WotrActionDieHandler } from "./wotr-action-die-handler";
import { WotrActionDieModifiers } from "./wotr-action-die-modifiers";
import { WotrActionDieRules } from "./wotr-action-die-rules";
import { WotrActionDieUi } from "./wotr-action-die-ui";

export const actionDieProviders: Provider[] = [
  WotrActionDieHandler,
  WotrActionDieModifiers,
  WotrActionDieRules,
  WotrActionDieUi
];

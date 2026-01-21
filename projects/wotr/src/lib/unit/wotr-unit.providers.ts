import { Provider } from "@angular/core";
import { WotrUnitHandler } from "./wotr-unit-handler";
import { WotrUnitModifiers } from "./wotr-unit-modifiers";
import { WotrUnitRules } from "./wotr-unit-rules";
import { WotrUnitUi } from "./wotr-unit-ui";
import { WotrUnitUtils } from "./wotr-unit-utils";

export const unitProviders: Provider[] = [
  WotrUnitHandler,
  WotrUnitModifiers,
  WotrUnitRules,
  WotrUnitUi,
  WotrUnitUtils
];

import { Provider } from "@angular/core";
import { WotrFellowshipHandler } from "./wotr-fellowship-handler";
import { WotrFellowshipModifiers } from "./wotr-fellowship-modifiers";
import { WotrFellowshipRules } from "./wotr-fellowship-rules";
import { WotrFellowshipStore } from "./wotr-fellowship-store";
import { WotrFellowshipUi } from "./wotr-fellowship-ui";

export const fellowshipProviders: Provider[] = [
  WotrFellowshipHandler,
  WotrFellowshipModifiers,
  WotrFellowshipRules,
  WotrFellowshipStore,
  WotrFellowshipUi
];

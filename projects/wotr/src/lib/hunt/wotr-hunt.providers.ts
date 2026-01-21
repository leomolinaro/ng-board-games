import { Provider } from "@angular/core";
import { WotrHuntFlow } from "./wotr-hunt-flow";
import { WotrHuntHandler } from "./wotr-hunt-handler";
import { WotrHuntModifiers } from "./wotr-hunt-modifiers";
import { WotrHuntStore } from "./wotr-hunt-store";
import { WotrHuntUi } from "./wotr-hunt-ui";

export const huntProviders: Provider[] = [
  WotrHuntFlow,
  WotrHuntHandler,
  WotrHuntModifiers,
  WotrHuntStore,
  WotrHuntUi
];

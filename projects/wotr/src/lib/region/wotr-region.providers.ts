import { Provider } from "@angular/core";
import { WotrRegionHandler } from "./wotr-region-handler";
import { WotrRegionStore } from "./wotr-region-store";
import { WotrRegionUi } from "./wotr-region-ui";
import { WotrRegionModifiers } from "./wotr-region-modifiers";

export const regionProviders: Provider[] = [
  WotrRegionHandler,
  WotrRegionStore,
  WotrRegionUi,
  WotrRegionModifiers
];

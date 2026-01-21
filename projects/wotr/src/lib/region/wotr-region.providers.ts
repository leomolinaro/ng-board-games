import { Provider } from "@angular/core";
import { WotrRegionHandler } from "./wotr-region-handler";
import { WotrRegionStore } from "./wotr-region-store";
import { WotrRegionUi } from "./wotr-region-ui";

export const regionProviders: Provider[] = [WotrRegionHandler, WotrRegionStore, WotrRegionUi];

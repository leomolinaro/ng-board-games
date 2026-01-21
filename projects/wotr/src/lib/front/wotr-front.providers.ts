import { Provider } from "@angular/core";
import { WotrFrontHandler } from "./wotr-front-handler";
import { WotrFrontStore } from "./wotr-front-store";
import { WotrFrontUi } from "./wotr-front-ui";

export const frontProviders: Provider[] = [WotrFrontHandler, WotrFrontStore, WotrFrontUi];

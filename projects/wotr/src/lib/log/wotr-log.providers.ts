import { Provider } from "@angular/core";
import { WotrLogStore } from "./wotr-log-store";
import { WotrLogWriter } from "./wotr-log-writer";

export const logProviders: Provider[] = [WotrLogStore, WotrLogWriter];

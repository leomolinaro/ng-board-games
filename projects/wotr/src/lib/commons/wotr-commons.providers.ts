import { Provider } from "@angular/core";
import { WotrActionRegistry } from "./wotr-action-registry";
import { WotrEventService } from "./wotr-event-service";

export const commonsProviders: Provider[] = [WotrActionRegistry, WotrEventService];

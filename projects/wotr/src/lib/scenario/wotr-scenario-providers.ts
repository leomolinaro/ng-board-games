import { Provider } from "@angular/core";
import { WotrRemoteMock } from "./mocks/wotr-remote-mock";
import { WotrScenarios } from "./wotr-scenarios";

export const scenarioProviders: Provider[] = [WotrScenarios, WotrRemoteMock];

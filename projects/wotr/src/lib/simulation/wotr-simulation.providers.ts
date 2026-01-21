import { Provider } from "@angular/core";
import { WotrRemoteMock } from "./mocks/wotr-remote-mock";
import { WotrSimulations } from "./wotr-simulations";

export const simulationProviders: Provider[] = [WotrSimulations, WotrRemoteMock];

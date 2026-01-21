import { Provider } from "@angular/core";
import { WotrAllPlayers } from "./wotr-all-players";
import { WotrFreePeoplesPlayer } from "./wotr-free-peoples-player";
import { WotrPlayerAi } from "./wotr-player-ai";
import { WotrPlayerInfoStore } from "./wotr-player-info-store";
import { WotrPlayerUi } from "./wotr-player-ui";
import { WotrShadowPlayer } from "./wotr-shadow-player";

export const playerProviders: Provider[] = [
  WotrAllPlayers,
  WotrFreePeoplesPlayer,
  WotrPlayerAi,
  WotrPlayerInfoStore,
  WotrPlayerUi,
  WotrShadowPlayer
];

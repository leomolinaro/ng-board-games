import { Provider } from "@angular/core";
import { WotrBattleHandler } from "./wotr-battle-handler";
import { WotrBattleModifiers } from "./wotr-battle-modifiers";
import { WotrBattleStore } from "./wotr-battle-store";
import { WotrBattleUi } from "./wotr-battle-ui";
import { WotrCombatCards } from "./wotr-combat-cards";

export const battleProviders: Provider[] = [
  WotrBattleHandler,
  WotrBattleModifiers,
  WotrBattleStore,
  WotrBattleUi,
  WotrCombatCards
];

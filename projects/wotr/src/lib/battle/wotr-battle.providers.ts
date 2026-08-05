import { Provider } from "@angular/core";
import { WotrCombatCards } from "./combat-cards/wotr-combat-cards";
import { WotrBattleHandler } from "./wotr-battle-handler";
import { WotrBattleModifiers } from "./wotr-battle-modifiers";
import { WotrBattleStore } from "./wotr-battle-store";
import { WotrBattleUi } from "./wotr-battle-ui";

export const battleProviders: Provider[] = [
  WotrBattleHandler,
  WotrBattleModifiers,
  WotrBattleStore,
  WotrBattleUi,
  WotrCombatCards
];

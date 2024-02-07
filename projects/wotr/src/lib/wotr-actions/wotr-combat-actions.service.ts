import { Injectable, inject } from "@angular/core";
import { WotrGameStateService } from "../wotr-elements/wotr-game-state.service";
import { WotrActionApplier } from "./wotr-action-applier";
import { WotrCombatAction } from "./wotr-combat-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrCombatActionsService {

  private g = inject (WotrGameStateService);

  getActionAppliers (): Record<WotrCombatAction["type"], WotrActionApplier<WotrCombatAction>> {
    return {
      "combat-card-choose": (action, front, state) => state,
      "combat-card-choose-not": (action, front, state) => state,
      "combat-roll": (action, front, state) => state,
    };
  }

}

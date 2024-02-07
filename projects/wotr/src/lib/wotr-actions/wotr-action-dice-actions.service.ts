import { Injectable, inject } from "@angular/core";
import { WotrGameStateService } from "../wotr-elements/wotr-game-state.service";
import { WotrActionApplier } from "./wotr-action-applier";
import { WotrActionDiceAction } from "./wotr-action-dice-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrActionDiceActionsService {

  private g = inject (WotrGameStateService);

  getActionAppliers (): Record<WotrActionDiceAction["type"], WotrActionApplier<WotrActionDiceAction>> {
    return {
      "action-dice-discard": (action, front, state) => state,
      "action-pass": (action, front, state) => state,
      "action-roll": (action, front, state) => state,
    };
  }

}

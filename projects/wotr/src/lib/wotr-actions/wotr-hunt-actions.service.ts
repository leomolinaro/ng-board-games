import { Injectable, inject } from "@angular/core";
import { WotrGameStateService } from "../wotr-elements/wotr-game-state.service";
import { WotrActionApplier } from "./wotr-action-applier";
import { WotrHuntAction } from "./wotr-hunt-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrHuntActionsService {

  private g = inject (WotrGameStateService);

  getActionAppliers (): Record<WotrHuntAction["type"], WotrActionApplier<WotrHuntAction>> {
    return {
      "hunt-allocation": (action, front, state) => state,
      "hunt-roll": (action, front, state) => state,
      "hunt-tile-add": (action, front, state) => state,
      "hunt-tile-draw": (action, front, state) => state,
    };
  }

}

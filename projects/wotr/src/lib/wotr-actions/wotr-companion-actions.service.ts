import { Injectable, inject } from "@angular/core";
import { WotrGameStateService } from "../wotr-elements/wotr-game-state.service";
import { WotrActionApplier } from "./wotr-action-applier";
import { WotrCompanionAction } from "./wotr-companion-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrCompanionActionsService {

  private g = inject (WotrGameStateService);

  getActionAppliers (): Record<WotrCompanionAction["type"], WotrActionApplier<WotrCompanionAction>> {
    return {
      "companion-elimination": (action, front, state) => state,
      "companion-movement": (action, front, state) => state,
      "companion-play": (action, front, state) => state,
      "companion-random": (action, front, state) => state,
      "companion-separation": (action, front, state) => state,
    };
  }

}

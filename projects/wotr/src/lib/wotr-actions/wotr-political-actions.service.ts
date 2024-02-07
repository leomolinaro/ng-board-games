import { Injectable, inject } from "@angular/core";
import { WotrGameStateService } from "../wotr-elements/wotr-game-state.service";
import { WotrActionApplier } from "./wotr-action-applier";
import { WotrPoliticalAction } from "./wotr-political-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrPoliticalActionsService {

  private g = inject (WotrGameStateService);

  getActionAppliers (): Record<WotrPoliticalAction["type"], WotrActionApplier<WotrPoliticalAction>> {
    return {
      "political-activation": (action, front, state) => state,
      "political-advance": (action, front, state) => state,
    };
  }

}

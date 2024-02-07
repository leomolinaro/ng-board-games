import { Injectable, inject } from "@angular/core";
import { WotrGameStateService } from "../wotr-elements/wotr-game-state.service";
import { WotrActionApplier } from "./wotr-action-applier";
import { WotrMinionAction } from "./wotr-minion-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrMinionActionsService {

  private g = inject (WotrGameStateService);

  getActionAppliers (): Record<WotrMinionAction["type"], WotrActionApplier<WotrMinionAction>> {
    return {
      "minion-elimination": (action, front, state) => state,
      "minion-movement": (action, front, state) => state,
      "minion-play": (action, front, state) => state,
      "nazgul-movement": (action, front, state) => state,
    };
  }

}

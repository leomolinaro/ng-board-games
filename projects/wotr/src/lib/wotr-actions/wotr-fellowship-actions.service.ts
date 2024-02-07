import { Injectable, inject } from "@angular/core";
import { WotrGameStateService } from "../wotr-elements/wotr-game-state.service";
import { WotrActionApplier } from "./wotr-action-applier";
import { WotrFellowshipAction } from "./wotr-fellowship-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrFellowshipActionsService {

  private g = inject (WotrGameStateService);

  getActionAppliers (): Record<WotrFellowshipAction["type"], WotrActionApplier<WotrFellowshipAction>> {
    return {
      "fellowship-corruption": (action, front, state) => state,
      "fellowship-declare": (action, front, state) => state,
      "fellowship-declare-not": (action, front, state) => state,
      "fellowship-guide": (action, front, state) => state,
      "fellowship-hide": (action, front, state) => state,
      "fellowship-progress": (action, front, state) => state,
      "fellowship-reveal": (action, front, state) => state,
    };
  }

}

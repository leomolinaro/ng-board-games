import { Injectable, inject } from "@angular/core";
import { WotrGameStateService } from "../wotr-elements/wotr-game-state.service";
import { WotrActionApplier } from "./wotr-action-applier";
import { WotrArmyAction } from "./wotr-army-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrArmyActionsService {

  private g = inject (WotrGameStateService);

  getActionAppliers (): Record<WotrArmyAction["type"], WotrActionApplier<WotrArmyAction>> {
    return {
      "army-attack": (action, front, state) => state,
      "army-movement": (action, front, state) => state,
      "army-retreat-into-siege": (action, front, state) => state,
      "unit-elimination": (action, front, state) => state,
      "unit-recruitment": (action, front, state) => state,
    };
  }

}

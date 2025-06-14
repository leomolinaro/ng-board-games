import { inject, Injectable } from "@angular/core";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameUiStore } from "../game/wotr-game-ui.store";
import { WotrNazgulMovement } from "./wotr-unit-actions";

@Injectable({ providedIn: "root" })
export class WotrUnitPlayerService {
  private ui = inject(WotrGameUiStore);

  async moveNazgulMinions(frontId: WotrFrontId): Promise<WotrNazgulMovement[]> {
    throw new Error("Method not implemented.");
  }
}

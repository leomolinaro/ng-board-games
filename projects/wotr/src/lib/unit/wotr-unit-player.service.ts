import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameUiStore } from "../game/wotr-game-ui.store";
import { WotrNazgulMovement } from "./wotr-unit-actions";
import { WotrUnitService } from "./wotr-unit.service";

@Injectable({ providedIn: "root" })
export class WotrUnitPlayerService {
  private ui = inject(WotrGameUiStore);
  private unitService = inject(WotrUnitService);

  async moveNazgulMinions(frontId: WotrFrontId): Promise<WotrNazgulMovement[]> {
    throw new Error("Method not implemented.");
  }

  async moveArmies(numberOfMoves: number, frontId: WotrFrontId): Promise<WotrAction[]> {
    let continueMoving = false;
    let doneMoves = 0;
    do {
      const candidateRegions = this.unitService.moveArmiesStartingRegions(frontId);
      const army = await this.ui.askRegionUnits("Select units to move", {
        regionIds: candidateRegions,
        underSiege: false
      });
      throw new Error("Method not implemented.");

      doneMoves++;
      if (doneMoves < numberOfMoves) {
        continueMoving = await this.ui.askConfirm("Continue moving armies?");
      }
    } while (continueMoving);
  }
}

import { inject, Injectable } from "@angular/core";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameUi } from "../game/wotr-game-ui.store";
import { WotrNation, WotrNationId } from "./wotr-nation.models";
import { WotrNationStore } from "./wotr-nation.store";

@Injectable({ providedIn: "root" })
export class WotrNationUi {
  private ui = inject(WotrGameUi);
  private nation = inject(WotrNationStore);

  async politicalAdvance(frontId: WotrFrontId): Promise<WotrNationId> {
    const validNations = this.advanceableNations(frontId);
    if (validNations.length === 0) {
      throw new Error("No nations can advance politically");
    }
    const nation = await this.ui.askNation("Choose a nation to advance politically", validNations);
    return nation;
  }

  private advanceableNations(frontId: WotrFrontId): WotrNationId[] {
    return this.nation
      .nations()
      .filter(nation => nation.front === frontId && this.canAdvance(nation))
      .map(nation => nation.id);
  }

  canAdvance(nation: WotrNation): boolean {
    if (nation.politicalStep === 3 || nation.politicalStep === 2) {
      return true;
    }
    if (nation.politicalStep === 1 && nation.active) {
      return true;
    }
    return false;
  }
}

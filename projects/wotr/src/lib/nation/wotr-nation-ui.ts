import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameUi, WotrUiChoice } from "../game/wotr-game-ui";
import { advanceNation } from "./wotr-nation-actions";
import { WotrNationHandler } from "./wotr-nation-handler";
import { WotrNation, WotrNationId } from "./wotr-nation-models";
import { WotrNationRules } from "./wotr-nation-rules";
import { WotrNationStore } from "./wotr-nation-store";

@Injectable({ providedIn: "root" })
export class WotrNationUi {
  private ui = inject(WotrGameUi);
  private nation = inject(WotrNationStore);
  private nationRules = inject(WotrNationRules);
  private nationHandler = inject(WotrNationHandler);

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

  async advanceNation(nationId: WotrNationId): Promise<WotrAction | null> {
    const nation = this.nation.nation(nationId);
    if (!this.canAdvance(nation)) return null;
    await this.ui.askContinue(`Advance the ${nation.name} nation`);
    this.nationHandler.advanceNation(1, nationId);
    return advanceNation(nationId);
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

  diplomaticActionChoice: WotrUiChoice = {
    label: () => "Diplomatic action",
    isAvailable: frontId => this.nationRules.canFrontAdvancePoliticalTrack(frontId),
    actions: async frontId => {
      const nation = await this.politicalAdvance(frontId);
      return [advanceNation(nation, 1)];
    }
  };
}

import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameUi, WotrUiChoice } from "../game/wotr-game-ui";
import { advanceNation } from "./wotr-nation-actions";
import { WotrNationHandler } from "./wotr-nation-handler";
import { WotrNationId } from "./wotr-nation-models";
import { WotrNationAdvanceSource, WotrNationRules } from "./wotr-nation-rules";
import { WotrNationStore } from "./wotr-nation-store";

@Injectable({ providedIn: "root" })
export class WotrNationUi {
  private ui = inject(WotrGameUi);
  private nation = inject(WotrNationStore);
  private nationRules = inject(WotrNationRules);
  private nationHandler = inject(WotrNationHandler);

  async politicalAdvance(
    frontId: WotrFrontId,
    source: WotrNationAdvanceSource
  ): Promise<WotrNationId> {
    const validNations = this.advanceableNations(frontId, source);
    if (validNations.length === 0) {
      throw new Error("No nations can advance politically");
    }
    const nation = await this.ui.askNation("Choose a nation to advance politically", validNations);
    return nation;
  }

  private advanceableNations(
    frontId: WotrFrontId,
    source: WotrNationAdvanceSource
  ): WotrNationId[] {
    return this.nation
      .nations()
      .filter(
        nation =>
          nation.front === frontId && this.nationRules.canAdvancePoliticalTrack(nation, source)
      )
      .map(nation => nation.id);
  }

  async advanceNation(
    nationId: WotrNationId,
    source: WotrNationAdvanceSource
  ): Promise<WotrAction | null> {
    const nation = this.nation.nation(nationId);
    if (!this.nationRules.canAdvancePoliticalTrack(nation, source)) return null;
    await this.ui.askContinue(`Advance the ${nation.name} nation`);
    this.nationHandler.advanceNation(1, nationId, source);
    return advanceNation(nationId);
  }

  diplomaticActionChoice: WotrUiChoice = {
    label: () => "Diplomatic action",
    isAvailable: frontId =>
      this.nationRules.canFrontAdvancePoliticalTrack(frontId, "muster-die-result"),
    actions: async frontId => {
      const nation = await this.politicalAdvance(frontId, "muster-die-result");
      return [advanceNation(nation, 1)];
    }
  };
}

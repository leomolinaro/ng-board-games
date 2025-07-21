import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrPlayerChoice } from "../game/wotr-game-ui.store";
import { advanceNation } from "./wotr-nation-actions";
import { WotrNationUi } from "./wotr-nation-ui";
import { WotrNationRules } from "./wotr-nation-rules";

@Injectable({ providedIn: "root" })
export class WotrDiplomaticActionChoice implements WotrPlayerChoice {
  private nationRules = inject(WotrNationRules);
  private nationPlayer = inject(WotrNationUi);

  label(): string {
    return "Diplomatic action";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.nationRules.canFrontAdvancePoliticalTrack(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    const nation = await this.nationPlayer.politicalAdvance(frontId);
    return [advanceNation(nation, 1)];
  }
}

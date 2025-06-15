import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrPlayerChoice } from "../game/wotr-game-ui.store";
import { advanceNation } from "./wotr-nation-actions";
import { WotrNationPlayerService } from "./wotr-nation-player.service";
import { WotrNationService } from "./wotr-nation.service";

@Injectable({ providedIn: "root" })
export class WotrDiplomaticActionChoice implements WotrPlayerChoice {
  private nationService = inject(WotrNationService);
  private nationPlayer = inject(WotrNationPlayerService);

  label(): string {
    return "Diplomatic action";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.nationService.canFrontAdvancePoliticalTrack(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    const nation = await this.nationPlayer.politicalAdvance(frontId);
    return [advanceNation(nation, 1)];
  }
}

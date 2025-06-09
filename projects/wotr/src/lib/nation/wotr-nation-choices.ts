import { WotrActionPlayerChoice } from "../action-die/wotr-action-die-choices";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { advanceNation } from "./wotr-nation-actions";
import { WotrNationPlayerService } from "./wotr-nation-player.service";
import { WotrNationService } from "./wotr-nation.service";

export class WotrDiplomaticActionChoice implements WotrActionPlayerChoice {
  constructor(
    private frontId: WotrFrontId,
    private nationService: WotrNationService,
    private nationPlayer: WotrNationPlayerService
  ) {}

  label(): string {
    return "Diplomatic action";
  }

  isAvailable(): boolean {
    return this.nationService.canFrontAdvancePoliticalTrack(this.frontId);
  }

  async resolve(): Promise<WotrAction[]> {
    const nation = await this.nationPlayer.politicalAdvance(this.frontId);
    return [advanceNation(nation, 1)];
  }
}

import { WotrActionPlayerChoice } from "../action/wotr-action-choices";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";

export class WotrDiplomaticActionChoice implements WotrActionPlayerChoice {
  constructor(private frontId: WotrFrontId) {}

  label(): string {
    return "Diplomatic action";
  }

  isAvailable(): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

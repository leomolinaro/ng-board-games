import { WotrActionPlayerChoice } from "../action-die/wotr-action-die-choices";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";

export class WotrFellowshipProgressChoice implements WotrActionPlayerChoice {
  constructor() {}

  label(): string {
    return "Fellowship progress";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

export class WotrHideFellowshipChoice implements WotrActionPlayerChoice {
  constructor() {}

  label(): string {
    return "Hide fellowship";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

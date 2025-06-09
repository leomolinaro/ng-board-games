import { WotrActionPlayerChoice } from "../action-die/wotr-action-die-choices";
import { WotrAction } from "../commons/wotr-action.models";

export class WotrFellowshipProgressChoice implements WotrActionPlayerChoice {
  constructor() {}

  label(): string {
    return "Fellowship progress";
  }

  isAvailable(): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

export class WotrHideFellowshipChoice implements WotrActionPlayerChoice {
  constructor() {}

  label(): string {
    return "Hide fellowship";
  }

  isAvailable(): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

import { WotrActionPlayerChoice } from "../action/wotr-action-choices";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrCharacterId } from "./wotr-character.models";

export class WotrBringCharacterIntoPlayChoice implements WotrActionPlayerChoice {
  constructor(
    private characters: WotrCharacterId[],
    private frontId: WotrFrontId
  ) {}

  label(): string {
    return "Bring character into play";
  }

  isAvailable(): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

export class WotrSeparateCompanionsChoice implements WotrActionPlayerChoice {
  constructor() {}

  label(): string {
    return "Separate companions";
  }

  isAvailable(): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

export class WotrMoveCompanionsChoice implements WotrActionPlayerChoice {
  constructor() {}

  label(): string {
    return "Move companions";
  }

  isAvailable(): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

export class WotrMoveMinionsChoice implements WotrActionPlayerChoice {
  constructor() {}

  label(): string {
    return "Move minions";
  }

  isAvailable(): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

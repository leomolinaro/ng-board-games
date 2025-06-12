import { WotrActionPlayerChoice } from "../action-die/wotr-action-die-choices";
import { WotrActionDie } from "../action-die/wotr-action-die.models";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrCharactersService } from "./wotr-characters.service";

export class WotrBringCharacterIntoPlayChoice implements WotrActionPlayerChoice {
  constructor(
    private die: WotrActionDie,
    private frontId: WotrFrontId,
    private charactersService: WotrCharactersService
  ) {}

  label(): string {
    return "Bring character into play";
  }

  isAvailable(): boolean {
    return this.charactersService.someCharacterCanBeBroughtIntoPlay(this.die, this.frontId);
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

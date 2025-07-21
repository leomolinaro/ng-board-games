import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrPlayerChoice } from "../game/wotr-game-ui.store";
import { skipActionDie } from "./wotr-action-die-actions";
import { WotrActionDieUi } from "./wotr-action-die-ui";
import { WotrActionDie } from "./wotr-action-die.models";

export class WotrChangeCharacterDieChoice implements WotrPlayerChoice {
  constructor(private actionPlayerService: WotrActionDieUi) {}

  label(): string {
    return "Character result";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return true;
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.actionPlayerService.resolveCharacterResult(frontId);
  }
}

export class WotrChangeArmyDieChoice implements WotrPlayerChoice {
  constructor(private actionPlayerService: WotrActionDieUi) {}
  label(): string {
    return "Army result";
  }
  isAvailable(frontId: WotrFrontId): boolean {
    return true;
  }
  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.actionPlayerService.resolveArmyResult(frontId);
  }
}

export class WotrChangeMusterDieChoice implements WotrPlayerChoice {
  constructor(private actionPlayerService: WotrActionDieUi) {}

  label(): string {
    return "Muster result";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return true;
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.actionPlayerService.resolveMusterResult(frontId);
  }
}

export class WotrChangeEventDieChoice implements WotrPlayerChoice {
  constructor(private actionPlayerService: WotrActionDieUi) {}

  label(): string {
    return "Event result";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return true;
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.actionPlayerService.resolveEventResult(frontId);
  }
}

export class WotrSkipDieChoice implements WotrPlayerChoice {
  constructor(private die: WotrActionDie) {}

  label(): string {
    return "Skip the action die";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return true;
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return [skipActionDie(this.die)];
  }
}

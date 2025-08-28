import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrUiChoice } from "../game/wotr-game-ui";
import { skipActionDie } from "./wotr-action-die-actions";
import { WotrActionDie } from "./wotr-action-die-models";
import { WotrActionDieUi } from "./wotr-action-die-ui";

export class WotrChangeCharacterDieChoice implements WotrUiChoice {
  constructor(private actionPlayerService: WotrActionDieUi) {}

  label(): string {
    return "Character result";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return true;
  }

  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    return (await this.actionPlayerService.resolveCharacterResult("will-of-the-west", frontId))
      .actions;
  }
}

export class WotrChangeArmyDieChoice implements WotrUiChoice {
  constructor(private actionPlayerService: WotrActionDieUi) {}
  label(): string {
    return "Army result";
  }
  isAvailable(frontId: WotrFrontId): boolean {
    return true;
  }
  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    return (await this.actionPlayerService.resolveArmyResult("will-of-the-west", frontId)).actions;
  }
}

export class WotrChangeMusterDieChoice implements WotrUiChoice {
  constructor(private actionPlayerService: WotrActionDieUi) {}

  label(): string {
    return "Muster result";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return true;
  }

  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    return (await this.actionPlayerService.resolveMusterResult("will-of-the-west", frontId))
      .actions;
  }
}

export class WotrChangeEventDieChoice implements WotrUiChoice {
  constructor(private actionPlayerService: WotrActionDieUi) {}

  label(): string {
    return "Event result";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return true;
  }

  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    return (await this.actionPlayerService.resolveEventResult("will-of-the-west", frontId)).actions;
  }
}

export class WotrSkipDieChoice implements WotrUiChoice {
  constructor(private die: WotrActionDie) {}

  label(): string {
    return "Skip the action die";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return true;
  }

  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    return [skipActionDie(this.die)];
  }
}

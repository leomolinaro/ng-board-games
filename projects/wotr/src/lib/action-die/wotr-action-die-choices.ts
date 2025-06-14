import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { skipActionDie } from "./wotr-action-die-actions";
import { WotrActionPlayerService } from "./wotr-action-die-player.service";
import { WotrActionDie } from "./wotr-action-die.models";

export interface WotrActionPlayerChoice {
  label(): string;
  isAvailable(frontId: WotrFrontId): boolean;
  resolve(frontId: WotrFrontId): Promise<WotrAction[]>;
}

export class WotrChangeCharacterDieChoice implements WotrActionPlayerChoice {
  constructor(
    private frontId: WotrFrontId,
    private actionPlayerService: WotrActionPlayerService
  ) {}

  label(): string {
    return "Character result";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return true;
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.actionPlayerService.resolveCharacterResult(this.frontId);
  }
}

export class WotrChangeArmyDieChoice implements WotrActionPlayerChoice {
  constructor(
    private frontId: WotrFrontId,
    private actionPlayerService: WotrActionPlayerService
  ) {}
  label(): string {
    return "Army result";
  }
  isAvailable(frontId: WotrFrontId): boolean {
    return true;
  }
  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.actionPlayerService.resolveArmyResult(this.frontId);
  }
}

export class WotrChangeMusterDieChoice implements WotrActionPlayerChoice {
  constructor(
    private frontId: WotrFrontId,
    private actionPlayerService: WotrActionPlayerService
  ) {}

  label(): string {
    return "Muster result";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return true;
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.actionPlayerService.resolveMusterResult(this.frontId);
  }
}

export class WotrChangeEventDieChoice implements WotrActionPlayerChoice {
  constructor(
    private frontId: WotrFrontId,
    private actionPlayerService: WotrActionPlayerService
  ) {}

  label(): string {
    return "Event result";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return true;
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.actionPlayerService.resolveEventResult(this.frontId);
  }
}

export class WotrSkipDieChoice implements WotrActionPlayerChoice {
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

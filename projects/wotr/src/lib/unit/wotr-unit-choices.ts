import { WotrActionPlayerChoice } from "../action-die/wotr-action-die-choices";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrUnitPlayerService } from "./wotr-unit-player.service";
import { WotrUnitService } from "./wotr-unit.service";

export class WotrAttackArmyChoice implements WotrActionPlayerChoice {
  constructor(private frontId: WotrFrontId) {}

  label(): string {
    return "Attack";
  }

  isAvailable(): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

export class WotrMoveArmiesChoice implements WotrActionPlayerChoice {
  constructor(private frontId: WotrFrontId) {}

  label(): string {
    return "Move armies";
  }

  isAvailable(): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

export class WotrRecruitReinforcementsChoice implements WotrActionPlayerChoice {
  constructor(
    private frontId: WotrFrontId,
    private unitService: WotrUnitService,
    private unitPlayer: WotrUnitPlayerService
  ) {}

  label(): string {
    return "Recruit reinforcements";
  }

  isAvailable(): boolean {
    return this.unitService.canFrontRecruitReinforcements(this.frontId);
  }

  async resolve(): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

export class WotrLeaderArmyMoveChoice implements WotrActionPlayerChoice {
  constructor(private frontId: WotrFrontId) {}

  label(): string {
    return "Move army with leader";
  }

  isAvailable(): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

export class WotrLeaderArmyAttackChoice implements WotrActionPlayerChoice {
  constructor(private frontId: WotrFrontId) {}

  label(): string {
    return "Attack with leader";
  }

  isAvailable(): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

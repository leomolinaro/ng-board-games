import { inject, Injectable } from "@angular/core";
import { WotrActionPlayerChoice } from "../action-die/wotr-action-die-choices";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrUnitService } from "./wotr-unit.service";

export class WotrAttackArmyChoice implements WotrActionPlayerChoice {
  constructor(
    private frontId: WotrFrontId,
    private unitService: WotrUnitService
  ) {}

  label(): string {
    return "Attack";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitService.canFrontAttackArmies(this.frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

export class WotrMoveArmiesChoice implements WotrActionPlayerChoice {
  constructor(
    private frontId: WotrFrontId,
    private unitService: WotrUnitService
  ) {}

  label(): string {
    return "Move armies";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitService.canFrontMoveArmies(this.frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

Injectable();
export class WotrRecruitReinforcementsChoice implements WotrActionPlayerChoice {
  private unitService = inject(WotrUnitService);

  label(): string {
    return "Recruit reinforcements";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitService.canFrontRecruitReinforcements(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

export class WotrLeaderArmyMoveChoice implements WotrActionPlayerChoice {
  label(): string {
    return "Move army with leader";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

export class WotrLeaderArmyAttackChoice implements WotrActionPlayerChoice {
  constructor(private frontId: WotrFrontId) {}

  label(): string {
    return "Attack with leader";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

import { WotrActionPlayerChoice } from "../action/wotr-action-choices";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";

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
  constructor(private frontId: WotrFrontId) {}

  label(): string {
    return "Recruit reinforcements";
  }

  isAvailable(): boolean {
    throw new Error("Method not implemented.");
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

import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrPlayerChoice } from "../game/wotr-game-ui.store";
import { WotrUnitService } from "./wotr-unit.service";

@Injectable({ providedIn: "root" })
export class WotrAttackArmyChoice implements WotrPlayerChoice {
  private unitService = inject(WotrUnitService);

  label(): string {
    return "Attack";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitService.canFrontAttackArmies(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

@Injectable({ providedIn: "root" })
export class WotrMoveArmiesChoice implements WotrPlayerChoice {
  private unitService = inject(WotrUnitService);

  label(): string {
    return "Move armies";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitService.canFrontMoveArmies(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

@Injectable({ providedIn: "root" })
export class WotrRecruitReinforcementsChoice implements WotrPlayerChoice {
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

@Injectable({ providedIn: "root" })
export class WotrLeaderArmyMoveChoice implements WotrPlayerChoice {
  private unitService = inject(WotrUnitService);
  label(): string {
    return "Move army with leader";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitService.canFrontMoveArmiesWithLeader(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

@Injectable({ providedIn: "root" })
export class WotrLeaderArmyAttackChoice implements WotrPlayerChoice {
  private unitService = inject(WotrUnitService);

  label(): string {
    return "Attack with leader";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitService.canFrontAttackArmiesWithLeader(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

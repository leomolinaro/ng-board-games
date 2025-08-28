import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrUiChoice } from "../game/wotr-game-ui";
import { moveArmies } from "./wotr-unit-actions";
import { WotrUnitRules } from "./wotr-unit-rules";
import { WotrUnitUi } from "./wotr-unit-ui";

@Injectable({ providedIn: "root" })
export class WotrAttackArmyChoice implements WotrUiChoice {
  private unitRules = inject(WotrUnitRules);
  private unitUi = inject(WotrUnitUi);

  label(): string {
    return "Attack";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitRules.canFrontAttack(frontId);
  }

  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.unitUi.attack(frontId);
  }
}

@Injectable({ providedIn: "root" })
export class WotrMoveArmiesChoice implements WotrUiChoice {
  private unitRules = inject(WotrUnitRules);
  private unitUi = inject(WotrUnitUi);

  label(): string {
    return "Move armies";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitRules.canFrontMoveArmies(frontId);
  }

  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    const movements = await this.unitUi.moveArmies(2, frontId);
    return [moveArmies(...movements)];
  }
}

@Injectable({ providedIn: "root" })
export class WotrRecruitReinforcementsChoice implements WotrUiChoice {
  private unitRules = inject(WotrUnitRules);
  private unitUi = inject(WotrUnitUi);

  label(): string {
    return "Recruit reinforcements";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitRules.canFrontRecruitReinforcements(frontId);
  }

  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.unitUi.recrtuiUnits(frontId);
  }
}

@Injectable({ providedIn: "root" })
export class WotrLeaderArmyMoveChoice implements WotrUiChoice {
  private unitRules = inject(WotrUnitRules);
  private unitUi = inject(WotrUnitUi);

  label(): string {
    return "Move army with leader";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitRules.canFrontMoveArmiesWithLeader(frontId);
  }

  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    const movement = await this.unitUi.moveArmyWithLeader(frontId);
    return [moveArmies(movement)];
  }
}

@Injectable({ providedIn: "root" })
export class WotrLeaderArmyAttackChoice implements WotrUiChoice {
  private unitRules = inject(WotrUnitRules);
  private unitUi = inject(WotrUnitUi);

  label(): string {
    return "Attack with leader";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitRules.canFrontAttackWithLeader(frontId);
  }

  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.unitUi.attackWithLeader(frontId);
  }
}

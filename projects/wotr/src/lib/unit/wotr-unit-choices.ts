import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameUi, WotrPlayerChoice } from "../game/wotr-game-ui";
import { WotrNationStore } from "../nation/wotr-nation-store";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import {
  moveArmies,
  recruitEliteUnit,
  recruitLeader,
  recruitNazgul,
  recruitRegularUnit
} from "./wotr-unit-actions";
import { WotrRecruitmentConstraints, WotrUnitHandler } from "./wotr-unit-handler";
import { WotrUnitRules } from "./wotr-unit-rules";
import { WotrUnitUi } from "./wotr-unit-ui";

@Injectable({ providedIn: "root" })
export class WotrAttackArmyChoice implements WotrPlayerChoice {
  private unitRules = inject(WotrUnitRules);
  private unitPlayerService = inject(WotrUnitUi);

  label(): string {
    return "Attack";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitRules.canFrontAttack(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.unitPlayerService.attack(frontId);
  }
}

@Injectable({ providedIn: "root" })
export class WotrMoveArmiesChoice implements WotrPlayerChoice {
  private unitRules = inject(WotrUnitRules);
  private unitPlayerService = inject(WotrUnitUi);

  label(): string {
    return "Move armies";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitRules.canFrontMoveArmies(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    const movements = await this.unitPlayerService.moveArmies(2, frontId);
    return [moveArmies(...movements)];
  }
}

@Injectable({ providedIn: "root" })
export class WotrRecruitReinforcementsChoice implements WotrPlayerChoice {
  private unitRules = inject(WotrUnitRules);
  private unitHandler = inject(WotrUnitHandler);
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);
  private unitPlayerService = inject(WotrUnitUi);
  private ui = inject(WotrGameUi);

  label(): string {
    return "Recruit reinforcements";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitRules.canFrontRecruitReinforcements(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    const actions: WotrAction[] = [];
    let points = 0;
    const exludedRegions = new Set<WotrRegionId>();
    while (points < 2) {
      const constraints: WotrRecruitmentConstraints = {
        points: 2 - points,
        exludedRegions: exludedRegions
      };
      const validUnits = this.unitRules.validFrontReinforcementUnits(frontId, constraints);
      const unit = await this.ui.askReinforcementUnit("Choose a unit to recruit", {
        units: validUnits,
        frontId: frontId
      });
      points += unit.type === "elite" ? 2 : 1;
      const nation = this.nationStore.nation(unit.nation);
      const validRegions = this.regionStore
        .recruitmentRegions(nation)
        .filter(r => !exludedRegions.has(r.id));
      const regionId = await this.ui.askRegion(
        "Choose a region to recruit in",
        validRegions.map(r => r.id)
      );
      exludedRegions.add(regionId);
      switch (unit.type) {
        case "regular": {
          const action = recruitRegularUnit(regionId, unit.nation, 1);
          this.unitHandler.recruitRegularUnit(action);
          actions.push(action);
          break;
        }
        case "elite": {
          const action = recruitEliteUnit(regionId, unit.nation, 1);
          this.unitHandler.recruitEliteUnit(action);
          actions.push(action);
          break;
        }
        case "leader": {
          const action = recruitLeader(regionId, unit.nation, 1);
          this.unitHandler.recruitLeader(action);
          actions.push(action);
          break;
        }
        case "nazgul": {
          const action = recruitNazgul(regionId, 1);
          this.unitHandler.recruitNazgul(action);
          actions.push(action);
          break;
        }
      }
      actions.push(...(await this.unitPlayerService.checkStackingLimit(regionId, frontId)));
    }
    return actions;
  }
}

@Injectable({ providedIn: "root" })
export class WotrLeaderArmyMoveChoice implements WotrPlayerChoice {
  private unitRules = inject(WotrUnitRules);
  private unitPlayerService = inject(WotrUnitUi);

  label(): string {
    return "Move army with leader";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitRules.canFrontMoveArmiesWithLeader(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    const movement = await this.unitPlayerService.moveArmyWithLeader(frontId);
    return [moveArmies(movement)];
  }
}

@Injectable({ providedIn: "root" })
export class WotrLeaderArmyAttackChoice implements WotrPlayerChoice {
  private unitRules = inject(WotrUnitRules);
  private unitPlayerService = inject(WotrUnitUi);

  label(): string {
    return "Attack with leader";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitRules.canFrontAttackWithLeader(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.unitPlayerService.attackWithLeader(frontId);
  }
}

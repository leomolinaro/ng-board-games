import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameUiStore, WotrPlayerChoice } from "../game/wotr-game-ui.store";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import {
  moveArmies,
  recruitEliteUnit,
  recruitLeader,
  recruitNazgul,
  recruitRegularUnit
} from "./wotr-unit-actions";
import { WotrUnitPlayerService } from "./wotr-unit-player.service";
import { WotrRecruitmentConstraints, WotrUnitService } from "./wotr-unit.service";

@Injectable({ providedIn: "root" })
export class WotrAttackArmyChoice implements WotrPlayerChoice {
  private unitService = inject(WotrUnitService);
  private unitPlayerService = inject(WotrUnitPlayerService);

  label(): string {
    return "Attack";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitService.canFrontAttack(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.unitPlayerService.attack(frontId);
  }
}

@Injectable({ providedIn: "root" })
export class WotrMoveArmiesChoice implements WotrPlayerChoice {
  private unitService = inject(WotrUnitService);
  private unitPlayerService = inject(WotrUnitPlayerService);

  label(): string {
    return "Move armies";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitService.canFrontMoveArmies(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    const movements = await this.unitPlayerService.moveArmies(2, frontId);
    return [moveArmies(...movements)];
  }
}

@Injectable({ providedIn: "root" })
export class WotrRecruitReinforcementsChoice implements WotrPlayerChoice {
  private unitService = inject(WotrUnitService);
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);
  private unitPlayerService = inject(WotrUnitPlayerService);
  private ui = inject(WotrGameUiStore);

  label(): string {
    return "Recruit reinforcements";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitService.canFrontRecruitReinforcements(frontId);
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
      const validUnits = this.unitService.validFrontReinforcementUnits(frontId, constraints);
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
          this.unitService.recruitRegularUnit(action);
          actions.push(action);
          break;
        }
        case "elite": {
          const action = recruitEliteUnit(regionId, unit.nation, 1);
          this.unitService.recruitEliteUnit(action);
          actions.push(action);
          break;
        }
        case "leader": {
          const action = recruitLeader(regionId, unit.nation, 1);
          this.unitService.recruitLeader(action);
          actions.push(action);
          break;
        }
        case "nazgul": {
          const action = recruitNazgul(regionId, 1);
          this.unitService.recruitNazgul(action);
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
  private unitService = inject(WotrUnitService);
  private unitPlayerService = inject(WotrUnitPlayerService);

  label(): string {
    return "Move army with leader";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitService.canFrontMoveArmiesWithLeader(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    const movement = await this.unitPlayerService.moveArmyWithLeader(frontId);
    return [moveArmies(movement)];
  }
}

@Injectable({ providedIn: "root" })
export class WotrLeaderArmyAttackChoice implements WotrPlayerChoice {
  private unitService = inject(WotrUnitService);
  private unitPlayerService = inject(WotrUnitPlayerService);

  label(): string {
    return "Attack with leader";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.unitService.canFrontAttackWithLeader(frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.unitPlayerService.attackWithLeader(frontId);
  }
}

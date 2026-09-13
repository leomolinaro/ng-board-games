import { Injectable } from '@angular/core';
import { WotrModifier } from '../commons/wotr-modifier';
import type { WotrFrontId } from '../front/wotr-front-models';
import type {
  WotrArmyUnitType,
  WotrNationId,
} from '../nation/wotr-nation-models';
import type { WotrRegionId } from '../region/wotr-region-models';
import type { WotrRecruitmentConstraints } from './wotr-unit-handler';
import type { WotrArmy } from './wotr-unit-models';

export type WotrLeaderModifier = (
  unitType: WotrArmyUnitType,
  nationId: WotrNationId,
) => boolean;
export type WotrCanMoveIntoRegionModifier = (
  regionId: WotrRegionId,
  frontId: WotrFrontId,
) => boolean;
export type WotrCanAttackRegionModifier = (
  regionId: WotrRegionId,
  frontId: WotrFrontId,
) => boolean;
export type WotrRecruitmentConstraintsModifier = (
  constraints: WotrRecruitmentConstraints,
) => void;

@Injectable()
export class WotrUnitModifiers {
  public readonly leaderModifier = new WotrModifier<WotrLeaderModifier>();

  nLeaders(army: WotrArmy): number {
    let nLeaders = 0;
    if (army.regulars)
      for (const unit of army.regulars) {
        if (this.isLeader('regular', unit.nation)) nLeaders += unit.quantity;
      }
    if (army.elites)
      for (const unit of army.elites) {
        if (this.isLeader('elite', unit.nation)) nLeaders += unit.quantity;
      }
    return nLeaders;
  }

  isLeader(unitType: WotrArmyUnitType, nationId: WotrNationId): boolean {
    return this.leaderModifier
      .get()
      .some((modifier) => modifier(unitType, nationId));
  }

  public readonly canMoveIntoRegionModifier =
    new WotrModifier<WotrCanMoveIntoRegionModifier>();

  canMoveIntoRegion(regionId: WotrRegionId, frontId: WotrFrontId): boolean {
    return this.canMoveIntoRegionModifier
      .get()
      .every((modifier) => modifier(regionId, frontId));
  }

  public readonly canAttackRegionModifier =
    new WotrModifier<WotrCanAttackRegionModifier>();

  canAttackRegion(regionId: WotrRegionId, frontId: WotrFrontId): boolean {
    return this.canAttackRegionModifier
      .get()
      .every((modifier) => modifier(regionId, frontId));
  }

  public readonly recruitmentConstraintsModifier =
    new WotrModifier<WotrRecruitmentConstraintsModifier>();

  modifyRecruitmentConstraints(constraints: WotrRecruitmentConstraints): void {
    for (const modifier of this.recruitmentConstraintsModifier.get()) {
      modifier(constraints);
    }
  }

  clear(): void {
    this.leaderModifier.clear();
    this.canMoveIntoRegionModifier.clear();
    this.canAttackRegionModifier.clear();
    this.recruitmentConstraintsModifier.clear();
  }
}

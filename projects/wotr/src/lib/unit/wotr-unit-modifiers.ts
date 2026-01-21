import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrArmyUnitType, WotrNationId } from "../nation/wotr-nation-models";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrArmy } from "./wotr-unit-models";

export type WotrLeaderModifier = (unitType: WotrArmyUnitType, nationId: WotrNationId) => boolean;
export type WotrCanMoveIntoRegionModifier = (
  regionId: WotrRegionId,
  frontId: WotrFrontId
) => boolean;
export type WotrCanAttackRegionModifier = (regionId: WotrRegionId, frontId: WotrFrontId) => boolean;

@Injectable()
export class WotrUnitModifiers {
  public readonly leaderModifier = new WotrModifier<WotrLeaderModifier>();

  nLeaders(army: WotrArmy): number {
    let nLeaders = 0;
    army.regulars?.forEach(unit => {
      if (this.isLeader("regular", unit.nation)) nLeaders += unit.quantity;
    });
    army.elites?.forEach(unit => {
      if (this.isLeader("elite", unit.nation)) nLeaders += unit.quantity;
    });
    return nLeaders;
  }

  isLeader(unitType: WotrArmyUnitType, nationId: WotrNationId): boolean {
    return this.leaderModifier.get().some(modifier => modifier(unitType, nationId));
  }

  public readonly canMoveIntoRegionModifier = new WotrModifier<WotrCanMoveIntoRegionModifier>();

  canMoveIntoRegion(regionId: WotrRegionId, frontId: WotrFrontId): boolean {
    return this.canMoveIntoRegionModifier.get().every(modifier => modifier(regionId, frontId));
  }

  public readonly canAttackRegionModifier = new WotrModifier<WotrCanAttackRegionModifier>();

  canAttackRegion(regionId: WotrRegionId, frontId: WotrFrontId): boolean {
    return this.canAttackRegionModifier.get().every(modifier => modifier(regionId, frontId));
  }

  clear() {
    this.leaderModifier.clear();
    this.canMoveIntoRegionModifier.clear();
    this.canAttackRegionModifier.clear();
  }
}
